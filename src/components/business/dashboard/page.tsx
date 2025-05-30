"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Star,
  LinkIcon,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Sidebar from "../../sidebar";
import { auth, db } from "@/firebase/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  createdAt: { seconds: number };
  status: string;
}

export default function BusinessDashboard() {
  const [period, setPeriod] = useState("week");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    linkClicks: 0,
    responseRate: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists() || !userDoc.data()?.businessFormFilled) {
            navigate("/businessform");
            return;
          }

          // Get business data from user document
          const businessData = userDoc.data()?.businessInfo || {};
          setBusinessName(businessData.businessName || "");

          // Get reviews from subcollection
          const reviewsQuery = query(
            collection(db, "users", user.uid, "reviews"),
            where("status", "==", "published")
          );
          
          const querySnapshot = await getDocs(reviewsQuery);
          const reviewsData: Review[] = [];
          let totalRating = 0;
          const ratingCounts = [0, 0, 0, 0, 0];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            reviewsData.push({
              id: doc.id,
              name: data.name,
              rating: data.rating,
              review: data.review,
              createdAt: data.createdAt,
              status: data.status,
            });

            totalRating += data.rating;
            // Fix: Correct rating distribution calculation
            ratingCounts[5 - data.rating]++;
          });

          const totalReviews = reviewsData.length;
          const averageRating = totalReviews > 0 ? parseFloat((totalRating / totalReviews).toFixed(1)) : 0;

          setReviews(
            reviewsData.sort(
              (a, b) => b.createdAt.seconds - a.createdAt.seconds
            )
          );
          
          setStats({
            totalReviews,
            averageRating,
            linkClicks: businessData.linkClicks || 0,
            responseRate: businessData.responseRate || 0,
            ratingDistribution: ratingCounts.reverse(), // Reverse to show 5-star first
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const formatDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculatePercentage = (count: number) => {
    return stats.totalReviews > 0
      ? Math.round((count / stats.totalReviews) * 100)
      : 0;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isAdmin={false} />
        <div className="flex-1 md:ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin={false} />
      <div className="flex-1 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                {businessName
                  ? `Welcome back, ${businessName}`
                  : "Welcome back"}
              </p>
            </div>
            <Tabs
              defaultValue="week"
              className="w-[300px]"
              onValueChange={setPeriod}
            >
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Reviews"
              icon={<Star className="h-4 w-4 text-muted-foreground" />}
              value={stats.totalReviews}
              description="All time reviews"
            />
            <StatCard
              title="Average Rating"
              icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
              value={stats.averageRating}
              description={
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(stats.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              }
            />
            <StatCard
              title="Link Clicks"
              icon={<LinkIcon className="h-4 w-4 text-muted-foreground" />}
              value={stats.linkClicks}
              description="Total review link clicks"
            />
            <StatCard
              title="Response Rate"
              icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
              value={`${stats.responseRate}%`}
              description="Of reviews responded to"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.slice(0, 5).map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium">
                            {review.name || "Anonymous"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt.seconds)}
                          </div>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.review}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No reviews yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Breakdown of your ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.ratingDistribution.map((count, index) => {
                    const stars = 5 - index;
                    const percentage = calculatePercentage(count);

                    return (
                      <div key={stars} className="flex items-center">
                        <div className="w-12 flex items-center">
                          <span className="font-medium">{stars}</span>
                          <Star className="h-4 w-4 ml-1 text-yellow-400" />
                        </div>
                        <div className="flex-1 mx-3">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-yellow-400 h-2.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-right text-sm text-muted-foreground">
                          {count} ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component
function StatCard({
  title,
  icon,
  value,
  description,
}: {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  description: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

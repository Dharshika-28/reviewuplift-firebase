"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building, Mail, MapPin, Phone, Star, User, Users } from "lucide-react"
// If you want to use useNavigate (from react-router-dom), import it like this:
// import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/sidebar"
import { businessesData, usersData, reviewsData } from "@/lib/data"
import type { Business, User as UserType, Review } from "@/lib/types"
import { useNavigate } from "react-router-dom"

export default function BusinessDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [business, setBusiness] = useState<Business | null>(null)
  const [businessUsers, setBusinessUsers] = useState<UserType[]>([])
  const [businessReviews, setBusinessReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate API call to fetch business details
    const fetchData = () => {
      setIsLoading(true)

      // Find business by ID
      const foundBusiness = businessesData.find((b) => b.id === Number.parseInt(params.id))

      if (foundBusiness) {
        setBusiness(foundBusiness)

        // Find users for this business
        const users = usersData.filter((u) => u.businessId === foundBusiness.id)
        setBusinessUsers(users)

        // Find reviews for this business
        const reviews = reviewsData.filter((r) => r.location === foundBusiness.name)
        setBusinessReviews(reviews)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [params.id])

  // Handle back button click
  const handleBack = () => {
    router.back()
  }

  // Handle edit business click
  const handleEditBusiness = () => {
    router.push(`/admin/businesses/${params.id}/edit`)
  }

  // Handle manage users click
  const handleManageUsers = () => {
    router.push(`/admin/businesses/${params.id}/users`)
  }

  // Render stars for rating
  const renderStars = (rating: number) => (
    <div className="flex text-yellow-500" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, index) =>
        index < rating ? (
          <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
        ) : (
          <Star key={index} className="h-4 w-4 text-gray-300" aria-hidden="true" />
        ),
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isAdmin={true} />
        <div className="flex-1 md:ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-center py-12">Loading business details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isAdmin={true} />
        <div className="flex-1 md:ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Business Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The business you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Businesses
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin={true} />
      <div className="flex-1 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={handleBack} className="mb-4" aria-label="Back to businesses list">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Businesses
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{business.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge
                      variant={
                        business.status === "active"
                          ? "default"
                          : business.status === "pending"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {business.status === "active" ? "Active" : business.status === "pending" ? "Pending" : "Inactive"}
                    </Badge>
                    <span>•</span>
                    <span>Created on {business.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={handleManageUsers}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button onClick={handleEditBusiness}>Edit Business</Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users ({businessUsers.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({businessReviews.length})</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{business.users}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{business.reviews}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{business.avgRating > 0 ? business.avgRating : "-"}</div>
                      {business.avgRating > 0 && renderStars(business.avgRating)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Details about the business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                      <p>{business.name}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge
                        variant={
                          business.status === "active"
                            ? "default"
                            : business.status === "pending"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {business.status === "active"
                          ? "Active"
                          : business.status === "pending"
                            ? "Pending"
                            : "Inactive"}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                      <p>{business.createdAt}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Review Link</p>
                      <p className="text-sm">
                        https://go.reviewhut.com/{business.name.toLowerCase().replace(/\s+/g, "-")}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p>contact@{business.name.toLowerCase().replace(/\s+/g, "")}.com</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p>+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p>123 Business St, City, State 12345</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Users associated with this business</CardDescription>
                  </div>
                  <Button onClick={handleManageUsers}>Manage Users</Button>
                </CardHeader>
                <CardContent>
                  {businessUsers.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">No users found for this business</p>
                  ) : (
                    <div className="space-y-4">
                      {businessUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="capitalize">
                              {user.role}
                            </Badge>
                            <Badge variant={user.status === "active" ? "default" : "outline"}>
                              {user.status === "active" ? "Active" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>Customer reviews for this business</CardDescription>
                </CardHeader>
                <CardContent>
                  {businessReviews.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">No reviews found for this business</p>
                  ) : (
                    <div className="space-y-4">
                      {businessReviews.map((review) => (
                        <div key={review.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{review.name}</div>
                              <div className="text-sm text-muted-foreground">{review.date}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating)}
                              <Badge variant={review.approved ? "default" : "outline"}>
                                {review.approved ? "Approved" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{review.message}</p>
                          {review.replied && (
                            <div className="bg-muted p-3 rounded-md mt-2">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Business Reply:</p>
                              <p className="text-sm">
                                Thank you for your feedback! We appreciate your comments and will use them to improve
                                our service.
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

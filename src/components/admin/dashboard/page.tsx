"use client"

import { useState } from "react"
import { BarChart3, Building, Star, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Sidebar from "@/components/sidebar"

export default function AdminDashboard() {
  const [period, setPeriod] = useState("week")

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin={true} />

      <div className="flex-1 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Tabs defaultValue="week" className="w-[300px]" onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">+6 from last {period}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">+12 from last {period}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reviews Collected</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,856</div>
                <p className="text-xs text-muted-foreground">+143 from last {period}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-muted-foreground">+0.2 from last {period}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Businesses</CardTitle>
                <CardDescription>Newly registered businesses in the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Doner Hut", date: "May 15, 2025", users: 3 },
                    { name: "Tech Solutions Inc", date: "May 12, 2025", users: 5 },
                    { name: "Green Gardens", date: "May 10, 2025", users: 2 },
                    { name: "City Fitness", date: "May 8, 2025", users: 4 },
                    { name: "Bright Smiles Dental", date: "May 5, 2025", users: 3 },
                  ].map((business, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{business.name}</p>
                        <p className="text-sm text-muted-foreground">{business.date}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{business.users} users</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Reviews waiting for admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "John D.", business: "Doner Hut", rating: 2, date: "May 16, 2025" },
                    { name: "Sarah M.", business: "Tech Solutions Inc", rating: 1, date: "May 15, 2025" },
                    { name: "Robert K.", business: "Green Gardens", rating: 2, date: "May 14, 2025" },
                    { name: "Emily T.", business: "City Fitness", rating: 1, date: "May 13, 2025" },
                    { name: "Michael P.", business: "Bright Smiles Dental", rating: 2, date: "May 12, 2025" },
                  ].map((review, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{review.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {review.business} • {review.date}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 text-sm font-medium">{review.rating}/5</div>
                        <div className="flex">
                          {Array(review.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          {Array(5 - review.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

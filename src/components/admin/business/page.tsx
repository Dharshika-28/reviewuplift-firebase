"use client"

import { useState } from "react"
import { SimpleAdminLayout } from "@/components/simple-admin-layout"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Star } from "lucide-react"

export default function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const businesses = [
    {
      id: 1,
      name: "Pizza Palace",
      owner: "John Smith",
      email: "john@pizzapalace.com",
      category: "Restaurant",
      rating: 4.5,
      reviews: 127,
      status: "Active",
      joined: "Jan 15, 2024",
    },
    {
      id: 2,
      name: "Tech Solutions",
      owner: "Sarah Johnson",
      email: "sarah@techsolutions.com",
      category: "Technology",
      rating: 4.8,
      reviews: 89,
      status: "Active",
      joined: "Feb 3, 2024",
    },
    {
      id: 3,
      name: "Coffee Corner",
      owner: "Mike Davis",
      email: "mike@coffeecorner.com",
      category: "Cafe",
      rating: 4.2,
      reviews: 203,
      status: "Pending",
      joined: "Mar 10, 2024",
    },
    {
      id: 4,
      name: "Auto Repair Pro",
      owner: "Lisa Wilson",
      email: "lisa@autorepairpro.com",
      category: "Automotive",
      rating: 4.6,
      reviews: 156,
      status: "Active",
      joined: "Jan 28, 2024",
    },
    {
      id: 5,
      name: "Beauty Salon",
      owner: "Emma Brown",
      email: "emma@beautysalon.com",
      category: "Beauty",
      rating: 4.3,
      reviews: 78,
      status: "Suspended",
      joined: "Feb 20, 2024",
    },
  ]

   const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 shadow-sm hover:shadow-green-200 transition-shadow"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 shadow-sm hover:shadow-yellow-200 transition-shadow"
      case "Suspended":
        return "bg-red-100 text-red-800 shadow-sm hover:shadow-red-200 transition-shadow"
      default:
        return "bg-gray-100 text-gray-800 shadow-sm"
    }
  }

  // Simulate loading
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value) {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  return (
    <SimpleAdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="animate-slide-down">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Business Management
          </h1>
          <p className="text-gray-600 mt-1">Manage all registered businesses</p>
        </div>

        <Card className="border-orange-200 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-white rounded-t-lg">
            <CardTitle className="text-xl font-bold text-orange-800">All Businesses</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-orange-400" />
              <Input
                placeholder="Search businesses..."
                className="pl-8 border-orange-200 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-orange-200 h-12 w-12"></div>
                </div>
              </div>
            ) : (
              <Table className="rounded-lg overflow-hidden">
                <TableHeader className="bg-orange-50">
                  <TableRow className="hover:bg-orange-50">
                    <TableHead className="font-bold text-orange-800">Business Name</TableHead>
                    <TableHead className="font-bold text-orange-800">Owner</TableHead>
                    <TableHead className="font-bold text-orange-800">Category</TableHead>
                    <TableHead className="font-bold text-orange-800">Rating</TableHead>
                    <TableHead className="font-bold text-orange-800">Status</TableHead>
                    <TableHead className="font-bold text-orange-800">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business) => (
                    <TableRow 
                      key={business.id} 
                      className="border-b border-orange-100 hover:bg-orange-50 transition-all duration-200 ease-in-out"
                    >
                      <TableCell className="font-medium group">
                        <span className="group-hover:text-orange-600 transition-colors">
                          {business.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{business.owner}</p>
                          <p className="text-sm text-gray-500 group-hover:text-orange-500 transition-colors">
                            {business.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                          {business.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current animate-pulse" />
                          <span className="font-semibold">{business.rating}</span>
                          <span className="text-xs text-gray-500">({business.reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusColor(business.status)} transition-all hover:scale-105 cursor-pointer`}
                        >
                          {business.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{business.joined}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SimpleAdminLayout>
  )
}
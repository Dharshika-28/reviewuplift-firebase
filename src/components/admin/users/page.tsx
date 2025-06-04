"use client"
import { useState } from "react"
import { SimpleAdminLayout } from "@/components/simple-admin-layout"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock user data
  const users = [
    // ... same user data ...
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 shadow-sm hover:shadow-green-200 transition-shadow"
      case "Inactive":
        return "bg-gray-100 text-gray-800 shadow-sm hover:shadow-gray-200 transition-shadow"
      default:
        return "bg-gray-100 text-gray-800"
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
            User Management
          </h1>
          <p className="text-gray-600 mt-1">Manage all users on the platform</p>
        </div>

        <Card className="border-orange-200 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-white rounded-t-lg">
            <CardTitle className="text-xl font-bold text-orange-800">All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-orange-400" />
              <Input
                placeholder="Search users..."
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
                    <TableHead className="font-bold text-orange-800">Name</TableHead>
                    <TableHead className="font-bold text-orange-800">Email</TableHead>
                    <TableHead className="font-bold text-orange-800">Role</TableHead>
                    <TableHead className="font-bold text-orange-800">Status</TableHead>
                    <TableHead className="font-bold text-orange-800">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      className="border-b border-orange-100 hover:bg-orange-50 transition-all duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell className="font-medium group">
                        <span className="group-hover:text-orange-600 transition-colors">
                          {user.name}
                        </span>
                      </TableCell>
                      <TableCell className="group">
                        <span className="group-hover:text-orange-500 transition-colors">
                          {user.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "ADMIN" ? "default" : "outline"}
                          className={`${user.role === "ADMIN" ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-sm" : "border-orange-200 text-orange-700 bg-orange-50"} transition-all hover:scale-105`}
                        >
                          {user.role === "ADMIN" ? "Admin" : "Business User"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusColor(user.status)} transition-all hover:scale-105 cursor-pointer`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.joined}</TableCell>
                    </motion.tr>
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
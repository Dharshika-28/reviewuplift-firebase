"use client"

import { useState, useEffect } from "react"
// Removed: import { useRouter } from "next/navigation"
import { ArrowLeft, Building, MoreHorizontal, Plus, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/sidebar"
import CreateUserForm from "@/components/create-user-form"
import ConfirmDialog from "@/components/confirm-dialog"
import { businessesData, usersData } from "@/lib/data" // Mock data
import type { Business, User as UserType } from "@/lib/types"

export default function ManageBusinessUsersPage({ params }: { params: { id: string } }) {
  // Removed: const router = useRouter()
  const [business, setBusiness] = useState<Business | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [userToActivate, setUserToActivate] = useState<UserType | null>(null)
  const [userToDeactivate, setUserToDeactivate] = useState<UserType | null>(null)

  useEffect(() => {
    // Simulate API call to fetch business and its users
    const fetchData = () => {
      setIsLoading(true)

      // Find business by ID
      const foundBusiness = businessesData.find((b) => b.id === Number.parseInt(params.id))

      if (foundBusiness) {
        setBusiness(foundBusiness)

        // Find users for this business
        const businessUsers = usersData.filter((u) => u.businessId === foundBusiness.id)
        setUsers(businessUsers)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [params.id])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle back button click
  const handleBack = () => {
    // router.push(`/admin/businesses/${params.id}`)
    window.location.href = `/admin/businesses/${params.id}`
  }

  // Create a new user
  const handleCreateUser = (newUser: Partial<UserType>) => {
    // Ensure the new user is associated with this business
    const userWithBusiness = {
      ...newUser,
      businessId: business?.id,
      business: business?.name,
    }

    setUsers([
      {
        ...userWithBusiness,
        id: users.length + 1,
        role: userWithBusiness.role || "staff",
        status: userWithBusiness.status || "pending",
        lastLogin: userWithBusiness.lastLogin || "Never",
      } as UserType,
      ...users,
    ])
  }

  // Delete a user
  const handleDeleteUser = () => {
    if (!userToDelete) return

    setUsers(users.filter((user) => user.id !== userToDelete.id))
    setUserToDelete(null)
  }

  // Activate a user
  const handleActivateUser = () => {
    if (!userToActivate) return

    setUsers(users.map((user) => (user.id === userToActivate.id ? { ...user, status: "active" } : user)))
    setUserToActivate(null)
  }

  // Deactivate a user
  const handleDeactivateUser = () => {
    if (!userToDeactivate) return

    setUsers(users.map((user) => (user.id === userToDeactivate.id ? { ...user, status: "inactive" } : user)))
    setUserToDeactivate(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isAdmin={true} />
        <div className="flex-1 md:ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-center py-12">Loading users...</p>
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
              <Button onClick={() => (window.location.href = "/admin/businesses")}>
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
            <Button variant="ghost" onClick={handleBack} className="mb-4" aria-label="Back to business details">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Business Details
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Manage Users</h1>
                  <p className="text-muted-foreground">Manage users for {business.name}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="w-full sm:w-[250px] pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search users"
                  />
                </div>
                <Button onClick={() => setIsCreateFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Add User
                </Button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchTerm ? "No users found matching your search" : "No users found for this business"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-primary" aria-hidden="true" />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{user.role}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : user.status === "pending" ? "outline" : "secondary"
                          }
                        >
                          {user.status === "active" ? "Active" : user.status === "pending" ? "Pending" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${user.name}`}>
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => (window.location.href = `/admin/users/${user.id}`)}>
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => (window.location.href = `/admin/users/${user.id}/edit`)}>
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => alert("Password reset email sent to " + user.email)}>
                              Reset Password
                            </DropdownMenuItem>
                            {user.status === "pending" && (
                              <DropdownMenuItem onSelect={() => setUserToActivate(user)}>Activate</DropdownMenuItem>
                            )}
                            {user.status === "active" && (
                              <DropdownMenuItem onSelect={() => setUserToDeactivate(user)} className="text-amber-600">
                                Deactivate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onSelect={() => setUserToDelete(user)} className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Create User Form */}
      <CreateUserForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onCreateUser={handleCreateUser}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      {/* Activate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToActivate}
        onClose={() => setUserToActivate(null)}
        onConfirm={handleActivateUser}
        title="Activate User"
        description={`Are you sure you want to activate ${userToActivate?.name}?`}
        confirmText="Activate"
        cancelText="Cancel"
      />

      {/* Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDeactivate}
        onClose={() => setUserToDeactivate(null)}
        onConfirm={handleDeactivateUser}
        title="Deactivate User"
        description={`Are you sure you want to deactivate ${userToDeactivate?.name}? They will not be able to access their account.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}
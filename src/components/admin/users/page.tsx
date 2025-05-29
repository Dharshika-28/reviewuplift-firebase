"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/sidebar"
import CreateUserForm from "@/components/create-user-form"
import ConfirmDialog from "@/components/confirm-dialog"
import type { User as UserType } from "@/lib/types"
import { usersData } from "@/lib/data"

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>(usersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [userToActivate, setUserToActivate] = useState<UserType | null>(null)
  const [userToDeactivate, setUserToDeactivate] = useState<UserType | null>(null)

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.business && user.business.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Create a new user
  const handleCreateUser = (newUser: Partial<UserType>) => {
    setUsers([
      {
        ...newUser,
        id: users.length + 1,
        role: newUser.role || "staff",
        status: newUser.status || "pending",
        lastLogin: newUser.lastLogin || "Never",
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin={true} />

      <div className="flex-1 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Users</h1>
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

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Business</TableHead>
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
                    <TableCell colSpan={6} className="text-center py-8">
                      No users found
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
                      <TableCell>{user.business || "-"}</TableCell>
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

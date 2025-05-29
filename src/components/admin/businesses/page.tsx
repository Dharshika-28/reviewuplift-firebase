"use client"

import { useState } from "react"
import { Building, MoreHorizontal, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/sidebar"
import CreateBusinessForm from "@/components/create-business-form"
import ConfirmDialog from "@/components/confirm-dialog"
import type { Business } from "@/lib/types"
import { businessesData } from "@/lib/data"

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>(businessesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null)
  const [businessToActivate, setBusinessToActivate] = useState<Business | null>(null)
  const [businessToDeactivate, setBusinessToDeactivate] = useState<Business | null>(null)

  // Filter businesses based on search term
  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Create a new business
  const handleCreateBusiness = (newBusiness: Partial<Business>) => {
    setBusinesses([
      {
        ...newBusiness,
        id: businesses.length + 1,
        users: newBusiness.users || 0,
        reviews: newBusiness.reviews || 0,
        avgRating: newBusiness.avgRating || 0,
        status: newBusiness.status || "pending",
        createdAt: newBusiness.createdAt || new Date().toLocaleDateString(),
      } as Business,
      ...businesses,
    ])
  }

  // Delete a business
  const handleDeleteBusiness = () => {
    if (!businessToDelete) return

    setBusinesses(businesses.filter((business) => business.id !== businessToDelete.id))
    setBusinessToDelete(null)
  }

  // Activate a business
  const handleActivateBusiness = () => {
    if (!businessToActivate) return

    setBusinesses(
      businesses.map((business) =>
        business.id === businessToActivate.id ? { ...business, status: "active" } : business,
      ),
    )
    setBusinessToActivate(null)
  }

  // Deactivate a business
  const handleDeactivateBusiness = () => {
    if (!businessToDeactivate) return

    setBusinesses(
      businesses.map((business) =>
        business.id === businessToDeactivate.id ? { ...business, status: "inactive" } : business,
      ),
    )
    setBusinessToDeactivate(null)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin={true} />

      <div className="flex-1 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Businesses</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search businesses..."
                  className="w-full sm:w-[250px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search businesses"
                />
              </div>
              <Button onClick={() => setIsCreateFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Add Business
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Avg. Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No businesses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <Building className="h-4 w-4 text-primary" aria-hidden="true" />
                          </div>
                          {business.name}
                        </div>
                      </TableCell>
                      <TableCell>{business.users}</TableCell>
                      <TableCell>{business.reviews}</TableCell>
                      <TableCell>{business.avgRating > 0 ? business.avgRating : "-"}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>{business.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${business.name}`}>
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {business.status === "active" && (
                              <DropdownMenuItem
                                onSelect={() => setBusinessToDeactivate(business)}
                                className="text-amber-600"
                              >
                                Deactivate
                              </DropdownMenuItem>
                            )}
                            {(business.status === "inactive" || business.status === "pending") && (
                              <DropdownMenuItem
                                onSelect={() => setBusinessToActivate(business)}
                                className="text-green-600"
                              >
                                {business.status === "pending" ? "Approve & Activate" : "Activate"}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onSelect={() => setBusinessToDelete(business)} className="text-red-600">
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

      {/* Create Business Form */}
      <CreateBusinessForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onCreateBusiness={handleCreateBusiness}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!businessToDelete}
        onClose={() => setBusinessToDelete(null)}
        onConfirm={handleDeleteBusiness}
        title="Delete Business"
        description={`Are you sure you want to delete ${businessToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      {/* Activate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!businessToActivate}
        onClose={() => setBusinessToActivate(null)}
        onConfirm={handleActivateBusiness}
        title={businessToActivate?.status === "pending" ? "Approve Business" : "Activate Business"}
        description={
          businessToActivate?.status === "pending"
            ? `Are you sure you want to approve and activate ${businessToActivate?.name}?`
            : `Are you sure you want to activate ${businessToActivate?.name}?`
        }
        confirmText={businessToActivate?.status === "pending" ? "Approve" : "Activate"}
        cancelText="Cancel"
      />

      {/* Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!businessToDeactivate}
        onClose={() => setBusinessToDeactivate(null)}
        onConfirm={handleDeactivateBusiness}
        title="Deactivate Business"
        description={`Are you sure you want to deactivate ${businessToDeactivate?.name}? Users will not be able to access their accounts.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}
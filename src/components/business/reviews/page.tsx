"use client"

import { useState } from "react"
import {
  Check,
  FolderOpen,
  MailOpen,
  Phone,
  Search,
  Star,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Sidebar from "@/components/sidebar"
import ReviewReplyModal from "@/components/review-reply-modal"
import ConfirmDialog from "@/components/confirm-dialog"
import type { Review } from "@/lib/types"
import { reviewsData } from "@/lib/data"

// Star Renderer
const renderStars = (rating: number) => (
  <div
    className="flex text-yellow-500"
    aria-label={`${rating} out of 5 stars`}
  >
    {[...Array(5)].map((_, index) =>
      index < rating ? (
        <Star
          key={index}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
          aria-hidden="true"
        />
      ) : (
        <Star
          key={index}
          className="h-4 w-4 text-gray-300"
          aria-hidden="true"
        />
      )
    )}
  </div>
)

export default function BusinessReviews() {
  const [reviews, setReviews] = useState<Review[]>(reviewsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOption, setFilterOption] = useState("All")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null)

  const handleDeleteReview = () => {
    if (!reviewToDelete) return
    setReviews(reviews.filter((review) => review.id !== reviewToDelete.id))
    setReviewToDelete(null)
  }

  const handleToggleReply = (id: number) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, replied: !review.replied } : review
      )
    )
  }

  const handleReplyToReview = (reviewId: number, replyText: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, replied: true } : review
      )
    )
    console.log(`Reply to review ${reviewId}: ${replyText}`)
  }

  const handleReplyClick = (review: Review) => {
    if (review.rating < 3) {
      setSelectedReview(review)
    } else {
      window.open("https://www.google.com/search?q=google+review", "_blank")
    }
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterOption === "All" ||
      (filterOption === "Above 3" && review.rating >= 3) ||
      (filterOption === "Below 3" && review.rating < 3) ||
      (filterOption === "Replied" && review.replied) ||
      (filterOption === "Not Replied" && !review.replied)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin={false} />
      <div className="flex-1 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Your Reviews</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reviews..."
                  className="w-full sm:w-[250px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterOption} onValueChange={setFilterOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Reviews</SelectItem>
                  <SelectItem value="Above 3">Rating Above 3</SelectItem>
                  <SelectItem value="Below 3">Rating Below 3</SelectItem>
                  <SelectItem value="Replied">Replied</SelectItem>
                  <SelectItem value="Not Replied">Not Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border text-center">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No reviews found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search or filters"
                    : "Start collecting reviews from your customers"}
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-4 rounded-xl shadow flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{review.name}</div>
                        <div className="text-gray-500 text-sm">{review.date}</div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  <div className="text-gray-700">{review.message}</div>

                  {review.rating < 3 && (
                    <div className="flex gap-4 mt-2">
                      {review.email && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MailOpen className="h-4 w-4 text-gray-500" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2">
                            <p className="text-sm">{review.email}</p>
                          </PopoverContent>
                        </Popover>
                      )}

                      {review.phone && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Phone className="h-4 w-4 text-gray-500" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2">
                            <p className="text-sm">{review.phone}</p>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <Button
                      className={`bg-orange-500 hover:bg-orange-600 text-white`}
                      onClick={() => handleReplyClick(review)}
                    >
                      {review.replied
                        ? "Replied"
                        : review.rating < 3
                        ? "Reply Privately"
                        : "Reply"}
                    </Button>

                    <div className="flex gap-4 text-gray-500 text-lg items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Check
                              className={`h-4 w-4 ${
                                review.replied ? "text-orange-500" : ""
                              }`}
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-500"
                            onClick={() => handleToggleReply(review.id)}
                          >
                            {review.replied
                              ? "Unmark as replied"
                              : "Mark as replied"}
                          </Button>
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 hover:text-red-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setReviewToDelete(review)}
                          >
                            Delete
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedReview && (
        <ReviewReplyModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onReply={handleReplyToReview}
        />
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        description={`Are you sure you want to delete the review from ${reviewToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}

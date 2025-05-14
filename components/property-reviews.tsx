import { useState } from 'react'
import { usePropertyReviews } from '@/hooks/use-property-reviews'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Star, Edit2, Trash2, MessageSquare } from 'lucide-react'

interface PropertyReviewsProps {
    propertyId: string
    propertyTitle: string
}

export function PropertyReviews({ propertyId, propertyTitle }: PropertyReviewsProps) {
    const { reviews, loading, error, addReview, updateReview, deleteReview } = usePropertyReviews(propertyId)
    const { user } = useAuth()
    const { toast } = useToast()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingReview, setEditingReview] = useState<any>(null)
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (editingReview) {
                await updateReview(editingReview.id, formData.rating, formData.comment)
                toast({
                    title: 'Success',
                    description: 'Review updated successfully'
                })
            } else {
                await addReview(formData.rating, formData.comment)
                toast({
                    title: 'Success',
                    description: 'Review submitted successfully'
                })
            }
            setIsDialogOpen(false)
            setEditingReview(null)
            setFormData({
                rating: 5,
                comment: ''
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to submit review',
                variant: 'destructive'
            })
        }
    }

    const handleDelete = async (reviewId: string) => {
        try {
            await deleteReview(reviewId)
            toast({
                title: 'Success',
                description: 'Review deleted successfully'
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete review',
                variant: 'destructive'
            })
        }
    }

    const handleEdit = (review: any) => {
        setEditingReview(review)
        setFormData({
            rating: review.rating,
            comment: review.comment
        })
        setIsDialogOpen(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#002f6c]">Reviews</h2>
                {user && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#002f6c] hover:bg-[#002f6c]/90">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Write a Review
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingReview ? 'Edit Review' : 'Write a Review'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${star <= formData.rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Comment</label>
                                    <Textarea
                                        value={formData.comment}
                                        onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                        placeholder="Share your experience with this property"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false)
                                            setEditingReview(null)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-[#002f6c] hover:bg-[#002f6c]/90">
                                        {editingReview ? 'Update Review' : 'Submit Review'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {reviews.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                        <p className="text-gray-600">
                            Be the first to review this property
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{review.userName}</CardTitle>
                                        <div className="flex items-center gap-1 mt-1">
                                            {Array.from({ length: Math.min(Math.max(0, review.rating || 0), 5) }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < (review.rating || 0)
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {user && user.uid === review.userId && (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(review)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(review.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{review.comment}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
} 
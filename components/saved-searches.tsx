import { useState } from 'react'
import { useSavedSearches } from '@/hooks/use-saved-searches'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Search, Bell, Trash2, Edit, Plus } from 'lucide-react'

export function SavedSearches() {
    const { savedSearches, loading, error, saveSearch, updateSearch, deleteSearch, toggleEmailNotifications, updateNotificationFrequency } = useSavedSearches()
    const { toast } = useToast()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingSearch, setEditingSearch] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: '',
        filters: {
            propertyType: [],
            priceRange: { min: 0, max: 0 },
            bedrooms: [],
            bathrooms: [],
            amenities: [],
            location: '',
            distance: 0
        },
        emailNotifications: true,
        notificationFrequency: 'daily' as const
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (editingSearch) {
                await updateSearch(editingSearch.id, formData)
                toast({
                    title: 'Success',
                    description: 'Search updated successfully'
                })
            } else {
                await saveSearch(formData)
                toast({
                    title: 'Success',
                    description: 'Search saved successfully'
                })
            }
            setIsDialogOpen(false)
            setEditingSearch(null)
            setFormData({
                name: '',
                filters: {
                    propertyType: [],
                    priceRange: { min: 0, max: 0 },
                    bedrooms: [],
                    bathrooms: [],
                    amenities: [],
                    location: '',
                    distance: 0
                },
                emailNotifications: true,
                notificationFrequency: 'daily'
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save search. Please try again.',
                variant: 'destructive'
            })
        }
    }

    const handleDelete = async (searchId: string) => {
        try {
            await deleteSearch(searchId)
            toast({
                title: 'Success',
                description: 'Search deleted successfully'
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete search. Please try again.',
                variant: 'destructive'
            })
        }
    }

    const handleEdit = (search: any) => {
        setEditingSearch(search)
        setFormData({
            name: search.name,
            filters: search.filters,
            emailNotifications: search.emailNotifications,
            notificationFrequency: search.notificationFrequency
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
                <h2 className="text-2xl font-bold text-[#002f6c]">Saved Searches</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#002f6c] hover:bg-[#002f6c]/90">
                            <Plus className="h-4 w-4 mr-2" />
                            New Search
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingSearch ? 'Edit Saved Search' : 'Save New Search'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Search Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter a name for this search"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Email Notifications</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={formData.emailNotifications}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
                                    />
                                    <Label>Enable email notifications</Label>
                                </div>
                            </div>

                            {formData.emailNotifications && (
                                <div className="space-y-2">
                                    <Label>Notification Frequency</Label>
                                    <Select
                                        value={formData.notificationFrequency}
                                        onValueChange={(value: 'daily' | 'weekly' | 'instant') => setFormData(prev => ({ ...prev, notificationFrequency: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="instant">Instant</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false)
                                        setEditingSearch(null)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-[#002f6c] hover:bg-[#002f6c]/90">
                                    {editingSearch ? 'Update Search' : 'Save Search'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {savedSearches.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Saved Searches</h3>
                        <p className="text-gray-600 mb-4">
                            Save your property searches to get notified when new properties match your criteria.
                        </p>
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-[#002f6c] hover:bg-[#002f6c]/90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Search
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedSearches.map((search) => (
                        <Card key={search.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{search.name}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(search)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(search.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription>
                                    {search.filters.propertyType?.join(', ')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Bell className="h-4 w-4 text-[#002f6c]" />
                                            <span className="text-sm">Email Notifications</span>
                                        </div>
                                        <Switch
                                            checked={search.emailNotifications}
                                            onCheckedChange={(checked) => toggleEmailNotifications(search.id, checked)}
                                        />
                                    </div>
                                    {search.emailNotifications && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">
                                                Notify me {search.notificationFrequency}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
} 
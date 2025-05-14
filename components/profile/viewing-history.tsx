import { useEffect, useState } from "react"
import { useViewingHistory, type ViewingHistory } from "@/hooks/use-viewing-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Clock, Eye, TrendingUp, Calendar } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface ViewingHistoryProps {
    className?: string
}

export function ViewingHistory({ className }: ViewingHistoryProps) {
    const { history, loading, error, getViewingStats } = useViewingHistory()
    const [stats, setStats] = useState<any>(null)
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const loadStats = async () => {
            const viewingStats = await getViewingStats()
            setStats(viewingStats)
        }
        loadStats()
    }, [])

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === "all" ||
            (filter === "today" && isToday(item.viewedAt)) ||
            (filter === "week" && isWithinLastWeek(item.viewedAt))
        return matchesSearch && matchesFilter
    })

    const isToday = (timestamp: any) => {
        const today = new Date()
        const date = timestamp.toDate()
        return date.toDateString() === today.toDateString()
    }

    const isWithinLastWeek = (timestamp: any) => {
        const date = timestamp.toDate()
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return date >= weekAgo
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
            <Card className={className}>
                <CardContent className="p-6">
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className={className}>
            <Tabs defaultValue="history" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="history">Viewing History</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Viewing History</CardTitle>
                            <CardDescription>Track your property viewing activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Input
                                        placeholder="Search properties..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="sm:max-w-xs"
                                    />
                                    <Select value={filter} onValueChange={setFilter}>
                                        <SelectTrigger className="sm:max-w-xs">
                                            <SelectValue placeholder="Filter by time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Time</SelectItem>
                                            <SelectItem value="today">Today</SelectItem>
                                            <SelectItem value="week">Last 7 Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    {filteredHistory.map((item) => (
                                        <Card key={item.id}>
                                            <CardContent className="p-4">
                                                <div className="flex gap-4">
                                                    <div className="relative h-20 w-20 flex-shrink-0">
                                                        <Image
                                                            src={item.propertyImage}
                                                            alt={item.propertyTitle}
                                                            fill
                                                            className="object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium truncate">{item.propertyTitle}</h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{formatDistanceToNow(item.viewedAt.toDate())} ago</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Eye className="h-4 w-4" />
                                                                <span>{Math.round(item.duration / 60)} min</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        View Again
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {filteredHistory.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No viewing history found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <Card>
                        <CardHeader>
                            <CardTitle>Viewing Analytics</CardTitle>
                            <CardDescription>Insights about your property viewing habits</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Eye className="h-5 w-5 text-[#002f6c]" />
                                                <h3 className="font-medium">Total Views</h3>
                                            </div>
                                            <p className="text-2xl font-bold mt-2">{stats.totalViews}</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-[#002f6c]" />
                                                <h3 className="font-medium">Avg. Duration</h3>
                                            </div>
                                            <p className="text-2xl font-bold mt-2">
                                                {Math.round(stats.averageDuration / 60)} min
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-[#002f6c]" />
                                                <h3 className="font-medium">Most Viewed</h3>
                                            </div>
                                            {stats.mostViewedProperty ? (
                                                <div className="mt-2">
                                                    <p className="font-medium truncate">
                                                        {stats.mostViewedProperty.propertyTitle}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {propertyViews.get(stats.mostViewedProperty.propertyId)} views
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 mt-2">No data</p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-[#002f6c]" />
                                                <h3 className="font-medium">Active Days</h3>
                                            </div>
                                            <p className="text-2xl font-bold mt-2">
                                                {Object.keys(stats.viewsByDay).length}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 
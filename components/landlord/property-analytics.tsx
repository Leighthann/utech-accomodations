import { useState, useEffect } from "react"
import { usePropertyAnalytics } from "@/hooks/use-property-analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, Users, Clock, MessageSquare, TrendingUp, BarChart3 } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts"

interface PropertyAnalyticsProps {
    className?: string
}

export function PropertyAnalytics({ className }: PropertyAnalyticsProps) {
    const { analytics, loading, error, getAnalytics } = usePropertyAnalytics()
    const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")

    useEffect(() => {
        getAnalytics(timeRange)
    }, [timeRange])

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
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    if (!analytics) {
        return null
    }

    // Prepare data for charts
    const viewsData = Object.entries(analytics.viewsByDay)
        .map(([date, views]) => ({
            date: new Date(date).toLocaleDateString(),
            views
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const propertyData = analytics.topPerformingProperties.map(property => ({
        name: property.title,
        views: property.views,
        inquiries: property.inquiries
    }))

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#002f6c]">Property Analytics</h2>
                <Select value={timeRange} onValueChange={(value: "week" | "month" | "year") => setTimeRange(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="year">Last 12 Months</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-[#002f6c]" />
                            <h3 className="font-medium">Total Views</h3>
                        </div>
                        <p className="text-2xl font-bold mt-2">{analytics.totalViews}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-[#002f6c]" />
                            <h3 className="font-medium">Unique Viewers</h3>
                        </div>
                        <p className="text-2xl font-bold mt-2">{analytics.uniqueViewers}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-[#002f6c]" />
                            <h3 className="font-medium">Avg. View Duration</h3>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                            {Math.round(analytics.averageViewDuration / 60)} min
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-[#002f6c]" />
                            <h3 className="font-medium">Inquiries</h3>
                        </div>
                        <p className="text-2xl font-bold mt-2">{analytics.inquiriesCount}</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="views" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="views">Views Over Time</TabsTrigger>
                    <TabsTrigger value="properties">Top Properties</TabsTrigger>
                </TabsList>

                <TabsContent value="views">
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Views Over Time</CardTitle>
                            <CardDescription>Track the number of views your properties receive</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={viewsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#002f6c"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="properties">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Properties</CardTitle>
                            <CardDescription>Properties with the highest engagement</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={propertyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="views" fill="#002f6c" />
                                        <Bar dataKey="inquiries" fill="#4a90e2" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-6 space-y-4">
                                {analytics.topPerformingProperties.map((property) => (
                                    <Card key={property.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium">{property.title}</h3>
                                                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                                        <span>{property.views} views</span>
                                                        <span>{property.inquiries} inquiries</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">Conversion Rate</div>
                                                    <div className="text-lg font-bold text-[#002f6c]">
                                                        {property.conversionRate.toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 
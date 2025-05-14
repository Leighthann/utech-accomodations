import { useState, useEffect } from "react"
import { useInquiries, type Inquiry } from "@/hooks/use-inquiries"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MessageSquare, Calendar, Clock, Mail, Phone, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface InquiryManagementProps {
    className?: string
}

export function InquiryManagement({ className }: InquiryManagementProps) {
    const { inquiries, loading, error, respondToInquiry, updateInquiryStatus, scheduleViewing, updateViewingStatus, getInquiryStats } = useInquiries()
    const { toast } = useToast()
    const [stats, setStats] = useState<any>(null)
    const [filter, setFilter] = useState<Inquiry["status"] | "all">("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
    const [response, setResponse] = useState("")
    const [viewingDate, setViewingDate] = useState("")
    const [viewingTime, setViewingTime] = useState("")
    const [isResponding, setIsResponding] = useState(false)
    const [isScheduling, setIsScheduling] = useState(false)

    useEffect(() => {
        const loadStats = async () => {
            const inquiryStats = await getInquiryStats()
            setStats(inquiryStats)
        }
        loadStats()
    }, [])

    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch =
            inquiry.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === "all" || inquiry.status === filter
        return matchesSearch && matchesFilter
    })

    const handleRespond = async () => {
        if (!selectedInquiry || !response.trim()) return

        setIsResponding(true)
        try {
            await respondToInquiry(selectedInquiry.id, response)
            toast({
                title: "Success",
                description: "Response sent successfully",
            })
            setResponse("")
            setSelectedInquiry(null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send response. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsResponding(false)
        }
    }

    const handleScheduleViewing = async () => {
        if (!selectedInquiry || !viewingDate || !viewingTime) return

        setIsScheduling(true)
        try {
            await scheduleViewing(selectedInquiry.id, viewingDate, viewingTime)
            toast({
                title: "Success",
                description: "Viewing scheduled successfully",
            })
            setViewingDate("")
            setViewingTime("")
            setSelectedInquiry(null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to schedule viewing. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsScheduling(false)
        }
    }

    const handleUpdateStatus = async (inquiry: Inquiry, status: Inquiry["status"]) => {
        try {
            await updateInquiryStatus(inquiry.id, status)
            toast({
                title: "Success",
                description: "Status updated successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status. Please try again.",
                variant: "destructive"
            })
        }
    }

    const handleUpdateViewingStatus = async (inquiry: Inquiry, status: Inquiry["scheduledViewing"]["status"]) => {
        try {
            await updateViewingStatus(inquiry.id, status)
            toast({
                title: "Success",
                description: "Viewing status updated successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update viewing status. Please try again.",
                variant: "destructive"
            })
        }
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
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className={className}>
            <Tabs defaultValue="inquiries" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="inquiries">
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Inquiries</CardTitle>
                            <CardDescription>Manage and respond to property inquiries</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Input
                                        placeholder="Search inquiries..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="sm:max-w-xs"
                                    />
                                    <Select value={filter} onValueChange={(value: Inquiry["status"] | "all") => setFilter(value)}>
                                        <SelectTrigger className="sm:max-w-xs">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Inquiries</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="responded">Responded</SelectItem>
                                            <SelectItem value="accepted">Accepted</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    {filteredInquiries.map((inquiry) => (
                                        <Card key={inquiry.id}>
                                            <CardContent className="p-4">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="relative h-20 w-20 flex-shrink-0">
                                                        <Image
                                                            src={inquiry.propertyImage}
                                                            alt={inquiry.propertyTitle}
                                                            fill
                                                            className="object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium">{inquiry.propertyTitle}</h3>
                                                        <div className="space-y-1 mt-1">
                                                            <p className="text-sm text-gray-600">{inquiry.message}</p>
                                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                                <div className="flex items-center gap-1">
                                                                    <Mail className="h-4 w-4" />
                                                                    <span>{inquiry.tenantEmail}</span>
                                                                </div>
                                                                {inquiry.tenantPhone && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Phone className="h-4 w-4" />
                                                                        <span>{inquiry.tenantPhone}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-4 w-4" />
                                                                    <span>{formatDistanceToNow(inquiry.createdAt.toDate())} ago</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setSelectedInquiry(inquiry)}
                                                                >
                                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                                    Respond
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Respond to Inquiry</DialogTitle>
                                                                    <DialogDescription>
                                                                        Send a response to the tenant's inquiry
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4 py-4">
                                                                    <div className="space-y-2">
                                                                        <Label>Your Response</Label>
                                                                        <Textarea
                                                                            value={response}
                                                                            onChange={(e) => setResponse(e.target.value)}
                                                                            placeholder="Type your response here..."
                                                                            rows={4}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button
                                                                        onClick={handleRespond}
                                                                        disabled={isResponding || !response.trim()}
                                                                    >
                                                                        {isResponding ? (
                                                                            <>
                                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                                Sending...
                                                                            </>
                                                                        ) : (
                                                                            "Send Response"
                                                                        )}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setSelectedInquiry(inquiry)}
                                                                >
                                                                    <Calendar className="h-4 w-4 mr-2" />
                                                                    Schedule Viewing
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Schedule Property Viewing</DialogTitle>
                                                                    <DialogDescription>
                                                                        Set up a viewing appointment with the tenant
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4 py-4">
                                                                    <div className="space-y-2">
                                                                        <Label>Date</Label>
                                                                        <Input
                                                                            type="date"
                                                                            value={viewingDate}
                                                                            onChange={(e) => setViewingDate(e.target.value)}
                                                                            min={new Date().toISOString().split("T")[0]}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>Time</Label>
                                                                        <Input
                                                                            type="time"
                                                                            value={viewingTime}
                                                                            onChange={(e) => setViewingTime(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button
                                                                        onClick={handleScheduleViewing}
                                                                        disabled={isScheduling || !viewingDate || !viewingTime}
                                                                    >
                                                                        {isScheduling ? (
                                                                            <>
                                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                                Scheduling...
                                                                            </>
                                                                        ) : (
                                                                            "Schedule Viewing"
                                                                        )}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Select
                                                            value={inquiry.status}
                                                            onValueChange={(value: Inquiry["status"]) => handleUpdateStatus(inquiry, value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="responded">Responded</SelectItem>
                                                                <SelectItem value="accepted">Accepted</SelectItem>
                                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        {inquiry.scheduledViewing && (
                                                            <Select
                                                                value={inquiry.scheduledViewing.status}
                                                                onValueChange={(value: Inquiry["scheduledViewing"]["status"]) =>
                                                                    handleUpdateViewingStatus(inquiry, value)
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="pending">Pending</SelectItem>
                                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                                    <SelectItem value="completed">Completed</SelectItem>
                                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {filteredInquiries.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No inquiries found
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
                            <CardTitle>Inquiry Analytics</CardTitle>
                            <CardDescription>Track and analyze your property inquiries</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-5 w-5 text-[#002f6c]" />
                                                <h3 className="font-medium">Total Inquiries</h3>
                                            </div>
                                            <p className="text-2xl font-bold mt-2">{stats.total}</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-[#002f6c]" />
                                                <h3 className="font-medium">Avg. Response Time</h3>
                                            </div>
                                            <p className="text-2xl font-bold mt-2">
                                                {Math.round(stats.responseTime / (1000 * 60))} min
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-[#002f6c]" />
                                                <h3 className="font-medium">Accepted</h3>
                                            </div>
                                            <p className="text-2xl font-bold mt-2">{stats.byStatus.accepted}</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5 text-[#002f6c]" />
                                                <h3 className="font-medium">Pending</h3>
                                            </div>
                                            <p className="text-2xl font-bold mt-2">{stats.byStatus.pending}</p>
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
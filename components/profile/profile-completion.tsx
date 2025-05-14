import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { type UserProfile } from "@/hooks/use-profile"

interface ProfileCompletionProps {
    profile: UserProfile
}

export function ProfileCompletion({ profile }: ProfileCompletionProps) {
    const calculateCompletion = () => {
        const requiredFields = [
            profile.displayName,
            profile.phoneNumber,
            profile.photoURL,
            profile.preferences?.emailNotifications !== undefined,
            profile.preferences?.pushNotifications !== undefined,
        ]

        const completedFields = requiredFields.filter(Boolean).length
        const percentage = (completedFields / requiredFields.length) * 100

        return {
            percentage,
            completedFields,
            totalFields: requiredFields.length
        }
    }

    const { percentage, completedFields, totalFields } = calculateCompletion()

    const getMissingFields = () => {
        const missing = []
        if (!profile.displayName) missing.push("Display Name")
        if (!profile.phoneNumber) missing.push("Phone Number")
        if (!profile.photoURL) missing.push("Profile Picture")
        if (profile.preferences?.emailNotifications === undefined) missing.push("Email Notifications")
        if (profile.preferences?.pushNotifications === undefined) missing.push("Push Notifications")
        return missing
    }

    const missingFields = getMissingFields()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete your profile to get the most out of UTech Housing</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Profile Progress</span>
                        <span className="text-sm text-gray-500">{completedFields}/{totalFields} completed</span>
                    </div>
                    <Progress value={percentage} className="h-2" />

                    {missingFields.length > 0 ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>Missing Information:</span>
                            </div>
                            <ul className="space-y-1">
                                {missingFields.map((field) => (
                                    <li key={field} className="text-sm text-gray-600 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        {field}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Profile Complete!</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
} 
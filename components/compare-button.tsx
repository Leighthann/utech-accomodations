"use client"

import { Button } from "@/components/ui/button"
import { useComparison } from "@/contexts/comparison-context"
import { useToast } from "@/components/ui/use-toast"
import { Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import { Property } from "@/types/property"

interface CompareButtonProps {
    property: Property
    className?: string
}

export default function CompareButton({ property, className }: CompareButtonProps) {
    const { addToComparison, removeFromComparison, isInComparison } = useComparison()
    const { toast } = useToast()
    const isComparing = isInComparison(property.id)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isComparing) {
            removeFromComparison(property.id)
            toast({
                title: "Removed from Comparison",
                description: "Property has been removed from comparison."
            })
        } else {
            addToComparison(property)
            toast({
                title: "Added to Comparison",
                description: "Property has been added to comparison."
            })
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "absolute top-2 right-12 bg-white/80 hover:bg-white",
                isComparing && "text-[#002f6c]"
            )}
            onClick={handleClick}
        >
            <Scale className={cn("h-5 w-5", isComparing && "fill-current")} />
        </Button>
    )
} 
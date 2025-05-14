"use client"

import { PropertyComparison } from '@/components/property-comparison'
import { usePropertyComparison } from '@/hooks/use-property-comparison'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function ComparePage() {
    const {
        comparisonProperties,
        removeProperty,
        clearComparison
    } = usePropertyComparison()

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Compare Properties</h1>
                    <p className="text-muted-foreground">
                        Compare up to 3 properties side by side
                    </p>
                </div>
                {comparisonProperties.length > 0 && (
                    <Button
                        variant="destructive"
                        onClick={clearComparison}
                        className="inline-flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                    </Button>
                )}
            </div>

            <PropertyComparison
                properties={comparisonProperties}
                onRemoveProperty={removeProperty}
            />
        </div>
    )
} 
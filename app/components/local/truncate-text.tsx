import { useState } from 'react'
import { Button } from "~/components/ui/button"

interface TruncateTextProps {
    text: string
    maxLength?: number
}

export function TruncateText({ text, maxLength = 100 }: TruncateTextProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const shouldTruncate = text.length > maxLength
    const displayText = isExpanded ? text : text.slice(0, maxLength)

    return (
        <div className="space-y-0">
            <p className="truncate md:overflow-clip break-words">
                {displayText}
                {shouldTruncate && !isExpanded && '...'}
            </p>
            {shouldTruncate && (
                <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-0 h-auto text-wrap"
                >
                    {isExpanded ? 'Ver menos' : 'Ver más'}
                </Button>
            )}
        </div>
    )
}
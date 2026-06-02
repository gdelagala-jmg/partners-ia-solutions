import { useMemo } from 'react'

export interface TelemetryMatrixItem {
    key: string
    weight: number
    label: string
    validate: (val: any) => boolean
}

/**
 * useFormTelemetry
 * Custom hook to dynamically calculate form quality completeness scores (0-100) 
 * and return real-time suggestions based on active watched fields.
 */
export function useFormTelemetry(
    watchedValues: Record<string, any>,
    matrix: TelemetryMatrixItem[]
) {
    return useMemo(() => {
        let score = 0
        const pendingSuggestions: string[] = []

        matrix.forEach(item => {
            const val = watchedValues[item.key]
            if (item.validate(val)) {
                score += item.weight
            } else {
                pendingSuggestions.push(item.label)
            }
        })

        // Bounds validation
        score = Math.min(100, Math.max(0, score))

        return { score, pendingSuggestions }
    }, [watchedValues, matrix])
}

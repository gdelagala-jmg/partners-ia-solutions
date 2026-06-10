import { ReactNode } from 'react'

interface CardGridProps {
    children: ReactNode
    columns?: 1 | 2 | 3 | 4
    className?: string
}

export default function CardGrid({ 
    children, 
    columns = 3, 
    className = '' 
}: CardGridProps) {
    const gridColsClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }

    return (
        <div className={`grid ${gridColsClasses[columns]} gap-6 md:gap-8 ${className}`}>
            {children}
        </div>
    )
}

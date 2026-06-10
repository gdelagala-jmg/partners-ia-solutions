import { ReactNode, HTMLAttributes } from 'react'

export type SectionSpacing = 'compact' | 'standard' | 'spacious' | 'none'
export type ContainerWidth = 'default' | 'narrow' | 'tight' | 'full'

interface SectionBlockProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode
    spacing?: SectionSpacing
    containerWidth?: ContainerWidth
    containerClassName?: string
}

export default function SectionBlock({
    children,
    spacing = 'standard',
    containerWidth = 'default',
    className = '',
    containerClassName = '',
    ...props
}: SectionBlockProps) {
    // Definimos los tokens de ritmo vertical (Reducidos ~10-15%)
    const spacingClasses = {
        compact: 'py-10 md:py-14',
        standard: 'py-16 md:py-20',
        spacious: 'py-24 lg:py-32',
        none: ''
    }

    // Definimos los tokens de ancho máximo
    const widthClasses = {
        default: 'max-w-7xl',
        narrow: 'max-w-5xl',
        tight: 'max-w-3xl',
        full: 'max-w-full'
    }

    return (
        <section 
            className={`${spacingClasses[spacing]} ${className}`}
            {...props}
        >
            <div className={`${widthClasses[containerWidth]} mx-auto px-5 sm:px-6 lg:px-8 ${containerClassName}`}>
                {children}
            </div>
        </section>
    )
}

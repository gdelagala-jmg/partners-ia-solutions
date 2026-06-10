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
    // Definimos los tokens de ritmo vertical
    const spacingClasses = {
        compact: 'py-12 md:py-16',
        standard: 'py-20 md:py-24',
        spacious: 'py-32 lg:py-40',
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

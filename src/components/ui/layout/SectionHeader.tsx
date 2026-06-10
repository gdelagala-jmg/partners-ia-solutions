import { ReactNode } from 'react'
import PageBadge from '@/components/ui/PageBadge'

interface SectionHeaderProps {
    title: ReactNode
    subtitle?: ReactNode
    badgeText?: string
    badgeIcon?: ReactNode
    align?: 'left' | 'center'
    className?: string
}

export default function SectionHeader({
    title,
    subtitle,
    badgeText,
    badgeIcon,
    align = 'center',
    className = ''
}: SectionHeaderProps) {
    const alignmentClasses = align === 'center' ? 'text-center mx-auto' : 'text-left'

    return (
        <div className={`mb-12 md:mb-16 ${alignmentClasses} ${className}`}>
            {badgeText && (
                <div className={align === 'center' ? 'flex justify-center mb-6' : 'mb-6'}>
                    <PageBadge text={badgeText} icon={badgeIcon} />
                </div>
            )}
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                {title}
            </h2>
            
            {subtitle && (
                <p className={`text-lg text-gray-600 font-light leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
                    {subtitle}
                </p>
            )}
        </div>
    )
}

import { ReactNode } from 'react'

interface CTASectionProps {
    title: ReactNode
    subtitle?: ReactNode
    children?: ReactNode
    className?: string
}

export default function CTASection({
    title,
    subtitle,
    children,
    className = ''
}: CTASectionProps) {
    return (
        <section className={`py-20 bg-white ${className}`}>
            <div className="max-w-7xl mx-auto px-5 md:px-6 lg:px-8">
                <div className="bg-gray-50 rounded-[3rem] p-8 md:p-14 lg:p-16 text-center relative overflow-hidden border border-gray-100">
                    {/* Decorative background grid (subtle, standard IA Solutions style) */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '30px 30px' }} 
                    />
                    
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 md:mb-8 tracking-tight">
                            {title}
                        </h2>
                        
                        {subtitle && (
                            <p className="text-gray-600 text-lg md:text-xl mb-10 md:mb-12 font-light leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                        
                        {children && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {children}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

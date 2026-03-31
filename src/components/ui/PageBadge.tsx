'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageBadgeProps {
    text: string
    icon?: ReactNode
}

export default function PageBadge({ text, icon }: PageBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-black mb-5"
        >
            {icon ? (
                <span className="mr-2 flex items-center">{icon}</span>
            ) : (
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" />
            )}
            {text}
        </motion.div>
    )
}

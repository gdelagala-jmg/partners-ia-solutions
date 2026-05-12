'use client'

import React, { createContext, useContext, ReactNode } from 'react'

interface SecurityConfig {
    formSecurityEnabled: boolean
}

const SecurityContext = createContext<SecurityConfig | undefined>(undefined)

export function SecurityProvider({ 
    children, 
    config 
}: { 
    children: ReactNode, 
    config: SecurityConfig 
}) {
    return (
        <SecurityContext.Provider value={config}>
            {children}
        </SecurityContext.Provider>
    )
}

export function useSecurity() {
    const context = useContext(SecurityContext)
    if (context === undefined) {
        // Fallback seguro si no hay provider (ej. tests o componentes aislados)
        return { formSecurityEnabled: false }
    }
    return context
}

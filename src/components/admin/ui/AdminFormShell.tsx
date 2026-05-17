'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'

interface AdminFormShellProps {
  title: string
  description?: string
  backUrl?: string
  onCancel?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
  submitLabel?: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
  footerClassName?: string
  formId?: string
}

export default function AdminFormShell({
  title,
  description,
  backUrl,
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Guardar cambios',
  children,
  actions,
  className,
  footerClassName,
  formId
}: AdminFormShellProps) {
  return (
    <div className={cn("flex flex-col min-h-full", className)}>
      {/* Sticky Header for Form Title and Actions */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {backUrl && (
            <Link 
              href={backUrl}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions || (
            <>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Cancelar</span>
                </button>
              )}
              {(onSubmit || formId) && (
                <button
                  type={formId ? "submit" : "button"}
                  form={formId}
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Guardando...' : submitLabel}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Optional Mobile Sticky Footer Action Bar (if not using header buttons) */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-gray-100 p-4 flex gap-3",
        footerClassName
      )}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-center"
          >
            Cancelar
          </button>
        )}
        {(onSubmit || formId) && (
          <button
            type={formId ? "submit" : "button"}
            form={formId}
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-[2] px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 transition-all text-center"
          >
            {isSubmitting ? 'Guardando...' : submitLabel}
          </button>
        )}
      </div>
    </div>
  )
}

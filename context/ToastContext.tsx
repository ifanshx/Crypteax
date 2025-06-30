'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast, { ToastProps } from '@/components/ui/Toast'

// Gunakan type alias, bukan interface kosong
export type ToastItem = Omit<ToastProps, 'onClose'>

const ToastContext = createContext<{ add: (toast: Omit<ToastItem, 'id'>) => void } | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const add = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts((curr) => [...curr, { ...t, id }])
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col-reverse space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

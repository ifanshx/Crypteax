'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  SunMedium,
  Moon,
  Star,
  Zap,
  X,
} from 'lucide-react'
import { clsx } from 'clsx'

export interface ToastProps {
  id: string
  title: string
  description?: string
  type?: "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "primary"
  | "secondary"
  | "dark"
  | "light"
  | "custom"
  duration?: number
  onClose: (id: string) => void
}

export default function Toast({
  id, title, description, type = 'info',
  duration = 4000, onClose
}: ToastProps) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(100)
  const [paused, setPaused] = useState(false)
  const ref = useRef<number | null>(null)

  const styles = {
    success: {
      bg: "bg-green-500",
      icon: <CheckCircle2 className="w-6 h-6" />
    },
    error: {
      bg: "bg-red-500",
      icon: <XCircle className="w-6 h-6" />
    },
    warning: {
      bg: "bg-yellow-500",
      text: "text-black",
      icon: <AlertTriangle className="w-6 h-6" />
    },
    info: {
      bg: "bg-blue-500",
      icon: <Info className="w-6 h-6" />
    },
    loading: {
      bg: "bg-gray-500",
      icon: <Loader2 className="w-6 h-6 animate-spin" />
    },
    primary: {
      bg: "bg-indigo-600",
      icon: <Zap className="w-6 h-6" />
    },
    secondary: {
      bg: "bg-purple-600",
      icon: <Star className="w-6 h-6" />
    },
    dark: {
      bg: "bg-gray-800",
      icon: <Moon className="w-6 h-6 text-white" />
    },
    light: {
      bg: "bg-gray-100",
      text: "text-black",
      icon: <SunMedium className="w-6 h-6 text-yellow-500" />
    },
    custom: {
      bg: "bg-gradient-to-r from-pink-500 to-yellow-500",
      icon: <Star className="w-6 h-6 text-white" />
    }
  }[type]

  useEffect(() => {
    if (!visible) return;
    const tick = 50;
    const decrement = (tick / duration) * 100;

    ref.current = window.setInterval(() => {
      setProgress(p => {
        if (p <= 0) {
          clearInterval(ref.current!);
          setVisible(false);
          return 0;
        }
        return p - decrement;
      });
    }, tick);

    return () => {
      if (ref.current !== null) clearInterval(ref.current);
    }
  }, [duration, paused, visible]);

  useEffect(() => {
    if (!visible) onClose(id)
  }, [visible, id, onClose])

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={clsx(
        styles.bg,
        'text-white p-4 rounded-lg shadow-lg w-80 mb-2',
        'transform transition-all motion-safe:hover:scale-[1.02]',
        'animate-in fade-in slide-in-from-top-2 duration-300',
        !visible && 'animate-out fade-out slide-out-to-top-2 duration-200'
      )}
    >
      <div className="flex items-start">
        <div className="mr-3">{styles.icon}</div>
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        <button onClick={() => setVisible(false)} aria-label="Close">
          <X className="w-5 h-5 opacity-80 hover:opacity-100" />
        </button>
      </div>
      <div className="mt-2 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
        <div
          className={clsx(
            "h-full rounded-full transition-all ease-linear motion-safe:duration-50",
            progress < 20 && "animate-pulse",
            type === "success" ? "bg-gradient-to-r from-green-400 to-green-600" :
              type === "error" ? "bg-gradient-to-r from-red-400 to-red-600" :
                type === "warning" ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                  "bg-gradient-to-r from-blue-400 to-blue-600"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

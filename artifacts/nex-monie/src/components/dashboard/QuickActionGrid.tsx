import React, { useState, useRef } from 'react'
import { 
  Send, 
  FileText, 
  Smartphone, 
  Wifi, 
  QrCode, 
  ArrowDownCircle, 
  Repeat, 
  UserPlus 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'wouter'

const ACTIONS = [
  { id: 'send', icon: <Send size={22} />, label: "Send Money", iconColor: "text-accent", path: "/send-money" },
  { id: 'bills', icon: <FileText size={22} />, label: "Pay Bills", iconColor: "text-accent", path: "/pay-bills" },
  { id: 'airtime', icon: <Smartphone size={22} />, label: "Buy Airtime", iconColor: "text-accent", path: "/buy-airtime" },
  { id: 'data', icon: <Wifi size={22} />, label: "Data Bundle", iconColor: "text-accent", path: "/buy-data" },
  { id: 'scan', icon: <QrCode size={22} />, label: "Scan & Pay", iconColor: "text-accent", path: "/scan-pay" },
  { id: 'request', icon: <ArrowDownCircle size={22} />, label: "Request Money", iconColor: "text-accent", path: "/request-money" },
  { id: 'transactions', icon: <Repeat size={22} />, label: "Transactions", iconColor: "text-accent", path: "/transactions" },
  { id: 'refer', icon: <UserPlus size={22} />, label: "Refer & Earn", iconColor: "text-accent", path: "/profile" },
]

export function QuickActionGrid() {
  const [, setLocation] = useLocation()
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const threshold = 80

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    setIsDragging(true)
    window.navigator?.vibrate?.(10)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientX - startX.current
    setDragOffset(Math.max(0, Math.min(110, diff)))
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (dragOffset >= threshold) {
      window.navigator?.vibrate?.([20, 10, 20])
      setLocation('/utilities-hub')
    } else {
      setDragOffset(0)
    }
  }

  return (
    <div
      className="px-5 mb-8 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={cn("select-none", (isDragging || dragOffset > 0) && "opacity-80")}
        style={{
          transform: `translate3d(${dragOffset}px, 0, 0)`,
          transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight">Quick Actions</h2>
          <button
            onClick={() => { if (dragOffset > 0) return; setLocation('/actions-hub') }}
            className="text-[13px] font-bold text-primary active:opacity-60 transition-opacity"
          >
            Manage
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {ACTIONS.map((action, idx) => (
            <Link
              key={idx}
              href={action.path}
              className="flex flex-col items-center gap-2.5 pt-5 pb-4 px-1 rounded-[24px] bg-white shadow-soft border border-gray-50/50 active:scale-95 hover:shadow-md transition-all group"
            >
              <div className={cn("transition-transform group-hover:scale-110", action.iconColor)}>
                {action.icon}
              </div>
              <span className="text-[11px] font-bold text-[#1A1A1A] leading-tight text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import {
  Send, ArrowDownLeft, QrCode, Repeat,
  Smartphone, Wifi, FileText,
  Banknote, TrendingUp, Shield, HeadphonesIcon,
  Eye, EyeOff, ChevronRight, Copy, Check,
  ChevronLeft
} from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BottomNav } from '@/components/layout/BottomNav'
import { useGetWallet } from '@workspace/api-client-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type Action = {
  id: string
  icon: React.ReactNode
  label: string
  description: string
  path: string
  color: string
  soon?: boolean
}

const SECTIONS: { title: string; actions: Action[] }[] = [
  {
    title: 'Money Movement',
    actions: [
      {
        id: 'send',
        icon: <Send size={20} />,
        label: 'Send Money',
        description: 'To Nex users or banks',
        path: '/send-money',
        color: 'bg-[#005F56]/10 text-[#005F56]',
      },
      {
        id: 'request',
        icon: <ArrowDownLeft size={20} />,
        label: 'Request',
        description: 'Share your account link',
        path: '/request-money',
        color: 'bg-[#1B816B]/10 text-[#1B816B]',
      },
      {
        id: 'scan',
        icon: <QrCode size={20} />,
        label: 'Scan & Pay',
        description: 'Pay via QR code',
        path: '/scan-pay',
        color: 'bg-blue-50 text-blue-500',
      },
      {
        id: 'transactions',
        icon: <Repeat size={20} />,
        label: 'Transactions',
        description: 'View all activity',
        path: '/transactions',
        color: 'bg-slate-100 text-slate-500',
      },
    ],
  },
  {
    title: 'Bills & Top-ups',
    actions: [
      {
        id: 'bills',
        icon: <FileText size={20} />,
        label: 'Pay Bills',
        description: 'Electricity, cable & more',
        path: '/pay-bills',
        color: 'bg-purple-50 text-purple-500',
      },
      {
        id: 'airtime',
        icon: <Smartphone size={20} />,
        label: 'Airtime',
        description: 'All networks',
        path: '/buy-airtime',
        color: 'bg-orange-50 text-orange-500',
      },
      {
        id: 'data',
        icon: <Wifi size={20} />,
        label: 'Data Bundle',
        description: 'Internet on the go',
        path: '/buy-data',
        color: 'bg-emerald-50 text-emerald-500',
      },
    ],
  },
  {
    title: 'Grow & More',
    actions: [
      {
        id: 'savings',
        icon: <Banknote size={20} />,
        label: 'Save',
        description: 'Lock funds & earn',
        path: '/finances',
        color: 'bg-rose-50 text-rose-400',
      },
      {
        id: 'earn',
        icon: <TrendingUp size={20} />,
        label: 'Earn',
        description: 'Grow your money',
        path: '/earn',
        color: 'bg-yellow-50 text-yellow-500',
      },
      {
        id: 'insurance',
        icon: <Shield size={20} />,
        label: 'Insurance',
        description: 'Cover & protect',
        path: '/',
        color: 'bg-indigo-50 text-indigo-500',
        soon: true,
      },
      {
        id: 'support',
        icon: <HeadphonesIcon size={20} />,
        label: 'Support',
        description: 'We\'re here to help',
        path: '/support',
        color: 'bg-teal-50 text-teal-500',
      },
    ],
  },
]

export default function ActionsHub() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [, setLocation] = useLocation()
  const { data: wallet, isLoading } = useGetWallet()
  const { toast } = useToast()

  const balance = Number(wallet?.availableBalance || 0)

  const handleAction = (action: Action) => {
    if (action.soon) {
      toast({ description: `${action.label} is coming soon!` })
      return
    }
    setLocation(action.path)
  }

  return (
    <main className="min-h-screen bg-[#F8FAF9] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="px-5 pt-10 pb-5">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 active:scale-95 transition-transform"
            >
              <ChevronLeft size={20} className="text-[#1A1A1A]" />
            </button>
            <h1 className="text-[17px] font-bold text-[#1A1A1A]">Action Hub</h1>
            <div className="w-10" />
          </div>

          {/* Balance strip */}
          <div className="bg-[#005F56] rounded-[20px] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Available Balance</p>
              {isLoading ? (
                <div className="h-7 w-32 bg-white/20 rounded-lg animate-pulse" />
              ) : (
                <p className="text-[22px] font-black text-white tracking-tight">
                  {balanceVisible ? `₦${balance.toLocaleString()}` : '₦ ••••••'}
                </p>
              )}
            </div>
            <button
              onClick={() => setBalanceVisible(v => !v)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
            >
              {balanceVisible ? <EyeOff size={16} className="text-white" /> : <Eye size={16} className="text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Sections */}
      <div className="px-5 pt-6 space-y-8">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 pl-1">
              {section.title}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {section.actions.map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onPress={() => handleAction(action)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  )
}

function ActionCard({ action, onPress }: { action: Action; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className={cn(
        'relative w-full text-left bg-white rounded-[20px] p-4 shadow-sm border border-gray-50/80',
        'active:scale-95 transition-all duration-150 hover:shadow-md',
        action.soon && 'opacity-75'
      )}
    >
      {action.soon && (
        <Badge className="absolute top-3 right-3 bg-gray-100 text-gray-400 text-[9px] font-black uppercase tracking-widest border-0 px-1.5 py-0.5 rounded-full">
          Soon
        </Badge>
      )}
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${action.color}`}>
        {action.icon}
      </div>
      <p className="text-[13px] font-bold text-[#1A1A1A] leading-tight">{action.label}</p>
      <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-tight">{action.description}</p>
    </button>
  )
}

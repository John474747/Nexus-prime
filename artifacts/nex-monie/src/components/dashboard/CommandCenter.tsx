import React, { useState } from 'react'
import { Eye, EyeOff, Plus, Send, Download, CreditCard, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useGetWallet } from '@workspace/api-client-react'
import { Link } from 'wouter'

export function CommandCenter() {
  const [showBalance, setShowBalance] = useState(true)
  
  const { data: wallet, isLoading } = useGetWallet()

  return (
    <div className="px-5 mb-8">
      <Card className="bg-gradient-to-br from-[#005F56] to-[#0D9B85] relative border-none text-white overflow-hidden rounded-[32px] shadow-xl pt-6 pb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        
        <div className="px-6 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">Available Portfolio</span>
            <button onClick={() => setShowBalance(!showBalance)} className="text-white hover:opacity-80 transition-opacity p-1">
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-[28px] font-bold leading-none">₦</span>
            <span className={`text-[32px] font-bold leading-none transition-all duration-300 ${!showBalance ? "blur-lg" : ""}`}>
              {isLoading ? "..." : (showBalance ? (Number(wallet?.availableBalance || 0)).toLocaleString() : "•••••••")}
            </span>
            {showBalance && <span className="text-[20px] font-bold align-super ml-0.5 opacity-90">.00</span>}
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[12px] font-bold text-white mb-8 hover:bg-white/20 transition-all active:scale-95">
            Primary Naira Account <ChevronRight size={14} />
          </button>
        </div>

        <div className="h-[1px] w-full bg-white/10 mb-6" />

        <div className="flex items-start justify-around px-2 relative z-10">
          <ActionItem icon={<Plus size={20} />} label="Fund Account" path="/actions-hub" />
          <div className="h-8 w-[1px] bg-white/10 mt-2" />
          <ActionItem icon={<Send size={20} />} label="Send Money" path="/send-money" />
          <div className="h-8 w-[1px] bg-white/10 mt-2" />
          <ActionItem icon={<Download size={20} />} label="Receive Money" path="/actions-hub" />
          <div className="h-8 w-[1px] bg-white/10 mt-2" />
          <ActionItem icon={<CreditCard size={20} />} label="Account Details" path="/profile" />
        </div>
      </Card>
    </div>
  )
}

function ActionItem({ icon, label, path }: { icon: React.ReactNode, label: string, path: string }) {
  const words = label.split(' ')

  return (
    <Link href={path} className="flex flex-col items-center gap-2.5 flex-1 group">
      <div className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center group-active:scale-90 group-hover:bg-white/10 transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-bold opacity-90 text-center leading-tight uppercase tracking-widest">
        {words[0]}<br/>{words[1]}
      </span>
    </Link>
  )
}

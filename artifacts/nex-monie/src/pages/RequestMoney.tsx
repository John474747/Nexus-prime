import React, { useState } from 'react'
import { ChevronLeft, Copy, Check, Share2, QrCode, ArrowDownLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { BottomNav } from '@/components/layout/BottomNav'
import { useGetWallet } from '@workspace/api-client-react'
import { useToast } from '@/hooks/use-toast'

export default function RequestMoney() {
  const [copied, setCopied] = useState<string | null>(null)
  const { data: wallet, isLoading } = useGetWallet()
  const { toast } = useToast()

  const accountName = wallet?.accountName || '—'
  const accountNumber = wallet?.accountNumber || '—'
  const bankName = wallet?.bankName || 'Nex Monie'

  const copyToClipboard = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      toast({ description: 'Copied to clipboard' })
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast({ description: 'Could not copy', variant: 'destructive' })
    }
  }

  const handleShare = async () => {
    const text = `Send money to:\nName: ${accountName}\nAccount: ${accountNumber}\nBank: ${bankName}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Nex Monie Account', text })
      } catch { /* user cancelled */ }
    } else {
      await copyToClipboard(text, 'all')
      toast({ description: 'Account details copied — share anywhere!' })
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAF9] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm px-5 pt-10 pb-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} className="text-[#1A1A1A]" />
          </button>
          <h1 className="text-[17px] font-bold text-[#1A1A1A]">Request Money</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pt-8 space-y-5">
        {/* Hero icon */}
        <div className="flex flex-col items-center text-center mb-2">
          <div className="w-16 h-16 rounded-[24px] bg-[#1B816B]/10 text-[#1B816B] flex items-center justify-center mb-4">
            <ArrowDownLeft size={30} />
          </div>
          <h2 className="text-[20px] font-black text-[#1A1A1A] tracking-tight">Share Your Details</h2>
          <p className="text-[13px] text-gray-400 font-medium mt-1 max-w-[220px]">
            Anyone can send money to you using these details
          </p>
        </div>

        {/* Account details card */}
        <Card className="border-none shadow-sm rounded-[24px] overflow-hidden bg-white">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              <DetailRow
                label="Account Name"
                value={accountName}
                onCopy={() => copyToClipboard(accountName, 'name')}
                copied={copied === 'name'}
              />
              <DetailRow
                label="Account Number"
                value={accountNumber}
                onCopy={() => copyToClipboard(accountNumber, 'number')}
                copied={copied === 'number'}
                mono
              />
              <DetailRow
                label="Bank"
                value={bankName}
                onCopy={() => copyToClipboard(bankName, 'bank')}
                copied={copied === 'bank'}
              />
            </div>
          )}
        </Card>

        {/* QR placeholder */}
        <Card className="border-none shadow-sm rounded-[24px] p-6 bg-white flex flex-col items-center gap-3">
          <div className="w-36 h-36 rounded-[20px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-300">
            <QrCode size={40} />
            <span className="text-[10px] font-bold uppercase tracking-widest">QR Code</span>
          </div>
          <p className="text-[12px] text-gray-400 font-medium text-center">
            Scan with any mobile banking app to send directly
          </p>
        </Card>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full py-4 bg-[#005F56] text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-[#005F56]/20"
        >
          <Share2 size={18} />
          Share Account Details
        </button>
      </div>

      <BottomNav />
    </main>
  )
}

function DetailRow({
  label,
  value,
  onCopy,
  copied,
  mono = false,
}: {
  label: string
  value: string
  onCopy: () => void
  copied: boolean
  mono?: boolean
}) {
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-[15px] font-bold text-[#1A1A1A] truncate ${mono ? 'tracking-widest' : 'tracking-tight'}`}>
          {value}
        </p>
      </div>
      <button
        onClick={onCopy}
        className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center active:scale-90 transition-transform shrink-0"
      >
        {copied
          ? <Check size={15} className="text-emerald-500" />
          : <Copy size={15} className="text-gray-400" />
        }
      </button>
    </div>
  )
}

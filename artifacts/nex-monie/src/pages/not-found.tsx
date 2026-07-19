import React from 'react'
import { useLocation } from 'wouter'
import { Home } from 'lucide-react'
import { NexLogo } from '@/components/ui/NexLogo'

export default function NotFound() {
  const [, navigate] = useLocation()

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
      <header className="px-6 py-6">
        <NexLogo />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-[28px] bg-[#E8F5F3] text-[#005F56] flex items-center justify-center mb-6 text-[40px] font-black">
          ?
        </div>
        <h1 className="text-[32px] font-black text-[#1A1A1A] tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-[15px] text-gray-500 font-medium mb-10 max-w-xs">
          This page doesn't exist. You may have followed a broken link or mistyped the URL.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-8 py-4 bg-[#005F56] text-white font-bold rounded-2xl shadow-lg shadow-[#005F56]/20 active:scale-95 transition-transform"
        >
          <Home size={18} />
          Back to Home
        </button>
      </div>
    </div>
  )
}

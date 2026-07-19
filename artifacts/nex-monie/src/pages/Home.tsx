import React from 'react'
import { Bell, User } from 'lucide-react'
import { useUser, useClerk } from '@clerk/react'
import { NexLogo } from '@/components/ui/NexLogo'
import { CommandCenter } from '@/components/dashboard/CommandCenter'
import { QuickActionGrid } from '@/components/dashboard/QuickActionGrid'
import { ProductDiscovery } from '@/components/dashboard/ProductDiscovery'
import { GrowthSnapshot } from '@/components/dashboard/GrowthSnapshot'
import { BottomNav } from '@/components/layout/BottomNav'
import { Link } from 'wouter'

export default function Home() {
  const { user } = useUser()

  return (
    <main className="min-h-screen pb-24 bg-[#F8FAF9]">
      <header className="px-5 pt-8 pb-4 sticky top-0 z-30 bg-[#F8FAF9]/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <NexLogo />
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-white shadow-sm active:scale-95 transition-all">
              <Bell size={20} className="text-[#1A1A1A]" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF6B6B] rounded-full border-2 border-white" />
            </button>
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-sm active:scale-95 transition-all cursor-pointer">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#005F56]/10 flex items-center justify-center">
                    <User size={20} className="text-[#005F56]" />
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">Welcome back, {user?.firstName || 'User'}! 👋</h1>
        </div>
      </header>

      <CommandCenter />
      <QuickActionGrid />
      <ProductDiscovery />
      <GrowthSnapshot />
      <BottomNav />
    </main>
  )
}

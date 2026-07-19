import React from 'react'
import { Home, TrendingUp, Plus, Wallet, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'wouter'

export function BottomNav() {
  const [location] = useLocation()
  const isActionsHub = location === '/actions-hub'

  const NavItem = ({ path, icon, label }: { path: string, icon: React.ReactNode, label: string }) => {
    const isActive = location === path || (path === '/' && location === '')
    
    return (
      <Link href={path} className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300 min-w-[50px]",
        isActive ? "text-primary" : "text-gray-400"
      )}>
        <span className="[&>svg]:w-8 [&>svg]:h-8">{icon}</span>
        <span className="text-[12px] font-medium tracking-tight">{label}</span>
      </Link>
    )
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-6 py-4 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        <NavItem path="/" icon={<Home />} label="Home" />
        <NavItem path="/earn" icon={<TrendingUp />} label="Earn" />
        
        <div className="absolute left-1/2 -translate-x-1/2 -top-12">
          <Link href="/actions-hub" className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-95",
            isActionsHub
              ? "bg-[#004A43] text-white shadow-[#004A43]/40 scale-95"
              : "bg-accent text-white shadow-accent/40"
          )}>
            <Plus
              size={28}
              className={cn(
                "transition-transform duration-300",
                isActionsHub && "rotate-45"
              )}
            />
          </Link>
        </div>
        
        <div className="w-14" />
        
        <NavItem path="/finances" icon={<Wallet />} label="Finances" />
        <NavItem path="/profile" icon={<User />} label="Profile" />
      </div>
    </div>
  )
}

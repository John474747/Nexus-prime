import React from 'react'
import { useUser, useClerk } from '@clerk/react'
import { BottomNav } from '@/components/layout/BottomNav'
import { User, Shield, Bell, Globe, HelpCircle, LogOut, ChevronRight, Copy, Check, Info } from 'lucide-react'
import { useGetWallet } from '@workspace/api-client-react'
import { useToast } from '@/hooks/use-toast'
import { useLocation } from 'wouter'

export default function Profile() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { data: wallet } = useGetWallet()
  const { toast } = useToast()
  const [, navigate] = useLocation()
  const [copied, setCopied] = React.useState(false)

  const copyAccount = () => {
    if (wallet?.accountNumber) {
      navigator.clipboard.writeText(wallet.accountNumber)
      setCopied(true)
      toast({ description: 'Account number copied' })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleComingSoon = (feature: string) => {
    toast({
      title: `${feature}`,
      description: 'This feature is coming soon. We\'ll notify you when it\'s ready.',
    })
  }

  const MenuItem = ({
    icon,
    label,
    onClick,
    color = 'text-[#1A1A1A]',
    danger = false,
  }: {
    icon: React.ReactNode
    label: string
    onClick?: () => void
    color?: string
    danger?: boolean
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 bg-white rounded-[20px] shadow-sm border border-gray-50 active:scale-[0.98] transition-all mb-3 ${danger ? 'border-red-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${danger ? 'bg-red-50' : 'bg-gray-50'} flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className={`text-[14px] font-bold ${color}`}>{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </button>
  )

  return (
    <main className="min-h-screen pb-32 bg-[#F8FAF9]">
      <header className="px-6 pt-10 pb-6 bg-[#005F56] text-white rounded-b-[40px] shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <h1 className="text-[20px] font-bold mb-6 relative z-10">My Profile</h1>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/20 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-4 text-[#005F56]" />
              )}
            </div>
          </div>
          <div>
            <h2 className="text-[22px] font-bold leading-tight">{user?.fullName || 'Nex User'}</h2>
            <p className="text-[13px] opacity-80 mb-2">{user?.primaryEmailAddress?.emailAddress}</p>

            {wallet?.accountNumber && (
              <div
                className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 w-fit cursor-pointer active:scale-95 transition-all"
                onClick={copyAccount}
              >
                <span className="text-[12px] font-bold tracking-widest">{wallet.accountNumber}</span>
                {copied ? <Check size={14} className="text-green-300" /> : <Copy size={14} />}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-5">
        {/* Account info card */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 p-4 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E8F5F3] flex items-center justify-center shrink-0">
            <Info size={16} className="text-[#005F56]" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#1A1A1A]">{wallet?.bankName ?? 'Nex MFB'}</p>
            <p className="text-[11px] text-gray-400 font-medium">
              {wallet?.accountName ?? 'Loading…'} · {wallet?.accountNumber ?? '—'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Account Settings</h3>
          <MenuItem
            icon={<User size={20} />}
            label="Personal Information"
            onClick={() => handleComingSoon('Personal Information')}
          />
          <MenuItem
            icon={<Shield size={20} />}
            label="Security & PIN"
            onClick={() => handleComingSoon('Security & PIN')}
          />
          <MenuItem
            icon={<Bell size={20} />}
            label="Notifications"
            onClick={() => handleComingSoon('Notifications')}
          />
          <MenuItem
            icon={<Globe size={20} />}
            label="Language & Region"
            onClick={() => handleComingSoon('Language & Region')}
          />
        </div>

        <div className="mb-8">
          <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Support</h3>
          <MenuItem
            icon={<HelpCircle size={20} />}
            label="Help Center"
            onClick={() => navigate('/support')}
          />
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 font-bold rounded-[20px] active:scale-[0.98] border border-red-100"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <BottomNav />
    </main>
  )
}

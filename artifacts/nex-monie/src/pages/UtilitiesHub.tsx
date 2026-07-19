import React from 'react'
import { ChevronLeft, Music, Gamepad2, Pizza, Car, ShoppingBag, Ticket } from 'lucide-react'
import { Card } from '@/components/ui/card'

const UTILITIES = [
  { id: 'spotify', icon: <Music size={24} />, label: "Spotify", cat: "Entertainment", color: "bg-green-500 text-white" },
  { id: 'apple', icon: <Music size={24} />, label: "Apple Music", cat: "Entertainment", color: "bg-red-500 text-white" },
  { id: 'uber', icon: <Car size={24} />, label: "Uber", cat: "Transport", color: "bg-black text-white" },
  { id: 'bolt', icon: <Car size={24} />, label: "Bolt", cat: "Transport", color: "bg-emerald-500 text-white" },
  { id: 'jumia', icon: <Pizza size={24} />, label: "Jumia Food", cat: "Food", color: "bg-orange-500 text-white" },
  { id: 'psn', icon: <Gamepad2 size={24} />, label: "PlayStation", cat: "Gaming", color: "bg-blue-600 text-white" },
  { id: 'steam', icon: <Gamepad2 size={24} />, label: "Steam", cat: "Gaming", color: "bg-gray-800 text-white" },
  { id: 'movies', icon: <Ticket size={24} />, label: "Showmax", cat: "Entertainment", color: "bg-purple-600 text-white" },
]

export default function UtilitiesHub() {
  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <header className="px-5 pt-10 pb-6 bg-white sticky top-0 shadow-sm z-20">
        <div className="flex items-center mb-6">
          <button onClick={() => window.history.back()} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 active:scale-95">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 text-center pr-10">
            <h1 className="text-[18px] font-bold">Lifestyle</h1>
          </div>
        </div>
      </header>

      <div className="p-5">
        <Card className="bg-[#1A1A1A] p-6 rounded-[28px] text-white border-none shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F88F99]/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-[20px] font-black mb-1">Global Subscriptions</h2>
            <p className="text-[12px] opacity-80 mb-6 max-w-[200px]">Pay for your favorite services directly in Naira.</p>
            <button className="px-5 py-2 bg-white text-[#1A1A1A] rounded-full text-[11px] font-bold active:scale-95">Manage Subs</button>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {UTILITIES.map(u => (
            <Card key={u.id} className="p-5 border-none shadow-sm rounded-[24px] flex flex-col items-center text-center gap-3 active:scale-95 transition-transform hover:shadow-md cursor-pointer bg-white">
              <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shadow-md ${u.color}`}>
                {u.icon}
              </div>
              <div>
                <span className="text-[14px] font-bold text-[#1A1A1A] block mb-0.5">{u.label}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{u.cat}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

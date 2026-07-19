import React from 'react'
import { ChevronLeft, MessageCircle, Phone, Mail, FileQuestion } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function Support() {
  const CHANNELS = [
    { icon: <MessageCircle />, title: "Live Chat", desc: "Usually replies in 5m", color: "bg-[#005F56] text-white" },
    { icon: <Phone />, title: "Phone", desc: "Mon - Fri, 8am - 6pm", color: "bg-blue-50 text-blue-500" },
    { icon: <Mail />, title: "Email", desc: "support@nexmonie.com", color: "bg-purple-50 text-purple-500" },
    { icon: <FileQuestion />, title: "FAQs", desc: "Read helpful articles", color: "bg-orange-50 text-orange-500" },
  ]

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <header className="px-5 pt-10 pb-6 bg-[#005F56] text-white rounded-b-[40px] shadow-lg mb-8">
        <div className="flex items-center mb-6">
          <button onClick={() => window.history.back()} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 active:scale-95 backdrop-blur-md">
            <ChevronLeft size={20} />
          </button>
        </div>
        <h1 className="text-[28px] font-black tracking-tight mb-2">How can we help?</h1>
        <p className="text-[14px] opacity-80">We're here for you 24/7. Get in touch with our elite support team.</p>
      </header>

      <div className="p-5 space-y-4">
        {CHANNELS.map((c, i) => (
          <Card key={i} className="p-5 border-none shadow-sm rounded-3xl flex items-center gap-4 active:scale-95 transition-transform cursor-pointer">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${c.color}`}>
              {c.icon}
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1A1A1A]">{c.title}</h3>
              <p className="text-[12px] text-gray-500 font-medium">{c.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}

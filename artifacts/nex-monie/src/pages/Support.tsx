import React from 'react'
import { ChevronLeft, MessageCircle, Phone, Mail, FileQuestion, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function Support() {
  const { toast } = useToast()

  const handleChannel = (title: string) => {
    switch (title) {
      case 'Live Chat':
        window.open('https://wa.me/2348000000000?text=Hello%2C%20I%20need%20help%20with%20my%20Nex%20Monie%20account', '_blank')
        break
      case 'Phone':
        window.location.href = 'tel:+2348000000000'
        break
      case 'Email':
        window.location.href = 'mailto:support@nexmonie.com?subject=Support%20Request'
        break
      case 'FAQs':
        toast({ description: 'FAQs coming soon — we\'re building the help centre.' })
        break
    }
  }

  const CHANNELS = [
    {
      icon: <MessageCircle size={22} />,
      title: "Live Chat",
      desc: "Usually replies in 5 minutes",
      color: "bg-[#005F56] text-white",
      badge: "Fastest",
    },
    {
      icon: <Phone size={22} />,
      title: "Phone",
      desc: "+234 800 000 0000 · Mon–Fri, 8am–6pm",
      color: "bg-blue-50 text-blue-500",
      badge: null,
    },
    {
      icon: <Mail size={22} />,
      title: "Email",
      desc: "support@nexmonie.com",
      color: "bg-purple-50 text-purple-500",
      badge: null,
    },
    {
      icon: <FileQuestion size={22} />,
      title: "FAQs",
      desc: "Browse helpful articles",
      color: "bg-orange-50 text-orange-500",
      badge: null,
    },
  ]

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <header className="px-5 pt-10 pb-6 bg-[#005F56] text-white rounded-b-[40px] shadow-lg mb-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 active:scale-95 backdrop-blur-md"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <h1 className="text-[28px] font-black tracking-tight mb-2">How can we help?</h1>
        <p className="text-[14px] opacity-80">We're here for you 24/7. Reach our elite support team.</p>
      </header>

      <div className="p-5 space-y-4">
        {CHANNELS.map((c) => (
          <Card
            key={c.title}
            onClick={() => handleChannel(c.title)}
            className="p-5 border-none shadow-sm rounded-3xl flex items-center gap-4 active:scale-95 transition-transform cursor-pointer hover:shadow-md"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${c.color}`}>
              {c.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#1A1A1A]">{c.title}</h3>
                {c.badge && (
                  <span className="text-[9px] font-bold bg-[#005F56] text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {c.badge}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-gray-500 font-medium mt-0.5">{c.desc}</p>
            </div>
            <ExternalLink size={16} className="text-gray-300 shrink-0" />
          </Card>
        ))}
      </div>

      {/* Response time note */}
      <div className="px-5 mt-2">
        <p className="text-[11px] text-gray-400 text-center font-medium">
          Average response time: {'<'}5 min via Live Chat · 24 hrs via Email
        </p>
      </div>
    </main>
  )
}

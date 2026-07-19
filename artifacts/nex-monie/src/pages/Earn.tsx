import React, { useState, useEffect, useRef } from 'react'
import { Search, Briefcase, GraduationCap, Award, Flame, ChevronRight, Wifi, WifiOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { BottomNav } from '@/components/layout/BottomNav'

interface Opportunity {
  id: string
  title: string
  reward: string
  deadline: string | null
  type: string
  platform: string
  url: string
  status: string
}

function categoryIcon(type: string) {
  switch (type) {
    case 'Grant': return <Flame className="text-orange-500" />
    case 'Career': return <Briefcase className="text-blue-500" />
    case 'Development': return <Briefcase className="text-blue-500" />
    case 'Design': return <Award className="text-pink-500" />
    case 'Security': return <Award className="text-red-500" />
    case 'Content': return <GraduationCap className="text-emerald-500" />
    default: return <Award className="text-purple-500" />
  }
}

const TAB_MAP: Record<string, string[]> = {
  'All':      [],
  'Grants':   ['Grant'],
  'Bounties': ['Bounty', 'Development', 'Design', 'Security'],
  'Career':   ['Career'],
  'Learning': ['Content', 'Learning'],
}

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? ''

export default function Earn() {
  const [activeTab, setActiveTab] = useState('All')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<Opportunity[]>([])
  const [status, setStatus] = useState<'connecting' | 'streaming' | 'live' | 'offline'>('connecting')
  const [total, setTotal] = useState(0)
  const esRef = useRef<EventSource | null>(null)
  const seen = useRef(new Set<string>())

  const tabs = ['All', 'Grants', 'Bounties', 'Career', 'Learning']

  useEffect(() => {
    function connect() {
      if (esRef.current) esRef.current.close()
      seen.current.clear()
      setItems([])
      setStatus('connecting')

      const es = new EventSource(`${BASE}/api/earn/stream`)
      esRef.current = es

      es.addEventListener('batch', (e: MessageEvent) => {
        setStatus('streaming')
        try {
          const { items: batch } = JSON.parse(e.data)
          const fresh = (batch as Opportunity[]).filter(o => !seen.current.has(o.id))
          fresh.forEach(o => seen.current.add(o.id))
          if (fresh.length) setItems(prev => [...prev, ...fresh])
        } catch {}
      })

      es.addEventListener('complete', (e: MessageEvent) => {
        setStatus('live')
        try { setTotal(JSON.parse(e.data).total) } catch {}
        es.close()
        // auto-refresh in 5 min
        setTimeout(connect, 5 * 60 * 1000)
      })

      es.addEventListener('providerError', () => {})

      es.onerror = () => {
        setStatus('offline')
        es.close()
        setTimeout(connect, 15000)
      }
    }

    connect()
    return () => { esRef.current?.close() }
  }, [])

  const visible = items.filter(opp => {
    const cats = TAB_MAP[activeTab]
    if (cats.length && !cats.includes(opp.type)) return false
    if (query && ![opp.title, opp.platform, opp.type].join(' ').toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <main className="min-h-screen pb-24 bg-[#F8FAF9]">
      <header className="px-5 pt-8 pb-4 bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[22px] font-bold text-[#1A1A1A]">Earn & Grow</h1>
          <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
            status === 'live' ? 'bg-emerald-50 text-emerald-600' :
            status === 'streaming' ? 'bg-blue-50 text-blue-500' :
            status === 'offline' ? 'bg-red-50 text-red-400' :
            'bg-gray-100 text-gray-400'
          }`}>
            {status === 'offline' ? <WifiOff size={11} /> : <Wifi size={11} />}
            {status === 'live' ? `${total} live` : status === 'streaming' ? `${items.length} loading…` : status}
          </span>
        </div>
        <p className="text-[13px] text-gray-500">Discover grants, jobs, and bounties.</p>
      </header>

      <div className="px-5 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search opportunities..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl border-none bg-white shadow-sm focus-visible:ring-1 focus-visible:ring-[#005F56]/20"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-bold transition-all ${
                activeTab === tab
                  ? 'bg-[#005F56] text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-[#005F56]/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-bold text-[#1A1A1A]">Career Readiness</h3>
            <p className="text-[11px] text-gray-500 mt-1">Your profile is 85% complete</p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#1B816B] h-full w-[85%] rounded-full" />
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-[#E8F5F3] text-[#005F56] flex items-center justify-center shrink-0 ml-4">
            <ChevronRight size={20} />
          </button>
        </div>

        <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-4">
          {activeTab === 'All' ? 'All Opportunities' : activeTab}
          {visible.length > 0 && <span className="ml-2 text-[13px] text-gray-400 font-medium">({visible.length})</span>}
        </h2>

        {items.length === 0 && status === 'connecting' && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {visible.length === 0 && items.length > 0 && (
          <div className="text-center py-12 text-gray-400 font-medium text-[14px]">No results for "{query || activeTab}"</div>
        )}

        <div className="space-y-4">
          {visible.map(opp => (
            <a
              key={opp.id}
              href={opp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 active:scale-[0.98] transition-all flex items-center gap-4 cursor-pointer hover:border-[#005F56]/20 block"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 shadow-inner">
                {categoryIcon(opp.type)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{opp.type}</span>
                <h3 className="text-[14px] font-bold text-[#1A1A1A] truncate">{opp.title}</h3>
                <div className="flex items-center justify-between mt-1 gap-2">
                  <span className="text-[13px] font-bold text-[#005F56] truncate">{opp.reward}</span>
                  {opp.deadline && (
                    <span className="text-[11px] font-medium text-red-400 bg-red-50 px-2 py-0.5 rounded-md shrink-0">{opp.deadline}</span>
                  )}
                  {!opp.deadline && opp.status === 'open' && (
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">Open</span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {status === 'streaming' && (
          <div className="mt-6 text-center text-[12px] text-gray-400 font-medium animate-pulse">
            Fetching more opportunities…
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}

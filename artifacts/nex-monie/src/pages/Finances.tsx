import React, { useState } from 'react'
import { Search, TrendingUp, Bell, X } from 'lucide-react'
import { BottomNav } from '@/components/layout/BottomNav'
import { useToast } from '@/hooks/use-toast'

// ── Mock market data ──────────────────────────────────────────────────────────

const CRYPTO = [
  { id:'btc', symbol:'BTC/USDT', name:'Bitcoin',   price:67842.10, change:2.34,  vol:'24.5B', spark:[40,44,41,48,46,52,54,51,56,58] },
  { id:'eth', symbol:'ETH/USDT', name:'Ethereum',  price: 3521.88, change:1.82,  vol:'12.1B', spark:[38,40,37,42,41,45,44,47,49,50] },
  { id:'sol', symbol:'SOL/USDT', name:'Solana',    price:  182.40, change:4.17,  vol:'4.8B',  spark:[30,33,31,36,35,40,43,41,46,48] },
  { id:'bnb', symbol:'BNB/USDT', name:'BNB',       price:  614.20, change:0.63,  vol:'2.1B',  spark:[44,45,43,46,44,47,46,48,47,49] },
  { id:'xrp', symbol:'XRP/USDT', name:'XRP',       price:    0.732,change:3.21,  vol:'3.4B',  spark:[28,30,29,33,32,36,38,35,40,42] },
  { id:'ada', symbol:'ADA/USDT', name:'Cardano',   price:    0.612,change:-1.44, vol:'1.2B',  spark:[50,48,47,45,46,43,44,42,40,39] },
  { id:'avax',symbol:'AVAX/USDT',name:'Avalanche', price:   39.84, change:5.92,  vol:'0.9B',  spark:[20,23,22,27,26,31,34,32,37,40] },
  { id:'dot', symbol:'DOT/USDT', name:'Polkadot',  price:    9.18, change:-0.88, vol:'0.7B',  spark:[48,46,47,44,45,43,42,44,41,40] },
  { id:'doge',symbol:'DOGE/USDT',name:'Dogecoin',  price:    0.182,change:6.14,  vol:'2.8B',  spark:[18,20,19,24,23,29,32,30,36,38] },
  { id:'link',symbol:'LINK/USDT',name:'Chainlink', price:   18.64, change:2.77,  vol:'1.1B',  spark:[35,37,36,39,38,42,41,44,43,46] },
]

const STOCKS = [
  { id:'aapl', symbol:'AAPL', name:'Apple Inc.',       price:189.30, change: 0.84, vol:'8.2B',  spark:[44,45,44,46,45,47,46,48,47,49] },
  { id:'tsla', symbol:'TSLA', name:'Tesla Inc.',       price:248.50, change:-2.31, vol:'12.4B', spark:[52,50,49,47,48,45,46,44,43,41] },
  { id:'nvda', symbol:'NVDA', name:'NVIDIA Corp.',     price:875.20, change: 3.61, vol:'18.7B', spark:[32,35,34,38,37,42,44,41,46,48] },
  { id:'googl',symbol:'GOOGL',name:'Alphabet Inc.',   price:172.80, change: 1.22, vol:'5.1B',  spark:[40,41,40,43,42,44,43,45,44,46] },
  { id:'meta', symbol:'META', name:'Meta Platforms',   price:512.40, change: 2.08, vol:'7.3B',  spark:[38,40,39,42,41,44,43,46,45,48] },
  { id:'amzn', symbol:'AMZN', name:'Amazon.com',       price:192.60, change: 0.47, vol:'6.8B',  spark:[43,44,43,45,44,46,45,47,46,48] },
  { id:'msft', symbol:'MSFT', name:'Microsoft Corp.',  price:432.10, change: 1.74, vol:'9.2B',  spark:[41,42,41,44,43,45,44,46,45,47] },
  { id:'nflx', symbol:'NFLX', name:'Netflix Inc.',     price:680.30, change:-0.92, vol:'2.1B',  spark:[49,47,48,46,47,44,45,43,44,42] },
]

const ETFS = [
  { id:'spy',  symbol:'SPY',  name:'S&P 500 ETF',         price:522.80, change: 0.61, vol:'18.4B', spark:[42,43,42,44,43,45,44,46,45,47] },
  { id:'qqq',  symbol:'QQQ',  name:'Nasdaq-100 ETF',       price:448.20, change: 0.98, vol:'11.2B', spark:[40,41,40,43,42,44,43,46,45,47] },
  { id:'vti',  symbol:'VTI',  name:'Total Market ETF',     price:254.60, change: 0.53, vol:'4.8B',  spark:[43,44,43,45,44,46,45,47,46,48] },
  { id:'gld',  symbol:'GLD',  name:'Gold ETF',             price:218.90, change: 1.24, vol:'2.1B',  spark:[38,39,40,41,42,43,44,45,46,47] },
  { id:'arkk', symbol:'ARKK', name:'ARK Innovation ETF',   price: 52.40, change:-1.87, vol:'0.9B',  spark:[50,48,47,45,46,43,44,42,40,39] },
  { id:'ivv',  symbol:'IVV',  name:'iShares Core S&P 500', price:521.30, change: 0.58, vol:'5.3B',  spark:[42,43,42,44,43,45,44,46,45,47] },
]

const PAIRS = [
  { id:'eurusd', symbol:'EUR/USD', name:'Euro / US Dollar',     price:1.0842, change: 0.12, vol:'—', spark:[44,45,44,46,45,47,46,48,47,49] },
  { id:'gbpusd', symbol:'GBP/USD', name:'Pound / US Dollar',    price:1.2718, change:-0.08, vol:'—', spark:[49,48,49,47,48,46,47,45,46,44] },
  { id:'usdjpy', symbol:'USD/JPY', name:'US Dollar / Yen',      price:153.84, change: 0.31, vol:'—', spark:[40,41,42,43,44,45,46,47,48,49] },
  { id:'btceth', symbol:'BTC/ETH', name:'Bitcoin / Ethereum',   price: 19.26, change: 0.49, vol:'—', spark:[42,43,42,44,43,45,44,46,45,47] },
  { id:'ethbtc', symbol:'ETH/BTC', name:'Ethereum / Bitcoin',   price:  0.052,change:-0.54, vol:'—', spark:[48,47,48,46,47,45,46,44,45,43] },
  { id:'eurgbp', symbol:'EUR/GBP', name:'Euro / Pound',         price:  0.852,change: 0.07, vol:'—', spark:[43,44,43,45,44,46,45,47,46,48] },
]

// ── Sparkline SVG ─────────────────────────────────────────────────────────────

function Spark({ points, up }: { points: number[], up: boolean }) {
  const min = Math.min(...points), max = Math.max(...points)
  const range = max - min || 1
  const w = 64, h = 28
  const pts = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={up ? '#10b981' : '#ef4444'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Market detail sheet ───────────────────────────────────────────────────────

function MarketDetailSheet({ item, onClose }: { item: typeof CRYPTO[0] | null; onClose: () => void }) {
  if (!item) return null
  const up = item.change >= 0
  const priceStr = item.price >= 1000
    ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : item.price >= 1 ? item.price.toFixed(2) : item.price.toFixed(4)

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[22px] font-black text-[#1A1A1A]">{item.symbol}</h3>
            <p className="text-[13px] text-gray-400 font-medium">{item.name}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-90">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex items-end gap-3 mb-6">
          <span className="text-[36px] font-black text-[#1A1A1A] leading-none">{priceStr}</span>
          <span className={`text-[15px] font-bold mb-1 px-2 py-0.5 rounded-lg ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            {up ? '+' : ''}{item.change.toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">24h Volume</p>
            <p className="text-[14px] font-bold text-[#1A1A1A]">{item.vol}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Trend (7d)</p>
            <p className={`text-[14px] font-bold ${up ? 'text-emerald-600' : 'text-red-500'}`}>{up ? '↑ Bullish' : '↓ Bearish'}</p>
          </div>
        </div>

        <button
          className="w-full py-4 bg-[#005F56] text-white font-bold rounded-2xl active:scale-95 transition-transform shadow-lg shadow-[#005F56]/20"
          onClick={onClose}
        >
          Coming Soon — Trade {item.symbol.split('/')[0]}
        </button>
      </div>
    </div>
  )
}

// ── Market row ────────────────────────────────────────────────────────────────

function MarketRow({ item, onClick }: { item: typeof CRYPTO[0]; onClick: () => void }) {
  const up = item.change >= 0
  const priceStr = item.price >= 1000
    ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : item.price >= 1
    ? item.price.toFixed(2)
    : item.price.toFixed(4)

  return (
    <div onClick={onClick} className="flex items-center py-3.5 border-b border-gray-50 gap-3 active:bg-gray-50/80 transition-colors cursor-pointer">
      {/* Icon */}
      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 font-black text-[11px] text-gray-600">
        {item.symbol.split('/')[0].slice(0, 3)}
      </div>
      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#1A1A1A] leading-tight">{item.symbol}</p>
        <p className="text-[11px] text-gray-400 font-medium truncate">{item.name}</p>
      </div>
      {/* Spark */}
      <div className="shrink-0">
        <Spark points={item.spark} up={up} />
      </div>
      {/* Price + change */}
      <div className="text-right shrink-0 min-w-[72px]">
        <p className="text-[13px] font-bold text-[#1A1A1A]">{priceStr}</p>
        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
          {up ? '+' : ''}{item.change.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────


const TABS = [
  { key: 'crypto', label: 'Crypto',  data: CRYPTO },
  { key: 'stocks', label: 'Stocks',  data: STOCKS },
  { key: 'etfs',   label: 'ETFs',    data: ETFS },
  { key: 'pairs',  label: 'Pairs',   data: PAIRS },
] as const

type TabKey = typeof TABS[number]['key']

// ── Screen ────────────────────────────────────────────────────────────────────

export default function Finances() {
  const [tab, setTab] = useState<TabKey>('crypto')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'default' | 'change'>('default')
  const [selected, setSelected] = useState<typeof CRYPTO[0] | null>(null)

  const current = TABS.find(t => t.key === tab)!
  let rows = [...current.data] as typeof CRYPTO

  if (query) {
    rows = rows.filter(r =>
      r.symbol.toLowerCase().includes(query.toLowerCase()) ||
      r.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  if (sortBy === 'change') {
    rows = [...rows].sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
  }

  const gainers = [...CRYPTO].sort((a, b) => b.change - a.change).slice(0, 3)

  return (
    <main className="min-h-screen pb-28 bg-[#F8FAF9]">
      {/* Header */}
      <header className="px-5 pt-8 pb-4 bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[22px] font-bold text-[#1A1A1A]">Markets</h1>
          <button className="p-2 rounded-full bg-gray-50 active:scale-90 transition-all">
            <Bell size={20} className="text-[#1A1A1A]" />
          </button>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${current.label.toLowerCase()}…`}
            className="w-full pl-10 pr-4 h-11 rounded-2xl bg-gray-50 text-[13px] font-medium text-[#1A1A1A] placeholder:text-gray-400 border-none outline-none"
          />
        </div>
      </header>

      {/* Top Gainers (crypto tab only) */}
      {tab === 'crypto' && !query && (
        <div className="px-5 pt-5 mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold text-[#1A1A1A] flex items-center gap-1.5">
              <TrendingUp size={15} className="text-emerald-500" /> Top Gainers
            </span>
            <span className="text-[11px] font-bold text-gray-400">24h</span>
          </div>
          <div className="flex gap-3">
            {gainers.map(g => (
              <div key={g.id} className="flex-1 bg-white rounded-[18px] p-3 shadow-sm border border-gray-50 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-50 mx-auto mb-2 flex items-center justify-center text-[9px] font-black text-emerald-600">
                  {g.symbol.split('/')[0].slice(0, 3)}
                </div>
                <p className="text-[11px] font-bold text-[#1A1A1A]">{g.symbol.split('/')[0]}</p>
                <p className="text-[11px] font-bold text-emerald-500 mt-0.5">+{g.change.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-5 mt-5 mb-1 flex gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setQuery('') }}
            className={`flex-1 py-2 rounded-full text-[12px] font-bold transition-all ${
              tab === t.key
                ? 'bg-[#005F56] text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sort bar */}
      <div className="px-5 mt-3 mb-1 flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          {rows.length} {current.label}
        </span>
        <button
          onClick={() => setSortBy(s => s === 'default' ? 'change' : 'default')}
          className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${sortBy === 'change' ? 'text-[#005F56]' : 'text-gray-400'}`}
        >
          Sort: {sortBy === 'change' ? '% Change' : 'Default'}
        </button>
      </div>

      {/* Market list */}
      <div className="px-5">
        {rows.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-[14px] font-medium">No results for "{query}"</div>
        )}
        {rows.map(item => (
          <MarketRow key={item.id} item={item as any} onClick={() => setSelected(item as any)} />
        ))}
      </div>

      <BottomNav />
      <MarketDetailSheet item={selected} onClose={() => setSelected(null)} />
    </main>
  )
}

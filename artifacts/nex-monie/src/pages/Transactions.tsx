import React, { useState, useMemo } from 'react'
import { ChevronLeft, Search, Filter, Calendar, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useGetTransactions } from '@workspace/api-client-react'
import { Link } from 'wouter'
import { format, isToday, isYesterday } from 'date-fns'

export default function Transactions() {
  const [search, setSearch] = useState('')
  const { data: transactions, isLoading } = useGetTransactions({ limit: 50 })

  const filtered = useMemo(() => {
    if (!transactions) return []
    return transactions.filter(tx => 
      tx.title.toLowerCase().includes(search.toLowerCase()) || 
      tx.category.toLowerCase().includes(search.toLowerCase())
    )
  }, [transactions, search])

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {}
    filtered.forEach(tx => {
      const date = new Date(tx.timestamp)
      let key = 'Earlier'
      if (isToday(date)) key = 'Today'
      else if (isYesterday(date)) key = 'Yesterday'
      else key = format(date, 'MMMM d, yyyy')
      
      if (!groups[key]) groups[key] = []
      groups[key].push(tx)
    })
    return groups
  }, [filtered])

  return (
    <main className="min-h-screen bg-[#F8FAF9] pb-24">
      <header className="px-5 pt-8 pb-4 bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center mb-6">
          <Link href="/">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1A1A1A] border border-gray-100 active:scale-95">
              <ChevronLeft size={22} />
            </div>
          </Link>
          <div className="flex-1 text-center pr-10">
            <h1 className="text-[18px] font-bold text-[#1A1A1A]">History</h1>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search transactions..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11 h-12 rounded-2xl border-none bg-gray-50 focus-visible:ring-1 focus-visible:ring-[#005F56]/20 shadow-inner" 
          />
        </div>
      </header>

      <div className="px-5 py-6 space-y-8">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm font-bold animate-pulse">Loading ledger...</div>
        ) : Object.keys(grouped).length === 0 ? (
           <div className="text-center py-20">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Calendar size={24} className="text-gray-400" />
             </div>
             <p className="text-gray-500 font-bold">No transactions found</p>
           </div>
        ) : (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date}>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{date}</h3>
              <div className="space-y-3">
                {txs.map(tx => (
                  <Card key={tx.id} className="p-4 border-none shadow-sm rounded-[20px] flex items-center justify-between active:scale-[0.98] transition-transform">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-600'}`}>
                         {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#1A1A1A] line-clamp-1">{tx.title}</h4>
                        <p className="text-[11px] text-gray-400 font-medium">{format(new Date(tx.timestamp), 'h:mm a')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[15px] font-bold ${tx.type === 'credit' ? 'text-emerald-500' : 'text-[#1A1A1A]'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{tx.category}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

import React from 'react'
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useGetTransactionSummary } from '@workspace/api-client-react'

export function GrowthSnapshot() {
  const { data: summary, isLoading } = useGetTransactionSummary()

  if (isLoading) {
    return <div className="px-5 mb-10 h-32 animate-pulse bg-gray-100 rounded-[28px]" />
  }

  const inflow = summary?.totalInflow || 0;
  const outflow = summary?.totalOutflow || 0;
  const netGrowth = summary?.netGrowth || 0;
  const inChange = summary?.inflowChange || 0;
  const outChange = summary?.outflowChange || 0;

  return (
    <div className="px-5 mb-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight">Growth Snapshot</h2>
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">This Month</span>
      </div>

      <Card className="p-6 border-none shadow-soft rounded-[28px] bg-white">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <ArrowDownRight size={12} strokeWidth={3} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inflow</span>
            </div>
            <p className="text-[16px] font-bold text-[#1A1A1A] tracking-tight">₦{inflow.toLocaleString()}</p>
            <p className={`text-[10px] font-bold mt-1 flex items-center gap-0.5 ${inChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {inChange >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {inChange >= 0 ? '+' : ''}{inChange}%
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-rose-50 text-red-500 flex items-center justify-center">
                <ArrowUpRight size={12} strokeWidth={3} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Outflow</span>
            </div>
            <p className="text-[16px] font-bold text-[#1A1A1A] tracking-tight">₦{outflow.toLocaleString()}</p>
            <p className={`text-[10px] font-bold mt-1 flex items-center gap-0.5 ${outChange <= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {outChange <= 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />} {outChange > 0 ? '+' : ''}{outChange}%
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#1A1A1A]">Net Growth</span>
          <span className={`text-[14px] font-bold ${netGrowth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {netGrowth >= 0 ? '+' : '-'}₦{Math.abs(netGrowth).toLocaleString()}
          </span>
        </div>
      </Card>
    </div>
  )
}

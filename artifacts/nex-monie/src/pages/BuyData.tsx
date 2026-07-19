import React, { useState } from 'react'
import { ChevronLeft, Zap, Smartphone, CheckCircle2, Wifi } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Link } from 'wouter'
import { useGetNetworks, useGetDataPlans, usePurchaseData } from '@workspace/api-client-react'
import { useToast } from '@/hooks/use-toast'
import { getGetDataPlansQueryKey } from '@workspace/api-client-react'

export default function BuyData() {
  const [stage, setStage] = useState(1)
  const [phone, setPhone] = useState('')
  const [network, setNetwork] = useState('')
  const [plan, setPlan] = useState<any>(null)
  
  const { data: networks, isLoading: netsLoading } = useGetNetworks()
  const { data: plans, isLoading: plansLoading } = useGetDataPlans({ network }, { query: { enabled: !!network, queryKey: getGetDataPlansQueryKey({ network }) } })
  const purchase = usePurchaseData()
  const { toast } = useToast()

  const handleContinue = () => {
    if (!phone || !network || !plan) {
      toast({ description: "Please fill all details" })
      return
    }
    setStage(2)
  }

  const handlePay = () => {
    purchase.mutate({ data: { networkId: network, phoneNumber: phone, planId: plan.id } }, {
      onSuccess: () => setStage(3),
      onError: () => toast({ description: "Purchase failed", variant: "destructive" })
    })
  }

  if (stage === 1) return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <header className="px-5 pt-8 pb-4 bg-white sticky top-0 shadow-sm flex items-center mb-6 z-10">
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-[18px] font-bold">Buy Data</h1>
        </div>
      </header>

      <div className="px-5 space-y-6 pb-32">
        <div>
           <h3 className="text-[13px] font-bold mb-3">Phone Number</h3>
           <div className="relative">
             <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <Input 
               placeholder="080..." 
               value={phone} 
               onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
               className="pl-11 h-14 bg-white border-none shadow-sm rounded-2xl" 
               maxLength={11}
             />
           </div>
        </div>

        <div>
           <h3 className="text-[13px] font-bold mb-3">Select Network</h3>
           <div className="grid grid-cols-4 gap-2">
             {netsLoading ? <div className="col-span-4 text-center py-4 text-sm font-bold text-gray-400">Loading...</div> : networks?.map(n => (
               <button 
                 key={n.id} 
                 onClick={() => { setNetwork(n.id); setPlan(null); }}
                 className={`h-12 rounded-xl text-[12px] font-bold border transition-all ${network === n.id ? 'bg-[#005F56] text-white border-[#005F56]' : 'bg-white border-gray-100'}`}
               >
                 {n.name}
               </button>
             ))}
           </div>
        </div>

        {network && (
          <div>
             <h3 className="text-[13px] font-bold mb-3">Select Plan</h3>
             {plansLoading ? <div className="text-center py-4 text-sm font-bold text-gray-400">Loading plans...</div> : (
               <div className="space-y-3">
                 {plans?.map(p => (
                   <div 
                     key={p.id} 
                     onClick={() => setPlan(p)}
                     className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] ${plan?.id === p.id ? 'bg-[#005F56]/5 border-[#005F56] shadow-sm' : 'bg-white border-gray-50'}`}
                   >
                     <div>
                       <h4 className={`text-[14px] font-bold mb-1 ${plan?.id === p.id ? 'text-[#005F56]' : 'text-[#1A1A1A]'}`}>{p.title}</h4>
                       <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{p.validity}</p>
                     </div>
                     <span className={`text-[15px] font-bold ${plan?.id === p.id ? 'text-[#005F56]' : 'text-[#1A1A1A]'}`}>₦{p.price}</span>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 bg-white border-t border-gray-100 z-20">
        <button onClick={handleContinue} className="w-full h-14 bg-[#005F56] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98]">
          Continue
        </button>
      </div>
    </main>
  )

  if (stage === 2) return (
    <main className="min-h-screen bg-[#F8FAF9] flex flex-col">
       <header className="px-5 pt-8 pb-4 bg-white flex items-center shadow-sm">
        <button onClick={() => setStage(1)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-[18px] font-bold">Review</h1>
        </div>
      </header>

      <div className="p-5 flex-1 flex flex-col">
         <div className="text-center py-8">
           <div className="w-16 h-16 bg-[#005F56]/10 text-[#005F56] rounded-2xl mx-auto flex items-center justify-center mb-4">
             <Wifi size={28} />
           </div>
           <h2 className="text-[32px] font-black tracking-tight">₦{plan?.price.toLocaleString()}</h2>
           <p className="text-gray-500 font-bold uppercase text-[11px] tracking-wider">{networks?.find(n => n.id === network)?.name} Data</p>
         </div>

         <Card className="p-5 rounded-2xl border-none shadow-sm space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Number</span>
               <span className="text-[14px] font-bold">{phone}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Plan</span>
               <span className="text-[14px] font-bold">{plan?.title}</span>
            </div>
         </Card>

         <div className="mt-auto pb-6">
           <button onClick={handlePay} disabled={purchase.isPending} className="w-full h-14 bg-[#005F56] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] disabled:opacity-70">
             {purchase.isPending ? 'Processing...' : 'Confirm & Pay'}
           </button>
         </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#005F56] text-white flex flex-col items-center justify-center p-5 text-center">
       <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
         <CheckCircle2 size={48} />
       </div>
       <h1 className="text-[28px] font-bold mb-2">Success!</h1>
       <p className="text-[15px] opacity-80 mb-10">Data purchased successfully for {phone}</p>
       
       <Link href="/" className="w-full max-w-[300px] h-14 bg-white text-[#005F56] font-bold rounded-2xl flex items-center justify-center shadow-xl active:scale-[0.98]">
         Done
       </Link>
    </main>
  )
}

import React, { useState } from 'react'
import { ChevronLeft, Zap, Smartphone, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Link } from 'wouter'
import { useGetNetworks, usePurchaseAirtime } from '@workspace/api-client-react'
import { useToast } from '@/hooks/use-toast'

const AMOUNTS = [100, 200, 500, 1000, 2000, 5000]

export default function BuyAirtime() {
  const [stage, setStage] = useState(1)
  const [phone, setPhone] = useState('')
  const [network, setNetwork] = useState('')
  const [amount, setAmount] = useState('')
  
  const { data: networks, isLoading: netsLoading } = useGetNetworks()
  const purchase = usePurchaseAirtime()
  const { toast } = useToast()

  const handleContinue = () => {
    if (!phone || !network || !amount) {
      toast({ description: "Please fill all details" })
      return
    }
    setStage(2)
  }

  const handlePay = () => {
    purchase.mutate({ data: { networkId: network, phoneNumber: phone, amount: Number(amount) } }, {
      onSuccess: () => setStage(3),
      onError: () => toast({ description: "Purchase failed", variant: "destructive" })
    })
  }

  if (stage === 1) return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <header className="px-5 pt-8 pb-4 bg-white sticky top-0 shadow-sm flex items-center mb-6">
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-[18px] font-bold">Buy Airtime</h1>
        </div>
      </header>

      <div className="px-5 space-y-6">
        <div>
           <h3 className="text-[13px] font-bold mb-3">Select Network</h3>
           <div className="grid grid-cols-4 gap-2">
             {netsLoading ? <div className="col-span-4 text-center py-4">Loading...</div> : networks?.map(n => (
               <button 
                 key={n.id} 
                 onClick={() => setNetwork(n.id)}
                 className={`h-12 rounded-xl text-[12px] font-bold border transition-all ${network === n.id ? 'bg-[#005F56] text-white border-[#005F56]' : 'bg-white border-gray-100'}`}
               >
                 {n.name}
               </button>
             ))}
           </div>
        </div>

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
           <h3 className="text-[13px] font-bold mb-3">Amount</h3>
           <div className="grid grid-cols-3 gap-2 mb-4">
             {AMOUNTS.map(amt => (
               <button 
                 key={amt} 
                 onClick={() => setAmount(amt.toString())}
                 className={`h-12 rounded-xl text-[13px] font-bold border transition-all ${amount === amt.toString() ? 'bg-[#005F56] text-white border-[#005F56]' : 'bg-white border-gray-100'}`}
               >
                 ₦{amt}
               </button>
             ))}
           </div>
           <Input 
             placeholder="Custom Amount" 
             value={amount} 
             onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
             className="h-14 bg-white border-none shadow-sm rounded-2xl font-bold text-[16px]" 
           />
        </div>

        <button onClick={handleContinue} className="w-full h-14 bg-[#005F56] text-white font-bold rounded-2xl shadow-lg mt-8 active:scale-[0.98]">
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
             <Zap size={28} />
           </div>
           <h2 className="text-[32px] font-black tracking-tight">₦{Number(amount).toLocaleString()}</h2>
           <p className="text-gray-500 font-bold uppercase text-[11px] tracking-wider">{networks?.find(n => n.id === network)?.name} Airtime</p>
         </div>

         <Card className="p-5 rounded-2xl border-none shadow-sm space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Number</span>
               <span className="text-[14px] font-bold">{phone}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Fee</span>
               <span className="text-[14px] font-bold text-emerald-500">Free</span>
            </div>
         </Card>

         <div className="mt-auto">
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
       <p className="text-[15px] opacity-80 mb-10">You've successfully purchased ₦{amount} airtime for {phone}</p>
       
       <Link href="/" className="w-full max-w-[300px] h-14 bg-white text-[#005F56] font-bold rounded-2xl flex items-center justify-center shadow-xl active:scale-[0.98]">
         Done
       </Link>
    </main>
  )
}

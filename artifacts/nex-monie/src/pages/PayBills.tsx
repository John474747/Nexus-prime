import React, { useState } from 'react'
import { ChevronLeft, Zap, Tv, Globe, Target, GraduationCap, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Link } from 'wouter'
import { useGetBillCategories, useGetBillProviders, useGetBillPackages, useValidateBill, usePayBill } from '@workspace/api-client-react'
import { useToast } from '@/hooks/use-toast'
import { getGetBillProvidersQueryKey, getGetBillPackagesQueryKey } from '@workspace/api-client-react'

export default function PayBills() {
  const [stage, setStage] = useState(1)
  const [cat, setCat] = useState('')
  const [provider, setProvider] = useState('')
  const [pkg, setPkg] = useState<any>(null)
  const [ref, setRef] = useState('')
  const [amount, setAmount] = useState('')
  const [customerName, setCustomerName] = useState('')

  const { data: categories } = useGetBillCategories()
  const { data: providers } = useGetBillProviders({ category: cat }, { query: { enabled: !!cat, queryKey: getGetBillProvidersQueryKey({ category: cat }) } })
  const { data: packages } = useGetBillPackages({ provider }, { query: { enabled: !!provider && cat !== 'electricity', queryKey: getGetBillPackagesQueryKey({ provider }) } })
  
  const validate = useValidateBill()
  const pay = usePayBill()
  const { toast } = useToast()

  const ICON_MAP: Record<string, React.ReactNode> = {
    Zap: <Zap size={24} />,
    Tv: <Tv size={24} />,
    Wifi: <Globe size={24} />,
    Target: <Target size={24} />,
    GraduationCap: <GraduationCap size={24} />,
  }

  const getIcon = (iconName: string) => ICON_MAP[iconName] ?? <Zap size={24} />

  const handleValidate = () => {
    if (!provider || !ref || (!pkg && cat !== 'electricity') || (cat === 'electricity' && !amount)) {
      toast({ description: "Please fill all details" })
      return
    }

    validate.mutate({ data: { providerId: provider, customerRef: ref } }, {
      onSuccess: (data) => {
        if (data.valid) {
          setCustomerName(data.customerName)
          setStage(2)
        } else {
          toast({ description: "Invalid meter/customer number", variant: "destructive" })
        }
      },
      onError: () => toast({ description: "Failed to validate customer", variant: "destructive" })
    })
  }

  const handlePay = () => {
    pay.mutate({ 
      data: { 
        providerId: provider, 
        customerRef: ref, 
        packageId: pkg?.id,
        amount: pkg ? pkg.amount : Number(amount)
      } 
    }, {
      onSuccess: () => setStage(3),
      onError: () => toast({ description: "Payment failed", variant: "destructive" })
    })
  }

  if (stage === 1) return (
    <main className="min-h-screen bg-[#F8FAF9] pb-32">
      <header className="px-5 pt-8 pb-4 bg-white sticky top-0 shadow-sm z-20 flex items-center mb-6">
        <button onClick={() => cat ? setCat('') : window.history.back()} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-[18px] font-bold">Pay Bills</h1>
        </div>
      </header>

      {!cat ? (
        <div className="px-5 grid grid-cols-2 gap-4">
          {categories?.map(c => (
            <Card key={c.id} onClick={() => setCat(c.id)} className="p-6 border-none shadow-sm rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform cursor-pointer">
              <div className="w-14 h-14 bg-[#005F56]/5 text-[#005F56] rounded-full flex items-center justify-center">
                {getIcon(c.icon)}
              </div>
              <span className="text-[13px] font-bold text-center">{c.name}</span>
            </Card>
          ))}
        </div>
      ) : (
        <div className="px-5 space-y-6">
          <div>
             <h3 className="text-[13px] font-bold mb-3 uppercase tracking-wider text-gray-400">Select Provider</h3>
             <div className="grid grid-cols-2 gap-3">
               {providers?.map(p => (
                 <button 
                   key={p.id} 
                   onClick={() => { setProvider(p.id); setPkg(null); }}
                   className={`h-14 rounded-2xl text-[13px] font-bold border transition-all ${provider === p.id ? 'bg-[#005F56] text-white border-[#005F56]' : 'bg-white border-gray-100'}`}
                 >
                   {p.name}
                 </button>
               ))}
             </div>
          </div>

          {provider && cat !== 'electricity' && (
            <div>
               <h3 className="text-[13px] font-bold mb-3 uppercase tracking-wider text-gray-400">Package</h3>
               <div className="space-y-2">
                 {packages?.map(p => (
                   <div 
                     key={p.id} 
                     onClick={() => setPkg(p)}
                     className={`p-4 rounded-xl border transition-all flex justify-between items-center cursor-pointer active:scale-95 ${pkg?.id === p.id ? 'bg-[#005F56]/10 border-[#005F56] shadow-sm' : 'bg-white border-gray-50'}`}
                   >
                     <span className={`text-[13px] font-bold ${pkg?.id === p.id ? 'text-[#005F56]' : ''}`}>{p.name}</span>
                     <span className="font-black text-[14px]">₦{p.amount.toLocaleString()}</span>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {provider && (
            <div className="space-y-4">
              <div>
                 <h3 className="text-[13px] font-bold mb-3 uppercase tracking-wider text-gray-400">Customer Number / Meter No.</h3>
                 <Input 
                   placeholder="Enter number..." 
                   value={ref} 
                   onChange={e => setRef(e.target.value)}
                   className="h-14 bg-white border-none shadow-sm rounded-xl font-bold" 
                 />
              </div>

              {cat === 'electricity' && (
                <div>
                  <h3 className="text-[13px] font-bold mb-3 uppercase tracking-wider text-gray-400">Amount</h3>
                  <Input 
                    placeholder="0.00" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
                    className="h-14 bg-white border-none shadow-sm rounded-xl font-black text-[18px]" 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {provider && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 bg-white border-t border-gray-100 z-20">
          <button onClick={handleValidate} disabled={validate.isPending} className="w-full h-14 bg-[#005F56] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98]">
            {validate.isPending ? 'Verifying...' : 'Continue'}
          </button>
        </div>
      )}
    </main>
  )

  if (stage === 2) return (
    <main className="min-h-screen bg-[#F8FAF9] flex flex-col">
       <header className="px-5 pt-8 pb-4 bg-white flex items-center shadow-sm">
        <button onClick={() => setStage(1)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-[18px] font-bold">Review Payment</h1>
        </div>
      </header>

      <div className="p-5 flex-1 flex flex-col">
         <div className="text-center py-8">
           <h2 className="text-[32px] font-black tracking-tight mb-2">₦{(pkg?.amount || Number(amount)).toLocaleString()}</h2>
           <p className="text-[#005F56] font-bold bg-[#005F56]/10 px-3 py-1 rounded-full inline-block">{customerName}</p>
         </div>

         <Card className="p-5 rounded-2xl border-none shadow-sm space-y-5 bg-white">
            <div className="flex justify-between items-center">
               <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Provider</span>
               <span className="text-[14px] font-bold">{providers?.find(p => p.id === provider)?.name}</span>
            </div>
            {pkg && (
              <div className="flex justify-between items-center">
                 <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Package</span>
                 <span className="text-[14px] font-bold">{pkg.name}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
               <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Ref No</span>
               <span className="text-[14px] font-bold">{ref}</span>
            </div>
            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
               <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Fee</span>
               <span className="text-[14px] font-bold text-emerald-500">₦100</span>
            </div>
         </Card>

         <div className="mt-auto pb-6">
           <button onClick={handlePay} disabled={pay.isPending} className="w-full h-14 bg-[#005F56] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] disabled:opacity-70">
             {pay.isPending ? 'Processing...' : `Pay ₦${((pkg?.amount || Number(amount)) + 100).toLocaleString()}`}
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
       <p className="text-[15px] opacity-80 mb-10">Bill paid successfully for {customerName}</p>
       
       <Link href="/" className="w-full max-w-[300px] h-14 bg-white text-[#005F56] font-bold rounded-2xl flex items-center justify-center shadow-xl active:scale-[0.98]">
         Done
       </Link>
    </main>
  )
}

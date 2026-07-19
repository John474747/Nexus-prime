import React, { useState } from 'react'
import { ChevronLeft, QrCode, ScanLine, X, CheckCircle2 } from 'lucide-react'
import { Link } from 'wouter'
import { useDecodeQr, useScanPay } from '@workspace/api-client-react'
import { useToast } from '@/hooks/use-toast'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function ScanPay() {
  const [stage, setStage] = useState(1)
  const [qrData, setQrData] = useState('')
  const [decoded, setDecoded] = useState<any>(null)
  const [amount, setAmount] = useState('')
  
  const decode = useDecodeQr()
  const pay = useScanPay()
  const { toast } = useToast()

  const simulateScan = () => {
    // Fake QR data simulation since we don't have camera access here
    const mockData = "nexmonie://pay/mock123"
    setQrData(mockData)
    
    decode.mutate({ data: { data: mockData } }, {
      onSuccess: (res) => {
        setDecoded(res)
        if (res.amount) setAmount(res.amount.toString())
        setStage(2)
      },
      onError: () => toast({ description: "Invalid QR code", variant: "destructive" })
    })
  }

  const handlePay = () => {
    pay.mutate({ data: { qrData, amount: Number(amount) } }, {
      onSuccess: () => setStage(3),
      onError: () => toast({ description: "Payment failed", variant: "destructive" })
    })
  }

  if (stage === 1) return (
    <main className="min-h-screen bg-black flex flex-col">
      <header className="px-5 pt-12 pb-4 flex items-center justify-between text-white z-20">
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md active:scale-95">
          <X size={20} />
        </button>
        <span className="font-bold tracking-widest text-[13px] uppercase">Scan & Pay</span>
        <div className="w-10" />
      </header>

      <div className="flex-1 relative flex flex-col items-center justify-center px-8">
        <p className="text-white/60 mb-8 font-medium">Position the QR code within the frame</p>
        
        {/* Mock Viewfinder */}
        <div className="relative w-64 h-64 border-2 border-white/20 rounded-[32px] overflow-hidden">
           <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#005F56] rounded-tl-[32px]" />
           <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#005F56] rounded-tr-[32px]" />
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#005F56] rounded-bl-[32px]" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#005F56] rounded-br-[32px]" />
           <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#005F56] shadow-[0_0_8px_#005F56] animate-pulse" />
        </div>

        <button onClick={simulateScan} disabled={decode.isPending} className="mt-12 w-16 h-16 bg-[#005F56] rounded-full flex items-center justify-center text-white shadow-[0_0_30px_#005F56] active:scale-90 transition-all">
          <ScanLine size={24} />
        </button>
        <p className="mt-4 text-[12px] font-bold text-white/50 uppercase tracking-widest">Tap to Demo Scan</p>
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
          <h1 className="text-[18px] font-bold">Review Payment</h1>
        </div>
      </header>

      <div className="p-5 flex-1 flex flex-col">
         <div className="text-center py-8">
           <div className="w-16 h-16 bg-[#005F56]/10 text-[#005F56] rounded-2xl mx-auto flex items-center justify-center mb-4">
             <QrCode size={28} />
           </div>
           <p className="text-[14px] text-gray-500 font-bold mb-1">Paying to</p>
           <h2 className="text-[24px] font-black tracking-tight">{decoded?.recipientName}</h2>
         </div>

         {!decoded?.amount ? (
           <div className="mb-8">
             <h3 className="text-[13px] font-bold mb-3 uppercase tracking-wider text-gray-400">Enter Amount</h3>
             <Input 
               placeholder="0.00" 
               value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
               className="h-16 bg-white border-none shadow-sm rounded-2xl font-black text-[24px] text-center" 
             />
           </div>
         ) : (
           <div className="text-center mb-8">
             <p className="text-[40px] font-black text-[#1A1A1A]">₦{Number(amount).toLocaleString()}</p>
           </div>
         )}

         <div className="mt-auto pb-6">
           <button onClick={handlePay} disabled={pay.isPending || !amount} className="w-full h-14 bg-[#005F56] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] disabled:opacity-70">
             {pay.isPending ? 'Processing...' : `Pay ₦${Number(amount).toLocaleString()}`}
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
       <h1 className="text-[28px] font-bold mb-2">Payment Successful!</h1>
       <p className="text-[15px] opacity-80 mb-10">₦{Number(amount).toLocaleString()} paid to {decoded?.recipientName}</p>
       
       <Link href="/" className="w-full max-w-[300px] h-14 bg-white text-[#005F56] font-bold rounded-2xl flex items-center justify-center shadow-xl active:scale-[0.98]">
         Done
       </Link>
    </main>
  )
}

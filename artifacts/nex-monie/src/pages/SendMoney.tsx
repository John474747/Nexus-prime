import React, { useState } from 'react'
import { ChevronLeft, Search, User, CreditCard, CheckCircle2, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Link } from 'wouter'
import { useGetBanks, useResolveAccount, useSearchUsers, useSendMoney } from '@workspace/api-client-react'
import { useToast } from '@/hooks/use-toast'
import { getSearchUsersQueryKey, getResolveAccountQueryKey, getGetBanksQueryKey } from '@workspace/api-client-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SendMoney() {
  const [stage, setStage] = useState(1)
  const [type, setType] = useState<'nex'|'bank'>('nex')
  const [search, setSearch] = useState('')
  const [bank, setBank] = useState('')
  const [acc, setAcc] = useState('')
  const [recipient, setRecipient] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [narration, setNarration] = useState('')

  const { data: users } = useSearchUsers({ q: search }, { query: { enabled: search.length > 2 && type === 'nex', queryKey: getSearchUsersQueryKey({ q: search }) } })
  const { data: banks } = useGetBanks({ query: { enabled: type === 'bank', queryKey: getGetBanksQueryKey() } })
  const { data: resolved } = useResolveAccount({ accountNumber: acc, bankCode: bank }, { query: { enabled: acc.length === 10 && !!bank && type === 'bank', queryKey: getResolveAccountQueryKey({ accountNumber: acc, bankCode: bank }) } })
  
  const send = useSendMoney()
  const { toast } = useToast()

  const handleContinue = () => {
    if (type === 'nex' && !recipient) { toast({ description: "Select a user" }); return; }
    if (type === 'bank' && !resolved?.accountName) { toast({ description: "Enter valid account" }); return; }
    if (!amount) { toast({ description: "Enter amount" }); return; }
    setStage(2)
  }

  const handleSend = () => {
    send.mutate({
      data: {
        type,
        amount: Number(amount),
        narration,
        recipientId: recipient?.id,
        accountNumber: type === 'bank' ? acc : undefined,
        bankCode: type === 'bank' ? bank : undefined
      }
    }, {
      onSuccess: () => setStage(3),
      onError: () => toast({ description: "Transfer failed", variant: "destructive" })
    })
  }

  if (stage === 1) return (
    <main className="min-h-screen bg-[#F8FAF9] pb-32">
      <header className="px-5 pt-8 pb-4 bg-white sticky top-0 shadow-sm z-20 flex items-center mb-6">
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-[18px] font-bold">Send Money</h1>
        </div>
      </header>

      <div className="px-5">
        <Tabs defaultValue="nex" onValueChange={v => setType(v as any)} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-2 rounded-2xl h-14 bg-gray-100 p-1">
            <TabsTrigger value="nex" className="rounded-xl font-bold data-[state=active]:bg-[#005F56] data-[state=active]:text-white">Nex User</TabsTrigger>
            <TabsTrigger value="bank" className="rounded-xl font-bold data-[state=active]:bg-[#005F56] data-[state=active]:text-white">Bank Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nex" className="space-y-6">
            {!recipient ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Search username or tag..." 
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-11 h-14 bg-white border-none shadow-sm rounded-2xl" 
                  />
                </div>
                {users?.length ? (
                  <Card className="p-2 border-none shadow-sm rounded-2xl">
                    {users.map(u => (
                      <div key={u.id} onClick={() => setRecipient(u)} className="p-3 hover:bg-gray-50 rounded-xl flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {u.photoUrl ? <img src={u.photoUrl} className="rounded-full" /> : <User size={20} className="text-gray-400" />}
                        </div>
                        <div>
                          <p className="font-bold text-[14px]">{u.displayName}</p>
                          <p className="text-[11px] text-gray-500">@{u.username}</p>
                        </div>
                      </div>
                    ))}
                  </Card>
                ) : null}
              </div>
            ) : (
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#005F56]/10 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#005F56]/10 text-[#005F56] rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold">{recipient.displayName}</p>
                      <p className="text-[11px] text-gray-500">@{recipient.username}</p>
                    </div>
                 </div>
                 <button onClick={() => setRecipient(null)} className="text-[11px] font-bold text-[#F88F99]">Change</button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bank" className="space-y-4">
             <Select value={bank} onValueChange={setBank}>
               <SelectTrigger className="h-14 bg-white border-none shadow-sm rounded-2xl">
                 <SelectValue placeholder="Select Bank" />
               </SelectTrigger>
               <SelectContent>
                 {banks?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
               </SelectContent>
             </Select>

             <Input 
               placeholder="Account Number" 
               value={acc} onChange={e => setAcc(e.target.value.replace(/\D/g, ''))}
               maxLength={10}
               className="h-14 bg-white border-none shadow-sm rounded-2xl" 
             />

             {resolved?.accountName && (
               <div className="p-4 bg-[#E8F5F3] text-[#005F56] rounded-2xl font-bold">
                 {resolved.accountName}
               </div>
             )}
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mb-8">
           <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-400">Amount</h3>
           <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[20px]">₦</span>
             <Input 
               placeholder="0.00" 
               value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
               className="pl-10 h-16 bg-white border-none shadow-sm rounded-2xl font-black text-[24px]" 
             />
           </div>
           
           <Input 
             placeholder="What's it for? (Optional)" 
             value={narration} onChange={e => setNarration(e.target.value)}
             className="h-14 bg-white border-none shadow-sm rounded-2xl" 
           />
        </div>
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
          <h1 className="text-[18px] font-bold">Review Transfer</h1>
        </div>
      </header>

      <div className="p-5 flex-1 flex flex-col">
         <div className="text-center py-8">
           <div className="w-16 h-16 bg-[#005F56]/10 text-[#005F56] rounded-2xl mx-auto flex items-center justify-center mb-4">
             {type === 'nex' ? <User size={28} /> : <Building2 size={28} />}
           </div>
           <h2 className="text-[36px] font-black tracking-tight mb-2">₦{Number(amount).toLocaleString()}</h2>
           <p className="text-[#005F56] font-bold bg-[#005F56]/10 px-3 py-1 rounded-full inline-block">
             To {type === 'nex' ? recipient?.displayName : resolved?.accountName}
           </p>
         </div>

         <Card className="p-5 rounded-2xl border-none shadow-sm space-y-5 bg-white">
            {type === 'bank' && (
              <>
                <div className="flex justify-between items-center">
                   <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Bank</span>
                   <span className="text-[14px] font-bold">{banks?.find(b => b.id === bank)?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Account</span>
                   <span className="text-[14px] font-bold">{acc}</span>
                </div>
              </>
            )}
            {narration && (
              <div className="flex justify-between items-center">
                 <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Note</span>
                 <span className="text-[14px] font-bold">{narration}</span>
              </div>
            )}
            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
               <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Fee</span>
               <span className="text-[14px] font-bold text-emerald-500">{type === 'nex' ? 'Free' : '₦10'}</span>
            </div>
         </Card>

         <div className="mt-auto pb-6">
           <button onClick={handleSend} disabled={send.isPending} className="w-full h-14 bg-[#005F56] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] disabled:opacity-70">
             {send.isPending ? 'Processing...' : 'Send Money'}
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
       <h1 className="text-[28px] font-bold mb-2">Transfer Successful!</h1>
       <p className="text-[15px] opacity-80 mb-10">₦{Number(amount).toLocaleString()} sent to {type === 'nex' ? recipient?.displayName : resolved?.accountName}</p>
       
       <Link href="/" className="w-full max-w-[300px] h-14 bg-white text-[#005F56] font-bold rounded-2xl flex items-center justify-center shadow-xl active:scale-[0.98]">
         Done
       </Link>
    </main>
  )
}

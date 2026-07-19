import React from 'react'
import { Sparkles } from 'lucide-react'

export function NexTipsBanner() {
  return (
    <div className="px-5 mb-12">
      <div className="bg-[#E8F5F3] border border-[#005F56]/10 rounded-[24px] p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#005F56] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
          <Sparkles size={18} />
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-[#005F56] mb-1">Nex AI Tip</h4>
          <p className="text-[12px] text-[#005F56]/80 font-medium leading-snug">
            You spent 15% less on dining this week. Move the extra ₦15,000 to your 18% savings vault?
          </p>
          <button className="mt-3 text-[11px] font-bold text-white bg-[#005F56] px-3 py-1.5 rounded-full active:scale-95 transition-all shadow-sm">
            Save ₦15,000 Now
          </button>
        </div>
      </div>
    </div>
  )
}

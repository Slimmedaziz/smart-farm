import React from 'react'
export default function FieldCard({ field, onAction }){
  const moist = Math.round(field.lastHumidity ?? 0)
  const status = moist > 45 ? 'Good' : (moist > 25 ? 'Dry' : 'Very dry')
  return (
    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">Field</div>
          <div className="font-semibold text-lg">{field.name}</div>
          <div className="text-xs text-gray-400">{field.crop}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Moisture</div>
          <div className="font-bold text-xl">{moist}%</div>
          <div className="text-xs mt-1">{status}</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={()=>onAction('view', field)} className="px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm">View</button>
        <button onClick={()=>onAction('irrigate', field)} className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm">Irrigate</button>
      </div>
    </div>
  )
}

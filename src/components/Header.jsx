import React from 'react'
import { LogOut } from 'lucide-react'

export default function Header({ user='Farmer', onLogout }){
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-md flex items-center justify-center text-white font-bold">SF</div>
        <div>
          <div className="text-sm text-gray-500">Welcome back</div>
          <div className="font-semibold">{user}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 border border-gray-200 shadow-sm">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  )
}

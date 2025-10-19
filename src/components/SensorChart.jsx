import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function SensorChart({ data, sensor='Humidity' }){
  return (
    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-gray-100 h-72">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-gray-500">{sensor} (last 24h)</div>
          <div className="font-semibold">Live readings</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0,100]} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

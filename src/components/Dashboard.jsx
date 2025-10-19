
import React, { useEffect, useState } from 'react'
import Header from './Header'
import SensorChart from './SensorChart'
import { getFields, getLiveSensorData, triggerIrrigation } from '../services/mockApi'
import { motion } from 'framer-motion'

export default function Dashboard({ onLogout }){
  const [loading, setLoading] = useState(true)
  const [sensors, setSensors] = useState({
    humidity: { value: 0, data: [] },
    soilTemp: { value: 0, data: [] },
    light: { value: 0, data: [] },
    waterLevel: { value: 0, data: [] },
    ph: { value: 7.0, data: [] }
  })
  const [irrigating, setIrrigating] = useState(false)
  const [alerts, setAlerts] = useState([])

  function genMockSeries(min=0, max=100){
    const now = Date.now()
    const arr = []
    for(let i=23;i>=0;i--){
      const t = new Date(now - i*3600*1000)
      arr.push({ time: t.getHours()+':00', value: Math.round(min + Math.random()*(max-min)) })
    }
    return arr
  }

  async function refresh(){
    setLoading(true)
    try {
      const fields = await getFields()
      const avgHumidity = Math.round(fields.reduce((s,f)=>s+(f.lastHumidity||0),0)/Math.max(1,fields.length))
      const fieldId = fields[0]?.id

      // Humidity (real from fields)
      const humiditySeries = genMockSeries(30,90)
      const humidityVal = avgHumidity || Math.round(30 + Math.random()*60)

      // Soil temp (simulate live sensor)
      const soilSeries = fieldId ? await getLiveSensorData(fieldId) : genMockSeries(15,35)
      const soilVal = soilSeries[soilSeries.length-1]?.value ?? Math.round(20 + Math.random()*10)

      // Light intensity (lx)
      const lightSeries = genMockSeries(300,800)
      const lightVal = Math.round(300 + Math.random()*500)

      // Water level (%)
      const waterSeries = genMockSeries(30,100)
      const waterVal = Math.round(30 + Math.random()*70)

      // pH 5.5 - 8.0
      const phSeries = []
      const now = Date.now()
      for(let i=23;i>=0;i--){
        const t = new Date(now - i*3600*1000)
        const p = (5.5 + Math.random()*2.5)
        phSeries.push({ time: t.getHours()+':00', value: Math.round((p-5.5)/(8.0-5.5)*100) })
      }
      const phVal = (5.5 + Math.random()*2.5).toFixed(2)

      setSensors({
        humidity: { value: humidityVal, data: humiditySeries },
        soilTemp: { value: soilVal, data: soilSeries },
        light: { value: lightVal, data: lightSeries },
        waterLevel: { value: waterVal, data: waterSeries },
        ph: { value: phVal, data: phSeries }
      })

      // alerts generation
      const newAlerts = []
      if (waterVal < 40) newAlerts.push('⚠️ Low water level detected in reservoir.')
      if (soilVal > 32) newAlerts.push('🌡️ High soil temperature detected.')
      if (humidityVal < 40) newAlerts.push('💧 Low humidity level.')
      if (phVal < 6 || phVal > 7.5) newAlerts.push('⚠️ pH out of optimal range (6 - 7.5).')
      setAlerts(newAlerts)

    } catch(e){
      console.error('refresh error', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    refresh()
    const id = setInterval(refresh, 8000)
    return ()=> clearInterval(id)
  },[])

  async function onRunIrrigation(){
    setIrrigating(true)
    try{
      await triggerIrrigation(null)
      await new Promise(r=>setTimeout(r,3000))
    }catch(e){
      console.error(e)
    }finally{
      setIrrigating(false)
      refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={onLogout}/>
      <div className="p-6 max-w-7xl mx-auto">
        <main className="grid grid-cols-12 gap-6">
          <motion.div className="col-span-8 space-y-6" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:0.05}}>
            <div className="grid grid-cols-2 gap-4">
              {/* Humidity */}
              <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-gray-100">
                <div>
                  <div className="text-sm text-gray-500">Humidity</div>
                  <div className="text-2xl font-bold">{loading ? '—' : sensors.humidity.value + '%'}</div>
                </div>
                <div className="mt-3">
                  <SensorChart data={sensors.humidity.data} sensor="Humidity" />
                </div>
              </div>
              {/* Soil Temp */}
              <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-gray-100">
                <div>
                  <div className="text-sm text-gray-500">Soil Temperature</div>
                  <div className="text-2xl font-bold">{loading ? '—' : sensors.soilTemp.value + '°C'}</div>
                </div>
                <div className="mt-3">
                  <SensorChart data={sensors.soilTemp.data} sensor="Soil Temp" />
                </div>
              </div>
              {/* Light */}
              <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-gray-100">
                <div>
                  <div className="text-sm text-gray-500">Light Intensity</div>
                  <div className="text-2xl font-bold">{loading ? '—' : sensors.light.value + ' lx'}</div>
                </div>
                <div className="mt-3">
                  <SensorChart data={sensors.light.data} sensor="Light" />
                </div>
              </div>
              {/* Water */}
              <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-gray-100">
                <div>
                  <div className="text-sm text-gray-500">Water Level</div>
                  <div className="text-2xl font-bold">{loading ? '—' : sensors.waterLevel.value + '%'}</div>
                </div>
                <div className="mt-3">
                  <SensorChart data={sensors.waterLevel.data} sensor="Water" />
                </div>
              </div>
              {/* pH */}
              <div className="col-span-2 bg-white/80 rounded-2xl p-4 shadow-sm border border-gray-100">
                <div>
                  <div className="text-sm text-gray-500">Soil pH</div>
                  <div className="text-2xl font-bold">{loading ? '—' : sensors.ph.value}</div>
                </div>
                <div className="mt-3">
                  <SensorChart data={sensors.ph.data} sensor="pH" />
                </div>
              </div>
            </div>
          </motion.div>
          {/* Right column */}
          <motion.aside className="col-span-4 space-y-6" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500">Irrigation (Manual)</div>
              <div className="mt-3">
                <button onClick={onRunIrrigation} disabled={irrigating} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60">
                  {irrigating ? 'Irrigating...' : 'Run Irrigation'}
                </button>
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-500">Alerts</div>
              <ul className="mt-2 text-sm space-y-2">
                {alerts.length === 0 ? (
                  <li className="text-green-600">✅ All good — no alerts currently.</li>
                ) : (
                  alerts.map((a,i)=><li key={i} className="text-red-600">{a}</li>)
                )}
              </ul>
            </div>
          </motion.aside>
        </main>
      </div>
    </div>
  )
}

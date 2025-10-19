import React, { useState, useContext } from 'react'
import { MockAuthContext } from '../services/mockAuth'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }){
  const auth = useContext(MockAuthContext)
  const navigate = useNavigate()
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const result = await auth.login({ email, password: pass })
      onLogin(result)
    } catch (e){
      setErr(e.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome to <span className="text-green-600">SmartFarm</span></h2>
        <p className="text-sm text-gray-600 mb-6">Sign in to monitor fields & control irrigation.</p>
        <form onSubmit={submit} className="space-y-4">
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-xl border border-gray-200" />
          <input required type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="w-full p-3 rounded-xl border border-gray-200" />
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-500">
          Don’t have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-green-600 font-medium hover:underline">
            Register
          </button>
        </div>
      </motion.div>
    </div>
  )
}
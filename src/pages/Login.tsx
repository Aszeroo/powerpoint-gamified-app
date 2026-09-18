import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (supabaseError) {
      setError(supabaseError.message)
      setLoading(false)
      return
    }

    // Sign in successful, redirect to dashboard
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-blue to-pastel-green text-dark flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
        {error && (
          <div className="bg-red-500/20 text-red-500 p-4 rounded mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-pastel-pink text-white placeholder-gray-400"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-pastel-pink text-white placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pastel-pink hover:bg-pastel-pink/80 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
          <p className="text-center text-sm text-white/80">
            ยังไม่มีบัญชี? <span className="underline">สมัครสมาชิก</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
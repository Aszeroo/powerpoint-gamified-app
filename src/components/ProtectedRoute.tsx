import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

export const ProtectedRoute = ({ children }: any) => {
  const { session } = useSession()
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session !== null) {
      setLoading(false)
    }
  }, [session])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return session ? children : <Navigate to="/login" state={{ from: location }} replace />
}
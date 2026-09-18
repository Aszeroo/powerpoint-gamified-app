import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'

export const ProfilePage = () => {
  const { session } = useSession()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      loadUserData()
    } else {
      setLoading(false)
    }
  }, [session])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session?.user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setUserData(data || null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-danger">Error: {error}</div>
  }

  if (!session?.user) {
    return <div className="text-center py-12">Please log in to view your profile</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">
          Your PowerPoint learning journey and achievements
        </p>
      </div>

      <div className="grid gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              <div className="mb-6 flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">PP</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {session?.user.email?.split('@')[0] || 'PowerPoint Learner'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {session?.user.email}
                  </p>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="card p-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Level</h3>
                  <p className="text-2xl font-bold text-primary">
                    {/* Will be populated from user_stats */}
                    1
                  </p>
                </div>
                <div className="card p-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Total XP</h3>
                  <p className="text-2xl font-bold text-secondary">
                    {/* Will be populated from user_stats */}
                    0
                  </p>
                </div>
                <div className="card p-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Challenges Completed</h3>
                  <p className="text-2xl font-bold text-info">
                    {/* Will be populated from user_stats */}
                    0
                  </p>
                </div>
                <div className="card p-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Tutorials Completed</h3>
                  <p className="text-2xl font-bold text-warning">
                    {/* Will be populated from user_stats */}
                    0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive updates about new tutorials and challenges
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {/* Toggle switch placeholder */}
                    <div className="h-6 w-11 bg-gray-200 rounded-full relative">
                      <div className="h-5 w-5 bg-white rounded-full transform translate-x-0.5 transition duration-200"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Progress Emails</p>
                    <p className="text-sm text-gray-500">
                      Weekly summary of your learning progress
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {/* Toggle switch placeholder */}
                    <div className="h-6 w-11 bg-gray-200 rounded-full relative">
                      <div className="h-5 w-5 bg-white rounded-full transform translate-x-0.5 transition duration-200"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-sm text-gray-500">
                      Special offers and new feature announcements
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {/* Toggle switch placeholder */}
                    <div className="h-6 w-11 bg-gray-200 rounded-full relative">
                      <div className="h-5 w-5 bg-white rounded-full transform translate-x-0.5 transition duration-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-secondary">🏆</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">First Challenge Completed</p>
                    <p className="text-sm text-gray-500">
                      Completed your first PowerPoint challenge
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-info/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-info">📚</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tutorial Enthusiast</p>
                    <p className="text-sm text-gray-500">
                      Completed 5 tutorials
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-warning">⚡</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Speed Learner</p>
                    <p className="text-sm text-gray-500">
                      Completed a challenge in under 10 minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
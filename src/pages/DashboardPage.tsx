import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'

export const DashboardPage = () => {
  const { session } = useSession()
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentChallenges, setRecentChallenges] = useState([])

  useEffect(() => {
    if (session?.user) {
      loadUserData()
    } else {
      setLoading(false)
    }
  }, [session])

  const loadUserData = async () => {
    try {
      // Get user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', session?.user.id)
        .single()

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError
      }

      // Get recent challenges
      const { data: challenges, error: challengesError } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenges (
            id,
            title,
            difficulty,
            xp_reward
          )
        `)
        .eq('user_id', session?.user.id)
        .order('completed_at', { ascending: false })
        .limit(5)

      if (challengesError) throw challengesError

      setUserStats(stats || {
        user_id: session?.user.id,
        total_xp: 0,
        level: 1,
        challenges_completed: 0,
        tutorials_completed: 0,
        streak_days: 0
      })
      setRecentChallenges(challenges || [])
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  if (!session?.user) {
    return <div className="text-center py-12">Please log in to view your dashboard</div>
  }

  const levelProgress = ((userStats?.total_xp || 0) % 1000) / 1000
  const currentLevel = Math.floor((userStats?.total_xp || 0) / 1000) + 1
  const nextLevelXp = currentLevel * 1000

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Level</h3>
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-primary">{currentLevel}</div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {userStats?.total_xp} XP / {nextLevelXp} XP
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Challenges Completed</h3>
          <p className="text-3xl font-bold text-secondary">{userStats?.challenges_completed || 0}</p>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Tutorials Completed</h3>
          <p className="text-3xl font-bold text-info">{userStats?.tutorials_completed || 0}</p>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Current Streak</h3>
          <p className="text-3xl font-bold text-warning">{userStats?.streak_days || 0}</p>
          <p className="text-xs text-gray-500 mt-2">days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-700 flex items-center justify-between">
              Recent Challenges
              <a href="/challenges" className="text-sm text-primary hover:text-primary-dark">
                View All
              </a>
            </h3>
            {recentChallenges.length > 0 ? (
              <div className="space-y-4">
                {recentChallenges.map((challenge: any) => (
                  <div key={challenge.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold`}>
                        {challenge.challenges?.difficulty === 'beginner' ? 'B'
                          : challenge.challenges?.difficulty === 'intermediate' ? 'I'
                          : 'A'}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{challenge.challenges?.title}</h4>
                      <p className="text-sm text-gray-500">
                        +{challenge.challenges?.xp_reward} XP • {
                          new Date(challenge.completed_at).toLocaleDateString()
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">
                No recent challenges completed
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Quick Actions</h3>
            <div className="space-y-4">
              <button
                onClick={() => {/* Navigate to tutorials */}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">Start a Tutorial</h4>
                  <p className="text-sm text-gray-500">
                    Learn new PowerPoint skills step by step
                  </p>
                </div>
                <span className="text-primary">
                  →
                </span>
              </button>

              <button
                onClick={() => {/* Navigate to challenges */}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">Take a Challenge</h4>
                  <p className="text-sm text-gray-500">
                    Test your skills and earn XP
                  </p>
                </div>
                <span className="text-primary">
                  →
                </span>
              </button>

              <button
                onClick={() => {/* Navigate to leaderboard */}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">Check Leaderboard</h4>
                  <p className="text-sm text-gray-500">
                    See how you rank against others
                  </p>
                </div>
                <span className="text-primary">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
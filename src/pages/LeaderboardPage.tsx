import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'

export const LeaderboardPage = () => {
  const { session } = useSession()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('all-time')

  useEffect(() => {
    if (session?.user) {
      loadLeaderboard()
    } else {
      setLoading(false)
    }
  }, [session, period])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('user_stats')
        .select(`
          *,
          users (
            id,
            email,
            user_metadata
          )
        `)
        .order('total_xp', { ascending: false })

      // Note: In a real implementation, we'd filter by period here
      // For simplicity, we're showing all-time leaderboard

      const { data, error } = await query

      if (error) throw error
      setLeaderboard(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading leaderboard...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-danger">Error: {error}</div>
  }

  if (!session?.user) {
    return <div className="text-center py-12">Please log in to view the leaderboard</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="mt-2 text-gray-600">
          See how you rank against other PowerPoint learners
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setPeriod('daily')}
            className={period === 'daily'
              ? 'bg-primary text-white px-4 py-2 rounded'
              : 'bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300'
            }
          >
            Daily
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={period === 'weekly'
              ? 'bg-primary text-white px-4 py-2 rounded'
              : 'bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300'
            }
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={period === 'monthly'
              ? 'bg-primary text-white px-4 py-2 rounded'
              : 'bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300'
            }
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod('all-time')}
            className={period === 'all-time'
              ? 'bg-primary text-white px-4 py-2 rounded'
              : 'bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300'
            }
          >
            All Time
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                XP
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Challenges Completed
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tutorials Completed
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            {leaderboard.map((user: any, index: number) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                      {user.users?.user_metadata?.avatar_initial
                        ? user.users?.user_metadata?.avatar_initial
                        : 'PP'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {user.users?.email?.split('@')[0] || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.floor((user.total_xp || 0) / 1000) + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.total_xp || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.challenges_completed || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.tutorials_completed || 0}
                </td>
              </tr>
            ))}

            {leaderboard.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No users on the leaderboard yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
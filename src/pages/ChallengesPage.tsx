import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'

export const ChallengesPage = () => {
  const { session } = useSession()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (session?.user) {
      loadChallenges()
    } else {
      setLoading(false)
    }
  }, [session])

  const loadChallenges = async () => {
    try {
      setLoading(true)
      let query = supabase.from('challenges').select('*')

      if (filter !== 'all') {
        query = query.eq('difficulty', filter)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setChallenges(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading challenges...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-danger">Error: {error}</div>
  }

  if (!session?.user) {
    return <div className="text-center py-12">Please log in to view challenges</div>
  }

  const handleStartChallenge = async (challengeId: string) => {
    // In a real app, this would navigate to a challenge interface
    // For now, we'll simulate completing the challenge
    try {
      // Check if user already completed this challenge
      const { data: existing } = await supabase
        .from('user_challenges')
        .select('id')
        .eq('user_id', session?.user.id)
        .eq('challenge_id', challengeId)
        .single()

      if (existing) {
        alert('You have already completed this challenge!')
        return
      }

      // Get challenge details
      const { data: challengeData } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single()

      if (!challengeData) {
        throw new Error('Challenge not found')
      }

      // Award XP and mark as completed
      const { error: xpError } = await supabase.rpc('award_xp', {
        p_user_id: session?.user.id,
        p_xp_amount: challengeData.xp_reward,
        p_activity_type: 'challenge',
        p_activity_id: challengeId
      })

      if (xpError) throw xpError

      // Record challenge completion
      const { error: challengeError } = await supabase
        .from('user_challenges')
        .insert({
          user_id: session?.user.id,
          challenge_id: challengeId,
          completed_at: new Date().toISOString()
        })

      if (challengeError) throw challengeError

      alert(`Congratulations! You've earned ${challengeData.xp_reward} XP!`)
      // Refresh data
      loadChallenges()
      // Note: In a real app, we'd also refresh user stats
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">PowerPoint Challenges</h1>
        <p className="mt-2 text-gray-600">
          Test your skills with hands-on challenges and earn XP points
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all'
              ? 'bg-primary text-white px-4 py-2 rounded'
              : 'bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300'
            }
          >
            All
          </button>
          <button
            onClick={() => setFilter('beginner')}
            className={filter === 'beginner'
              ? 'bg-primary text-white px-4 py-2 rounded'
              : 'bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300'
            }
          >
            Beginner
          </button>
          <button
            onClick={() => setFilter('intermediate')}
            className={filter === 'intermediate'
              ? 'bg-primary text-white px-4 py-2 rounded'
              : 'bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300'
            }
          >
            Intermediate
          </button>
          <button
            onClick={() => setFilter('advanced')}
            className={filter === 'advanced'
              ? 'bg-primary text-white px-4 py-2 rounded'
              : 'bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300'
            }
          >
            Advanced
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-danger/10 text-danger rounded">{error}</div>}

      <div className="grid gap-6">
        {challenges.map((challenge: any) => (
          <div key={challenge.id} className="lg:col-span-1">
            <div className="card h-full">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    challenge.difficulty === 'beginner'
                      ? 'bg-secondary/20 text-secondary'
                      : challenge.difficulty === 'intermediate'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-danger/20 text-danger'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="mb-4 text-gray-600 line-clamp-3">{challenge.description}</p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="bg-info/20 text-info px-3 py-1 rounded text-sm">
                    {challenge.xp_reward} XP
                  </span>
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm">
                    {challenge.estimated_time} mins
                  </span>
                </div>
                <button
                  onClick={() => handleStartChallenge(challenge.id)}
                  disabled={loading}
                  className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors font-medium text-sm"
                >
                  Start Challenge
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder if no challenges */}
        {challenges.length === 0 && (
          <div className="col-span-full">
            <div className="card p-8 text-center">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                No challenges available yet
              </h3>
              <p className="text-gray-600">
                Check back soon for new PowerPoint challenges to test your skills!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
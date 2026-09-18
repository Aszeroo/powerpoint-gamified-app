import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'

export const TutorialsPage = () => {
  const { session } = useSession()
  const [tutorials, setTutorials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      loadTutorials()
    } else {
      setLoading(false)
    }
  }, [session])

  const loadTutorials = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTutorials(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading tutorials...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-danger">Error: {error}</div>
  }

  if (!session?.user) {
    return <div className="text-center py-12">Please log in to view tutorials</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">PowerPoint Tutorials</h1>
        <p className="mt-2 text-gray-600">
          Learn essential PowerPoint skills through interactive, step-by-step tutorials
        </p>
      </div>

      <div className="grid gap-6">
        {/* Featured Tutorial */}
        <div className="lg:col-span-2">
          <div className="card h-full">
            <div className="p-6">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Mastering PowerPoint Animations
              </h2>
              <p className="mb-4 text-gray-600">
                Learn how to create engaging animations and transitions to make your
                presentations come alive.
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded text-sm">
                  Intermediate
                </span>
                <span className="bg-secondary/20 text-secondary px-3 py-1 rounded text-sm">
                  45 mins
                </span>
                <span className="bg-info/20 text-info px-3 py-1 rounded text-sm">
                  150 XP
                </span>
              </div>
              <button
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Start Tutorial
              </button>
            </div>
          </div>
        </div>

        {/* Tutorial Grid */}
        {tutorials.map((tutorial: any) => (
          <div key={tutorial.id} className="lg:col-span-1">
            <div className="card h-full">
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-gray-900">{tutorial.title}</h3>
                <p className="mb-4 text-gray-600 line-clamp-3">{tutorial.description}</p>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded text-sm">
                    {tutorial.difficulty}
                  </span>
                  <span className="bg-secondary/20 text-secondary px-3 py-1 rounded text-sm">
                    {tutorial.estimated_time} mins
                  </span>
                  <span className="bg-info/20 text-info px-3 py-1 rounded text-sm">
                    {tutorial.xp_reward} XP
                  </span>
                </div>
                <button
                  className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors font-medium text-sm"
                >
                  Start Tutorial
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder if no tutorials */}
        {tutorials.length === 0 && (
          <div className="col-span-full">
            <div className="card p-8 text-center">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                No tutorials available yet
              </h3>
              <p className="text-gray-600">
                Check back soon for new PowerPoint tutorials covering everything from
                basics to advanced techniques.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
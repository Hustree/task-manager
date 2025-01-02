import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Loader2 } from 'lucide-react'

const CONTRIBUTION_LEVELS = {
  0: '#1b1f23',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353'
} as const

const GITHUB_USERNAME = 'Hustree'
const DAYS_TO_SHOW = 365

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface ContributionStats {
  currentStreak: number
  totalContributions: number
  bestStreak: number
}

const getContributionColor = (level: number) => {
  return CONTRIBUTION_LEVELS[level as keyof typeof CONTRIBUTION_LEVELS]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function GitHubContributions() {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [stats, setStats] = useState<ContributionStats>({
    currentStreak: 0,
    totalContributions: 0,
    bestStreak: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events`)
        if (!response.ok) throw new Error('Failed to fetch GitHub data')
        
        const events = await response.json()
        
        // Process contributions
        const contributionMap = new Map<string, number>()
        const now = new Date()
        const daysAgo = new Date(now.setDate(now.getDate() - DAYS_TO_SHOW))

        events.forEach((event: any) => {
          if (new Date(event.created_at) > daysAgo) {
            const date = event.created_at.split('T')[0]
            contributionMap.set(date, (contributionMap.get(date) || 0) + 1)
          }
        })

        // Calculate stats
        let currentStreak = 0
        let bestStreak = 0
        let tempStreak = 0
        let totalContributions = 0

        const sortedDates = Array.from(contributionMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))

        sortedDates.forEach(([_, count]) => {
          totalContributions += count
          if (count > 0) {
            tempStreak++
            currentStreak = tempStreak
            bestStreak = Math.max(bestStreak, tempStreak)
          } else {
            tempStreak = 0
          }
        })

        setStats({
          currentStreak,
          totalContributions,
          bestStreak
        })

        // Format contributions for display
        const contributionData = sortedDates.map(([date, count]) => ({
          date,
          count,
          level: count === 0 ? 0 : Math.min(Math.ceil(count / 2), 4)
        }))

        setContributions(contributionData)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data')
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg text-red-400 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold">GitHub Activity</h3>
        <div className="text-xs text-gray-400">
          🔥 {stats.currentStreak} day streak
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mb-4 text-xs text-gray-400">
        <div>Total: {stats.totalContributions} contributions</div>
        <div>Best streak: {stats.bestStreak} days</div>
      </div>

      <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
        {contributions.map((day, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="w-3 h-3 rounded-sm transition-colors duration-200 hover:ring-2 hover:ring-gray-400"
                  style={{ backgroundColor: getContributionColor(day.level) }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {day.count} contributions on {formatDate(day.date)}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        <a 
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  )
}
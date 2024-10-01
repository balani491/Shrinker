import { useState, useEffect } from 'react'
import { Scissors, BarChart2, ArrowUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

interface StatItem {
  originalUrl: string
  shortUrl: string
  visits: number
}

export default function Statistics() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [sortField, setSortField] = useState<keyof StatItem>('visits')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No token found. Please sign in.')
        return
      }

      try {
        const response = await axios.get("http://localhost:3000/api/v1/getshrinker/statistics", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching statistics:", error)
        toast.error("An error occurred while fetching statistics.")
      }
    }

    fetchStats()
  }, [])

  const sortedStats = [...stats].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (field: keyof StatItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-black text-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Scissors className="h-6 w-6" />
            <span className="text-xl font-bold">Shrinker</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="hover:underline">GetShrinker</Link>
            <span className="flex items-center font-bold">
              <BarChart2 className="h-5 w-5 mr-1" />
              Statistics
            </span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">URL Statistics</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('originalUrl')}
                >
                  <div className="flex items-center">
                    Original URL
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('shortUrl')}
                >
                  <div className="flex items-center">
                    Shortened URL
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('visits')}
                >
                  <div className="flex items-center">
                    Visits
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStats.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.originalUrl}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                    <a href={`http://localhost:3000/${item.shortUrl}`} target="_blank" rel="noopener noreferrer">
                      {`http://localhost:3000/${item.shortUrl}`}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.visits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

import React, { useState } from 'react'
import { Scissors, BarChart2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const [customUrl, setCustomUrl] = useState('') 
  const [randomUrl, setRandomUrl] = useState('') 
  const [customShortUrl, setCustomShortUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const navigate = useNavigate()
  

  const handleCustomShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl || !customShortUrl) {
      toast.error("Please enter both the original URL and custom short URL.");
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      toast.error('No token found. Please sign in.');
      return;
    }

    try {
        //@ts-ignore
      const response = await axios.post("http://localhost:3000/api/v1/getshrinker/custom", {
        originalUrl: customUrl,
        customShortUrl
      },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShortenedUrl(`http://localhost:3000/${customShortUrl}`);
    } catch (error: any) {
      if (error.response) {
        // Check for status code 409
        if (error.response.status === 409) {
          toast.error(error.response.data.message || "Custom short URL already taken.");
        } else {
          const errorMessage = error.response.data.message || "An error occurred during getshrinker/custom";
          toast.error(errorMessage);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("Error in custom shorten:", error);
    }
};


  const handleRandomShorten = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log(randomUrl)

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      toast.error('No token found. Please sign in.');
      return;
    }
    if (!randomUrl) {
      toast.error("Please enter a URL to shorten.")
      return
    }

    try {
      //@ts-ignore
      const response = await axios.post("http://localhost:3000/api/v1/getshrinker/random", {
        originalUrl: randomUrl,
      },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setShortenedUrl(`http://localhost:3000/${response.data.shortUrl}`)
    } catch (error: any) {
      console.error("Error in random shorten:", error)
      const errorMessage = error.response?.data?.message || "An error occurred during getshrinker/random"
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-black text-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Scissors className="h-6 w-6" />
            <span className="text-xl font-bold">Shrinker</span>
          </div>
          <div className="flex items-center space-x-4">
            <span 
              className="cursor-pointer hover:underline"
              onClick={() => navigate('/dashboard')}
            >
              GetShrinker
            </span>
            <span 
              className="flex items-center cursor-pointer hover:underline"
              onClick={() => navigate('/statistics')}
            >
              <BarChart2 className="h-5 w-5 mr-1" />
              Statistics
            </span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Shrinker Dashboard</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">GetShrinker</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Custom Shrinker</h3>
              <form onSubmit={handleCustomShorten} className="space-y-3">
                <input
                //   type="url"
                  placeholder="Enter URL to shorten"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                //   type="text"
                  placeholder="Enter custom short URL"
                  value={customShortUrl}
                  onChange={(e) => setCustomShortUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                >
                  Create Custom Short URL
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Random Shrinker</h3>
              <form onSubmit={handleRandomShorten} className="space-y-3">
                <input
                //   type="url"
                  placeholder="Enter URL to shorten"
                  value={randomUrl}
                  onChange={(e) => setRandomUrl(e.target.value)}
                  
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                >
                  Create Random Short URL
                </button>
              </form>
            </div>
          </div>
        </div>

        {shortenedUrl && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-medium mb-4">Your Shortened URL</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold break-all">{shortenedUrl}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'

export default function EnvTestPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'dev123') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const getClientEnvVars = () => {
    const envVars: Record<string, string> = {}

    if (typeof window !== 'undefined') {
      Object.keys(process.env).forEach((key) => {
        if (key.startsWith('NEXT_PUBLIC_')) {
          envVars[key] = process.env[key] || ''
        }
      })
    }

    envVars['NODE_ENV'] = process.env.NODE_ENV || ''
    envVars['NEXT_PUBLIC_FIREBASE_API_KEY'] =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''
    envVars['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] =
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ''
    envVars['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] =
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''

    return envVars
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Environment Variables Test
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter password to view environment variables
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Access Environment Variables
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const envVars = getClientEnvVars()

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Client-Side Environment Variables
              </h1>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              These are environment variables available on the client side
              (NEXT_PUBLIC_ prefixed)
            </p>
          </div>

          <div className="px-6 py-4">
            {Object.keys(envVars).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No client-side environment variables found
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Add variables with NEXT_PUBLIC_ prefix to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(envVars).map(([key, value]) => (
                  <div
                    key={key}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 font-mono">
                          {key}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 font-mono break-all">
                          {value || '<empty>'}
                        </p>
                      </div>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          value
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {value ? 'Set' : 'Empty'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>
                <strong>Note:</strong> Only environment variables with
                NEXT_PUBLIC_ prefix are visible on the client side.
              </p>
              <p className="mt-1">
                Server-side variables are not displayed for security reasons.
              </p>
              <p className="mt-1">
                Current timestamp: {new Date().toISOString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

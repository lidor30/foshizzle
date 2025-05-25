import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">TTS Cache</h2>
          <p className="text-gray-600 mb-4">
            Manage text-to-speech cached files
          </p>
          <Link
            href="/admin/tts-cache"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Manage →
          </Link>
        </div>

        {/* Add more dashboard cards here */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <p className="text-gray-600 mb-4">Manage user accounts</p>
          <span className="text-gray-400">Coming soon</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <p className="text-gray-600 mb-4">Configure application settings</p>
          <span className="text-gray-400">Coming soon</span>
        </div>
      </div>
    </div>
  )
}

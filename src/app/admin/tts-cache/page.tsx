'use client';

import { TTSCacheEntry, deleteTTSCacheEntry } from '@/utils/firebase';
import { useEffect, useState } from 'react';

export default function TTSCacheAdmin() {
  const [cacheEntries, setCacheEntries] = useState<TTSCacheEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCacheEntries();
  }, []);

  const loadCacheEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tts?list=true');
      if (!response.ok) {
        throw new Error('Failed to fetch cache entries');
      }
      const data = await response.json();
      setCacheEntries(data.entries);
      setError(null);
    } catch (err) {
      setError('Failed to load cache entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileHash: string) => {
    try {
      const success = await deleteTTSCacheEntry(fileHash);
      if (success) {
        setCacheEntries(
          cacheEntries.filter((entry) => entry.fileHash !== fileHash)
        );
      } else {
        setError('Failed to delete cache entry');
      }
    } catch (err) {
      setError('Error deleting cache entry');
      console.error(err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-600">Loading cache entries...</p>;
    }

    if (cacheEntries.length === 0) {
      return <p className="text-gray-600">No cache entries found.</p>;
    }

    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                File Hash
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Text
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Voice
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Model
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cacheEntries.map((entry) => (
              <tr key={entry.fileHash} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                  {entry.fileHash}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                  {entry.metadata?.text || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.metadata?.voice || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.metadata?.model || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.metadata?.timestamp
                    ? new Date(entry.metadata.timestamp).toLocaleString()
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => window.open(entry.downloadURL, '_blank')}
                    >
                      Play
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => handleDelete(entry.fileHash)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">TTS Cache Management</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={loadCacheEntries}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
}

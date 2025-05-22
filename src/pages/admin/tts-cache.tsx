import {
  TTSCacheEntry,
  deleteTTSCacheEntry,
  listTTSCacheEntries
} from '@/utils/firebase';
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
      const entries = await listTTSCacheEntries();
      setCacheEntries(entries);
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

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">TTS Cache Admin</h1>
        <p>Loading cache entries...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TTS Cache Admin</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={loadCacheEntries}
      >
        Refresh
      </button>

      {cacheEntries.length === 0 ? (
        <p>No cache entries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">File Hash</th>
                <th className="px-4 py-2 border">Text</th>
                <th className="px-4 py-2 border">Voice</th>
                <th className="px-4 py-2 border">Model</th>
                <th className="px-4 py-2 border">Created</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cacheEntries.map((entry) => (
                <tr key={entry.fileHash}>
                  <td className="px-4 py-2 border font-mono text-sm">
                    {entry.fileHash}
                  </td>
                  <td className="px-4 py-2 border">
                    {entry.metadata?.text || 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">
                    {entry.metadata?.voice || 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">
                    {entry.metadata?.model || 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">
                    {entry.metadata?.timestamp
                      ? new Date(entry.metadata.timestamp).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                        onClick={() => window.open(entry.downloadURL, '_blank')}
                      >
                        Play
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
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
      )}
    </div>
  );
}

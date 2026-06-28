'use client'

import { TTSCacheEntry, deleteTTSCacheEntry } from '@/utils/firebase'
import { useEffect, useMemo, useState } from 'react'

type SortKey = 'fileHash' | 'text' | 'voice' | 'model' | 'created'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== column) return <span className="ml-1 text-gray-300">↕</span>
  return <span className="ml-1 text-indigo-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
}

export default function TTSCacheAdmin() {
  const [cacheEntries, setCacheEntries] = useState<TTSCacheEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    loadCacheEntries()
  }, [])

  const loadCacheEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tts?list=true')
      if (!response.ok) throw new Error('Failed to fetch cache entries')
      const data = await response.json()
      setCacheEntries(data.entries)
      setError(null)
    } catch (err) {
      setError('Failed to load cache entries')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fileHash: string) => {
    try {
      const success = await deleteTTSCacheEntry(fileHash)
      if (success) {
        setCacheEntries((prev) => prev.filter((e) => e.fileHash !== fileHash))
      } else {
        setError('Failed to delete cache entry')
      }
    } catch (err) {
      setError('Error deleting cache entry')
      console.error(err)
    }
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return cacheEntries
    return cacheEntries.filter((e) =>
      [e.fileHash, e.metadata?.text, e.metadata?.voice, e.metadata?.model]
        .some((v) => v?.toLowerCase().includes(q))
    )
  }, [cacheEntries, search])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      let aVal = ''
      let bVal = ''
      if (sortKey === 'fileHash') { aVal = a.fileHash; bVal = b.fileHash }
      else if (sortKey === 'text') { aVal = a.metadata?.text ?? ''; bVal = b.metadata?.text ?? '' }
      else if (sortKey === 'voice') { aVal = a.metadata?.voice ?? ''; bVal = b.metadata?.voice ?? '' }
      else if (sortKey === 'model') { aVal = a.metadata?.model ?? ''; bVal = b.metadata?.model ?? '' }
      else if (sortKey === 'created') { aVal = a.metadata?.timestamp ?? ''; bVal = b.metadata?.timestamp ?? '' }
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const thClass = 'px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 whitespace-nowrap'

  const renderTable = () => {
    if (loading) return <p className="text-gray-600">Loading cache entries...</p>
    if (cacheEntries.length === 0) return <p className="text-gray-600">No cache entries found.</p>

    return (
      <>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className={thClass} onClick={() => handleSort('fileHash')}>
                  File Hash <SortIcon column="fileHash" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort('text')}>
                  Text <SortIcon column="text" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort('voice')}>
                  Voice <SortIcon column="voice" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort('model')}>
                  Model <SortIcon column="model" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort('created')}>
                  Created <SortIcon column="created" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                    No results match your search.
                  </td>
                </tr>
              ) : (
                paginated.map((entry) => (
                  <tr key={entry.fileHash} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-900 break-all max-w-[140px]">
                      {entry.fileHash}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate whitespace-nowrap">
                      {entry.metadata?.text || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 break-words max-w-[100px]">
                      {entry.metadata?.voice || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {entry.metadata?.model || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {entry.metadata?.timestamp
                        ? new Date(entry.metadata.timestamp).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="px-2 py-1 text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                          onClick={() => window.open(entry.downloadURL, '_blank')}
                        >
                          Play
                        </button>
                        <button
                          className="px-2 py-1 text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                          onClick={() => handleDelete(entry.fileHash)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span>
              {sorted.length === 0
                ? 'No results'
                : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, sorted.length)} of ${sorted.length}`}
            </span>
            <label className="flex items-center gap-1">
              Rows:
              <select
                className="ml-1 border border-gray-300 rounded px-1 py-0.5 text-xs"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >«</button>
            <button
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >‹</button>
            <span className="px-3">Page {page} of {totalPages}</span>
            <button
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >›</button>
            <button
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >»</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TTS Cache Management</h1>
        <button
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={loadCacheEntries}
        >
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by hash, text, voice, or model…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full max-w-sm px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {renderTable()}
    </div>
  )
}

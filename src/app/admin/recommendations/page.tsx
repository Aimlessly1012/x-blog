'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { CheckCircleIcon, XCircleIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline'

interface Recommendation {
  id: string
  username: string
  url: string
  display_name: string
  bio: string
  avatar: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_by: string
  submitted_at: number
  reviewed_at?: number
  reviewed_by?: string
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    fetchRecommendations()
  }, [filter])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/recommend-author?status=${filter}`)
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('获取推荐列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/recommendations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      })

      if (response.ok) {
        fetchRecommendations()
      }
    } catch (error) {
      console.error('审核失败:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条推荐吗？')) return

    try {
      const response = await fetch(`/api/admin/recommendations?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchRecommendations()
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('zh-CN')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
          <ClockIcon className="w-3 h-3" />
          待审核
        </span>
      case 'approved':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
          <CheckCircleIcon className="w-3 h-3" />
          已批准
        </span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
          <XCircleIcon className="w-3 h-3" />
          已拒绝
        </span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            博主推荐审核
          </h1>
          <p className="text-gray-400">审核用户提交的博主推荐</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          {[
            { key: 'pending', label: '待审核', color: 'yellow' },
            { key: 'approved', label: '已批准', color: 'green' },
            { key: 'rejected', label: '已拒绝', color: 'red' },
            { key: 'all', label: '全部', color: 'gray' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recommendations List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">加载中...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-2xl border border-gray-800">
            <p className="text-gray-500">暂无推荐</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-pink-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img
                    src={rec.avatar}
                    alt={rec.username}
                    className="w-16 h-16 rounded-full bg-gray-800"
                  />

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                          {rec.display_name || rec.username}
                          {getStatusBadge(rec.status)}
                        </h3>
                        <a
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-pink-400 hover:underline"
                        >
                          @{rec.username}
                        </a>
                      </div>
                    </div>

                    {rec.bio && (
                      <p className="text-sm text-gray-400">{rec.bio}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>提交者: {rec.submitted_by}</span>
                      <span>·</span>
                      <span>提交时间: {formatDate(rec.submitted_at)}</span>
                      {rec.reviewed_at && (
                        <>
                          <span>·</span>
                          <span>审核时间: {formatDate(rec.reviewed_at)}</span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    {rec.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleReview(rec.id, 'approve')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-all flex items-center gap-1"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          批准
                        </button>
                        <button
                          onClick={() => handleReview(rec.id, 'reject')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-all flex items-center gap-1"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          拒绝
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-all flex items-center gap-1 ml-auto"
                        >
                          <TrashIcon className="w-4 h-4" />
                          删除
                        </button>
                      </div>
                    )}

                    {rec.status !== 'pending' && (
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-all flex items-center gap-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                        删除
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

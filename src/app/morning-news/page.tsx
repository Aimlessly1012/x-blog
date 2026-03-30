'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Article } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const TAG_COLORS: Record<string, string> = {
  'Claude': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'Claude Code': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  '晨报': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  '新功能': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  '实用技巧': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  '开发教程': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'AI资讯': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  '热门讨论': 'bg-red-500/10 text-red-400 border-red-500/30',
}

function MorningNewsCard({ item }: { item: Article }) {
  const tags = item.tags || []
  
  return (
    <article className="bg-gray-900 rounded-2xl border border-gray-700/50 p-6 hover:border-pink-500/30 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium border ${TAG_COLORS[tag] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {item.publishedAt ? formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true, locale: zhCN }) : ''}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
        {item.title || '无标题'}
      </h3>
      
      {item.summary && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {item.summary}
        </p>
      )}
      
      {item.content && (
        <div className="text-gray-300 text-sm line-clamp-4 prose prose-sm prose-invert max-w-none">
          {item.content.substring(0, 300)}...
        </div>
      )}
      
      {item.url && (
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-4 text-pink-400 hover:text-pink-300 text-sm"
        >
          阅读原文 →
        </a>
      )}
    </article>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-900 rounded-2xl border border-gray-700/50 p-6 animate-pulse">
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-gray-800 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-800 rounded-full"></div>
          </div>
          <div className="h-6 bg-gray-800 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-800 rounded mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  )
}

export default function MorningNewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchArticles()
  }, [])

  async function fetchArticles() {
    try {
      const res = await fetch('/api/morning-news?limit=30')
      const data = await res.json()
      setArticles(data.data || [])
    } catch (error) {
      console.error('Failed to fetch morning news:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🌅</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              每日晨报
            </h1>
          </div>
          <p className="text-gray-400">
            每天早上 8 点自动推送 Claude 最新资讯，包括新功能、实用技巧、开发教程等
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl text-gray-300 mb-2">暂无晨报</h2>
            <p className="text-gray-500">明早 8 点会自动推送，别忘了回来看看 🐰</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map(article => (
              <MorningNewsCard key={article.id} item={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

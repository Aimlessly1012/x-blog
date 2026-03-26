'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRightIcon, TrashIcon, SparklesIcon, ClockIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline'
import Navbar from '@/components/Navbar'
import RequireAuth from '@/components/RequireAuth'
import { Article } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const STATUS_LABELS: Record<Article['status'], string> = {
  pending: '等待中',
  crawling: '爬取中',
  translating: '翻译中',
  summarizing: '总结中',
  completed: '已完成',
  failed: '失败'
}

const STATUS_COLORS: Record<Article['status'], string> = {
  pending: 'bg-gray-700/50 text-gray-400 border-gray-600',
  crawling: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  translating: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  summarizing: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/10 text-red-400 border-red-500/30'
}

type FilterType = 'all' | 'completed' | 'processing'

function ArticleCardSkeleton({ size = 'medium' }: { size?: 'large' | 'medium' | 'small' }) {
  return (
    <div className={`bg-gray-900 rounded-2xl overflow-hidden animate-pulse ${size === 'large' ? 'min-h-[400px]' : 'min-h-[200px]'}`}>
      <div className="p-5 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-24 bg-gray-800 rounded-full"></div>
        </div>
        <div className="h-6 bg-gray-800 rounded mb-3 w-3/4"></div>
        <div className="flex-1"></div>
        <div className="h-4 bg-gray-800 rounded"></div>
      </div>
    </div>
  )
}

// Magazine 布局的大卡片
function FeaturedCard({ article, onDelete, isDeleting }: { article: Article, onDelete: (id: string) => void, isDeleting: boolean }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <article className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 hover:border-pink-500/30 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <div className="relative p-6 md:p-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {article.authorUsername && (
              <span className="inline-flex items-center px-3 py-1.5 bg-pink-500/10 text-pink-400 rounded-full text-sm font-semibold border border-pink-500/20">
                @{article.authorUsername}
              </span>
            )}
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[article.status]}`}>
              {STATUS_LABELS[article.status]}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="w-5 h-5 text-pink-400" />
              ) : (
                <BookmarkOutlineIcon className="w-5 h-5 text-gray-500 hover:text-pink-400" />
              )}
            </button>
            <button
              onClick={() => onDelete(article.id)}
              disabled={isDeleting}
              className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link href={article.status === 'completed' ? `/article/${article.id}` : '#'} className="block mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all cursor-pointer leading-tight">
            {article.title || 'Untitled'}
          </h2>
        </Link>

        {/* Summary */}
        <div className="flex-1 mb-4">
          {(article.translatedSummary || article.summary) && (
            <div className="bg-gray-800/30 rounded-xl p-4 border-l-2 border-pink-500">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">AI Summary</span>
              </div>
              <p className="text-gray-300 text-sm md:text-base line-clamp-3 leading-relaxed">
                {article.translatedSummary || article.summary}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4" />
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: zhCN })}
              </span>
            )}
          </div>
          {article.status === 'completed' && (
            <Link
              href={`/article/${article.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-400 rounded-lg hover:bg-pink-500/20 transition-all font-semibold"
            >
              <span>阅读全文</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

// Magazine 布局的小卡片
function CompactCard({ article, onDelete, isDeleting }: { article: Article, onDelete: (id: string) => void, isDeleting: boolean }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <article className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 hover:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 h-full flex flex-col">
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {article.authorUsername && (
              <span className="inline-flex items-center px-2.5 py-1 bg-pink-500/10 text-pink-400 rounded-full text-xs font-semibold truncate max-w-[120px]">
                @{article.authorUsername}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="w-4 h-4 text-pink-400" />
              ) : (
                <BookmarkOutlineIcon className="w-4 h-4 text-gray-500 hover:text-pink-400" />
              )}
            </button>
            <button
              onClick={() => onDelete(article.id)}
              disabled={isDeleting}
              className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link href={article.status === 'completed' ? `/article/${article.id}` : '#'} className="block mb-2">
          <h3 className="text-base md:text-lg font-bold text-gray-100 line-clamp-2 group-hover:text-pink-400 transition-colors cursor-pointer leading-tight">
            {article.title || 'Untitled'}
          </h3>
        </Link>

        {/* Summary */}
        <div className="flex-1 mb-3">
          {(article.translatedSummary || article.summary) && (
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {article.translatedSummary || article.summary}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[article.status]}`}>
            {STATUS_LABELS[article.status]}
          </span>
          {article.status === 'completed' && (
            <Link
              href={`/article/${article.id}`}
              className="text-pink-400 hover:text-pink-300 text-sm font-semibold transition-colors"
            >
              阅读
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // 移除了邀请码验证 - 现在使用 OAuth

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    try {
      const response = await fetch('/api/articles')
      const data = await response.json()
      setArticles(data.data || [])
      setError(null)
    } catch (err) {
      setError('加载失败，请刷新重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定删除这篇文章？此操作无法撤销。')) return
    
    setDeletingId(id)
    try {
      const response = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('删除失败')
      setArticles(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
      alert('删除失败，请重试')
      fetchArticles()
    } finally {
      setDeletingId(null)
    }
  }

  const filteredArticles = useMemo(() => {
    let filtered = articles

    if (activeFilter === 'completed') {
      filtered = filtered.filter(a => a.status === 'completed')
    } else if (activeFilter === 'processing') {
      filtered = filtered.filter(a => a.status !== 'completed' && a.status !== 'failed')
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(a => 
        a.title?.toLowerCase().includes(query) ||
        a.author?.toLowerCase().includes(query) ||
        a.authorUsername?.toLowerCase().includes(query) ||
        a.content?.toLowerCase().includes(query) ||
        a.translatedContent?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [articles, activeFilter, searchQuery])

  const featuredArticle = filteredArticles[0]
  const sideArticles = filteredArticles.slice(1, 3)
  const gridArticles = filteredArticles.slice(3)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-8">
            <div className="h-12 w-64 bg-gray-800 rounded-xl animate-pulse mb-6"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ArticleCardSkeleton size="large" />
            </div>
            <div className="space-y-6">
              <ArticleCardSkeleton size="small" />
              <ArticleCardSkeleton size="small" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-950">
        <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 搜索和筛选栏 */}
        <div className="mb-6 md:mb-8 space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="搜索标题、作者、内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* 筛选标签 */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-500">
              <FunnelIcon className="w-4 h-4" />
              <span className="text-sm font-medium">筛选:</span>
            </div>
            {[
              { key: 'all' as FilterType, label: '全部', count: articles.length },
              { key: 'completed' as FilterType, label: '已完成', count: articles.filter(a => a.status === 'completed').length },
              { key: 'processing' as FilterType, label: '处理中', count: articles.filter(a => a.status !== 'completed' && a.status !== 'failed').length },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeFilter === filter.key
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-gray-800'
                }`}
              >
                {filter.label}
                <span className={`ml-2 ${activeFilter === filter.key ? 'text-pink-100' : 'text-gray-600'}`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {searchQuery && (
            <div className="text-sm text-gray-500">
              找到 <span className="text-pink-400 font-semibold">{filteredArticles.length}</span> 篇相关文章
            </div>
          )}
        </div>

        {/* Magazine 布局内容区 */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 md:py-32">
            <div className="mb-8 relative">
              <div className="text-6xl md:text-8xl mb-4 animate-bounce-slow">
                {searchQuery || activeFilter !== 'all' ? '🔍' : '🐰'}
              </div>
              <div className="absolute inset-0 top-12 flex items-center justify-center">
                <div className="w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3">
              {searchQuery || activeFilter !== 'all' ? '没有找到相关文章' : '空空如也'}
            </h2>
            <p className="text-gray-500 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto px-4">
              {searchQuery || activeFilter !== 'all' 
                ? '试试其他关键词或筛选条件'
                : '还没有文章哦～添加一个 X (Twitter) 链接开始构建你的信息茧房'
              }
            </p>
            {!searchQuery && activeFilter === 'all' && (
              <Link
                href="/add"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-xl hover:from-pink-500 hover:to-pink-400 transition-all duration-300 font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transform"
              >
                <SparklesIcon className="w-5 h-5" />
                添加第一篇文章
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* 主要布局：大卡片 + 侧边小卡片 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧：特色大卡片 */}
              <div className="lg:col-span-2">
                {featuredArticle && (
                  <FeaturedCard 
                    article={featuredArticle} 
                    onDelete={handleDelete}
                    isDeleting={deletingId === featuredArticle.id}
                  />
                )}
              </div>

              {/* 右侧：2个小卡片堆叠 */}
              <div className="space-y-6">
                {sideArticles.map(article => (
                  <CompactCard
                    key={article.id}
                    article={article}
                    onDelete={handleDelete}
                    isDeleting={deletingId === article.id}
                  />
                ))}
              </div>
            </div>

            {/* 下方：3列小卡片网格 */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map(article => (
                  <CompactCard
                    key={article.id}
                    article={article}
                    onDelete={handleDelete}
                    isDeleting={deletingId === article.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
      </div>
    </RequireAuth>
  )
}

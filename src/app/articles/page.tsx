'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Article } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ClockIcon, TrashIcon, BookOpenIcon, ArrowRightIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'

// 统一标签颜色
const TAG_COLORS: Record<string, string> = {
  'Claude': 'bg-purple-100 text-purple-700',
  'Claude Code': 'bg-indigo-100 text-indigo-700',
  'OpenClaw': 'bg-blue-100 text-blue-700',
  'Skills': 'bg-cyan-100 text-cyan-700',
  'MCP': 'bg-teal-100 text-teal-700',
  'Prompt Engineering': 'bg-pink-100 text-pink-700',
  '教程': 'bg-orange-100 text-orange-700',
  '最佳实践': 'bg-rose-100 text-rose-700',
  '快捷键': 'bg-green-100 text-green-700',
  '工作流': 'bg-lime-100 text-lime-700',
  '技巧': 'bg-yellow-100 text-yellow-700',
  '资源合集': 'bg-amber-100 text-amber-700',
  '效率提升': 'bg-emerald-100 text-emerald-700',
  '自动化': 'bg-sky-100 text-sky-700',
  '安全': 'bg-red-100 text-red-700',
  'AI Agent': 'bg-violet-100 text-violet-700',
  '开发者向': 'bg-gray-800 text-gray-300',
}

function getTagClass(tag: string) {
  return TAG_COLORS[tag] || 'bg-gray-800 text-gray-400'
}

const STATUS_LABELS: Record<Article['status'], string> = {
  pending: '等待中',
  crawling: '爬取中',
  translating: '翻译中',
  summarizing: '总结中',
  completed: '已完成',
  failed: '失败'
}

const STATUS_COLORS: Record<Article['status'], string> = {
  pending: 'bg-gray-800 text-gray-500',
  crawling: 'bg-blue-100 text-blue-600',
  translating: 'bg-yellow-100 text-yellow-600',
  summarizing: 'bg-purple-100 text-purple-600',
  completed: 'bg-emerald-100 text-emerald-600',
  failed: 'bg-red-100 text-red-600'
}

type FilterType = 'all' | 'completed' | 'processing'

function ArticleCardSkeleton() {
  return (
    <div className="bg-gray-950 rounded-2xl border border-gray-700 p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
      </div>
      <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
    </div>
  )
}

function ArticleCard({ article, onDelete, isDeleting }: { article: Article; onDelete: (id: string) => void; isDeleting: boolean }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const tags = article.tags || []

  return (
    <article className="group bg-gray-950 rounded-2xl border border-gray-700 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {article.authorUsername && (
              <span className="inline-flex items-center px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                @{article.authorUsername}
              </span>
            )}
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${STATUS_COLORS[article.status]}`}>
              {STATUS_LABELS[article.status]}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="w-5 h-5 text-pink-500" />
              ) : (
                <BookOpenIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => onDelete(article.id)}
              disabled={isDeleting}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-100 mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {article.title || '无标题'}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 4).map(tag => (
              <span 
                key={tag} 
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTagClass(tag)}`}
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-500">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <ClockIcon className="w-4 h-4" />
            <span>
              {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: zhCN }) : ''}
            </span>
          </div>
          {article.url && (
            <a 
              href={`/article/${article.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors group/link"
            >
              <span>阅读全文</span>
              <ArrowRightIcon className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
        <BookOpenIcon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-100 mb-2">暂无文章</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        还没有任何文章内容<br />
        去看看 <a href="/" className="text-pink-600 hover:underline">晨报</a> 有什么新内容吧
      </p>
    </div>
  )
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchArticles()
  }, [])

  async function fetchArticles() {
    try {
      const res = await fetch('/api/articles')
      const data = await res.json()
      setArticles(data.data || [])
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      setArticles(prev => prev.filter(a => a.id !== id))
    } catch (error) {
      console.error('Failed to delete article:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredArticles = articles.filter(article => {
    // Status filter
    if (filter === 'completed' && article.status !== 'completed') return false
    if (filter === 'processing' && ['pending', 'crawling', 'translating', 'summarizing'].includes(article.status)) return false
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchTitle = article.title?.toLowerCase().includes(query)
      const matchAuthor = article.authorUsername?.toLowerCase().includes(query)
      const matchSummary = article.summary?.toLowerCase().includes(query)
      if (!matchTitle && !matchAuthor && !matchSummary) return false
    }
    
    return true
  })

  const allTags = Array.from(new Set(articles.flatMap(a => a.tags || []))).sort()

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">X精选文章</h1>
          
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'completed', 'processing'] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filter === f 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {f === 'all' ? '全部' : f === 'completed' ? '已完成' : '处理中'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </div>
        ) : filteredArticles.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              共 {filteredArticles.length} 篇文章
            </div>
            <div className="space-y-4">
              {filteredArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onDelete={handleDelete}
                  isDeleting={deletingId === article.id}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

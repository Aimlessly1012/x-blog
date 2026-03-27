'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { ArrowRightIcon, TrashIcon, SparklesIcon, ClockIcon, MagnifyingGlassIcon, FunnelIcon, TagIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline'
import Navbar from '@/components/Navbar'
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

// 标签颜色映射
const TAG_COLORS: Record<string, string> = {
  'Claude': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'Claude Code': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  'OpenClaw': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Skills': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'MCP': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  'Prompt Engineering': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  '教程': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  '最佳实践': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  '快捷键': 'bg-green-500/10 text-green-400 border-green-500/30',
  '工作流': 'bg-lime-500/10 text-lime-400 border-lime-500/30',
  '技巧': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  '资源合集': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  '效率提升': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  '自动化': 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  '安全': 'bg-red-500/10 text-red-400 border-red-500/30',
  'AI Agent': 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  '开发者向': 'bg-slate-500/10 text-slate-400 border-slate-500/30',
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

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 5).map((tag, idx) => (
              <span 
                key={idx}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${TAG_COLORS[tag] || 'bg-gray-700/50 text-gray-400 border-gray-600'}`}
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 5 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-400 border border-gray-600">
                +{article.tags.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="flex-1 mb-4">
          {(article.translatedSummary || article.summary) && (
            <div className="p-4 bg-gray-800/30 border-l-2 border-pink-500/50 rounded">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Summary</span>
              </div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3">
                {article.translatedSummary || article.summary}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {article.publishedAt && (
              <div className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: zhCN })}</span>
              </div>
            )}
          </div>
          {article.status === 'completed' && (
            <Link 
              href={`/article/${article.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 rounded-xl text-sm font-medium border border-pink-500/30 transition-all group/link"
            >
              阅读全文
              <ArrowRightIcon className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

// Magazine 布局的中等卡片
function MediumCard({ article, onDelete, isDeleting }: { article: Article, onDelete: (id: string) => void, isDeleting: boolean }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <article className="group relative bg-gray-900 rounded-2xl border border-gray-700/50 hover:border-pink-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/5 h-full flex flex-col">
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {article.authorUsername && (
              <span className="inline-flex items-center px-2.5 py-1 bg-pink-500/10 text-pink-400 rounded-full text-xs font-semibold border border-pink-500/20">
                @{article.authorUsername}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
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
        <Link href={article.status === 'completed' ? `/article/${article.id}` : '#'} className="block mb-3">
          <h3 className="text-lg font-bold text-gray-100 line-clamp-2 group-hover:text-pink-400 transition-colors cursor-pointer leading-snug">
            {article.title || 'Untitled'}
          </h3>
        </Link>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${TAG_COLORS[tag] || 'bg-gray-700/50 text-gray-400 border-gray-600'}`}
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-400 border border-gray-600">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="flex-1">
          {(article.translatedSummary || article.summary) && (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
              {article.translatedSummary || article.summary}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-800/50">
          <div className="text-xs text-gray-500">
            {article.publishedAt && formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: zhCN })}
          </div>
          {article.status === 'completed' && (
            <Link 
              href={`/article/${article.id}`}
              className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors group/link"
            >
              阅读
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 获取用户状态
  const userStatus = (session?.user as any)?.status

  // 未登录重定向到登录页
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // 显示加载状态
  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ArticleCardSkeleton size="large" />
              <ArticleCardSkeleton size="medium" />
            </div>
          </div>
        </div>
      </>
    )
  }

  // 待审核用户显示等待页面
  if (userStatus === 'pending') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center">
              {/* 动画图标 */}
              <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <ClockIcon className="w-10 h-10 text-yellow-400 animate-pulse" />
              </div>

              {/* 标题 */}
              <h1 className="text-3xl font-bold text-gray-100 mb-4">
                账号等待审核
              </h1>

              {/* 说明 */}
              <div className="space-y-4 text-gray-400 mb-8">
                <p className="text-lg">
                  您的账号正在等待管理员审核
                </p>
                <p className="text-sm">
                  审核通过后，您将可以浏览所有文章内容。<br/>
                  请耐心等待，或联系管理员获取帮助。
                </p>
              </div>

              {/* 状态卡片 */}
              <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
                  <span className="text-yellow-400 font-semibold">等待审核中</span>
                </div>
                <p className="text-gray-500 text-sm">
                  当前账号: {session?.user?.email || session?.user?.name || '未知用户'}
                </p>
              </div>

              {/* 退出登录按钮 */}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // 已拒绝用户显示拒绝页面
  if (userStatus === 'rejected') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 border border-red-900/50 rounded-3xl p-12 text-center">
              {/* 动画图标 */}
              <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
                <XCircleIcon className="w-10 h-10 text-red-400" />
              </div>

              {/* 标题 */}
              <h1 className="text-3xl font-bold text-gray-100 mb-4">
                账号已被拒绝
              </h1>

              {/* 说明 */}
              <div className="space-y-4 text-gray-400 mb-8">
                <p className="text-lg">
                  您的账号审核未通过
                </p>
                <p className="text-sm">
                  很抱歉，您的账号访问请求已被拒绝。<br/>
                  如有疑问，请联系管理员。
                </p>
              </div>

              {/* 退出登录按钮 */}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  useEffect(() => {
    if (status === 'authenticated' && userStatus === 'approved') {
      fetchArticles()
    }
  }, [status, userStatus])

  async function fetchArticles() {
    try {
      const res = await fetch('/api/articles')
      if (res.ok) {
        const data = await res.json()
        setArticles(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这篇文章吗？')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setArticles(prev => prev.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setDeletingId(null)
    }
  }

  // 获取所有标签
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    articles.forEach(article => {
      if (article.tags) {
        article.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [articles])

  // 筛选文章
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchTitle = article.title?.toLowerCase().includes(query)
        const matchAuthor = article.author?.toLowerCase().includes(query)
        const matchSummary = (article.translatedSummary || article.summary || '').toLowerCase().includes(query)
        if (!matchTitle && !matchAuthor && !matchSummary) return false
      }

      // 状态过滤
      if (filterType === 'completed' && article.status !== 'completed') return false
      if (filterType === 'processing' && article.status === 'completed') return false

      // 标签过滤
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some(tag => article.tags?.includes(tag))
        if (!hasMatchingTag) return false
      }

      return true
    })
  }, [articles, searchQuery, filterType, selectedTags])

  // Magazine 布局：1个大卡片 + 多个中等卡片
  const featuredArticle = filteredArticles[0]
  const otherArticles = filteredArticles.slice(1)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 搜索和筛选栏 */}
          <div className="mb-8 space-y-4">
            {/* 搜索框 */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索文章、作者..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
                />
              </div>
              
              {/* 状态筛选 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-pink-500/10 text-pink-400 border-2 border-pink-500/30'
                      : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setFilterType('completed')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterType === 'completed'
                      ? 'bg-pink-500/10 text-pink-400 border-2 border-pink-500/30'
                      : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  已完成
                </button>
                <button
                  onClick={() => setFilterType('processing')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterType === 'processing'
                      ? 'bg-pink-500/10 text-pink-400 border-2 border-pink-500/30'
                      : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  处理中
                </button>
              </div>
            </div>

            {/* 标签筛选 */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <TagIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selectedTags.includes(tag)
                        ? TAG_COLORS[tag] || 'bg-pink-500/10 text-pink-400 border-pink-500/30'
                        : 'bg-gray-900 text-gray-500 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all"
                  >
                    清除筛选
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Magazine 布局 */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <SparklesIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">暂无文章</h3>
              <p className="text-gray-600">
                {searchQuery || selectedTags.length > 0 ? '没有匹配的文章' : '还没有任何文章'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 大卡片 */}
              {featuredArticle && (
                <div className="mb-6">
                  <FeaturedCard 
                    article={featuredArticle} 
                    onDelete={handleDelete}
                    isDeleting={deletingId === featuredArticle.id}
                  />
                </div>
              )}

              {/* 中等卡片网格 */}
              {otherArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherArticles.map(article => (
                    <MediumCard
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
        </div>
      </div>
    </>
  )
}

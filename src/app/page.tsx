'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Article } from '@/lib/types'
import { formatDistanceToNow, format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ClockIcon, ArrowRightIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline'

// 柔和的标签颜色映射 - 灰色底 + 淡色文字
const TAG_VARIANTS = {
  primary: 'bg-gray-800/30 text-pink-300 border-gray-700/30 hover:bg-gray-700/40 hover:border-pink-500/20',
  secondary: 'bg-gray-800/30 text-purple-300 border-gray-700/30 hover:bg-gray-700/40 hover:border-purple-500/20',
  accent: 'bg-gray-800/30 text-cyan-300 border-gray-700/30 hover:bg-gray-700/40 hover:border-cyan-500/20',
}

function getTagVariant(tag: string): string {
  if (tag.includes('Claude') || tag === '晨报') return TAG_VARIANTS.primary
  if (tag.includes('开发') || tag.includes('教程')) return TAG_VARIANTS.secondary
  return TAG_VARIANTS.accent
}

function NewsCard({ item, isFirst = false }: { item: Article; isFirst?: boolean }) {
  const tags = item.tags || []
  
  return (
    <article 
      className={`group relative ${isFirst ? 'pb-16 mb-12 border-b border-gray-800/50' : 'py-12'}`}
      style={{
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      {/* Decorative line */}
      <div className="absolute left-0 top-0 w-0.5 h-0 bg-gradient-to-b from-pink-500 to-transparent group-hover:h-full transition-all duration-500 ease-out" />
      
      <div className="pl-6">
        {/* Date with icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 text-gray-500">
            <ClockIcon className="w-4 h-4" />
            <time className="text-sm font-medium">
              {item.publishedAt ? format(new Date(item.publishedAt), 'MM月dd日 HH:mm', { locale: zhCN }) : ''}
            </time>
          </div>
          {isFirst && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-pink-500/10 text-pink-400 text-xs font-semibold rounded-full border border-pink-500/20">
              <SparklesIcon className="w-3 h-3" />
              今日焦点
            </span>
          )}
        </div>
        
        {/* Title with gradient hover */}
        <h2 className={`font-bold text-gray-100 mb-5 transition-all duration-300 ${isFirst ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400`}>
          {item.title || '无标题'}
        </h2>
        
        {/* Author badge */}
        {item.authorUsername && (
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-0.5">
                <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {item.authorUsername[0].toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950" />
            </div>
            <span className="text-sm text-gray-400 font-medium hover:text-pink-400 transition-colors cursor-pointer">
              @{item.authorUsername}
            </span>
          </div>
        )}
        
        {/* Tags with smooth animation */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, 5).map((tag, i) => (
              <span 
                key={tag}
                style={{ animationDelay: `${i * 0.1}s` }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer ${getTagVariant(tag)} hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20`}
              >
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-800/50 text-gray-500 border border-gray-700/50">
                +{tags.length - 5}
              </span>
            )}
          </div>
        )}
        
        {/* Summary with better typography */}
        {item.summary && (
          <blockquote className="relative pl-5 mb-6 border-l-2 border-pink-500/30">
            <p className="text-lg text-gray-400 leading-relaxed font-medium italic">
              {item.summary}
            </p>
          </blockquote>
        )}
        
        {/* Content preview with fade */}
        {item.content && (
          <div className="text-gray-500 leading-relaxed mb-8 relative">
            <p className="text-base line-clamp-4 mb-0">
              {item.content.substring(0, 400)}...
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
          </div>
        )}
        
        {/* Enhanced CTA */}
        {item.url && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/30 hover:scale-105 group/btn"
          >
            <BookOpenIcon className="w-5 h-5" />
            <span>阅读完整文章</span>
            <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        )}
      </div>
    </article>
  )
}

function LoadingSkeleton() {
  return (
    <div className="py-12 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-4 w-32 bg-gray-800 rounded-lg"></div>
      </div>
      <div className="h-12 bg-gray-800 rounded-xl w-3/4"></div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-gray-800 rounded-full"></div>
        <div className="h-4 w-24 bg-gray-800 rounded-lg"></div>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-7 w-20 bg-gray-800 rounded-full"></div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-800 rounded-lg w-full"></div>
        <div className="h-4 bg-gray-800 rounded-lg w-11/12"></div>
        <div className="h-4 bg-gray-800 rounded-lg w-10/12"></div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-32 text-center">
      {/* Animated icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 mb-8 relative">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-xl animate-pulse"></div>
        <BookOpenIcon className="w-12 h-12 text-pink-400 relative z-10" />
      </div>
      
      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent mb-4">
        晨报即将到来
      </h2>
      
      <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
        每日 <span className="text-pink-500 font-bold text-xl">8:00</span> 准时推送<br />
        <span className="text-sm text-gray-500">精选 Claude 资讯 · 告别信息过载</span>
      </p>
      
      {/* Feature tags */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { icon: '🎯', text: 'Claude 新功能' },
          { icon: '💡', text: '实用技巧' },
          { icon: '📚', text: '开发教程' }
        ].map((f, i) => (
          <div 
            key={i}
            style={{ animationDelay: `${i * 0.15}s` }}
            className="flex items-center gap-2 px-5 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-300 transition-all duration-300 border border-gray-700/50 hover:border-gray-600 hover:scale-105"
          >
            <span className="text-lg">{f.icon}</span>
            <span className="font-medium">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/morning-news?limit=30')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setArticles(data.data || [])
      } catch (error) {
        console.error('Error:', error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const totalPages = Math.ceil(articles.length / itemsPerPage)
  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        
        {/* Hero Section */}
        <header className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/20 mb-6">
              <ClockIcon className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-semibold text-pink-400">每日 8:00 更新</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              每日晨报 🌅
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              精选 Claude 最新动态 · 一杯咖啡的时间掌握前沿
            </p>
          </div>
        </header>
        
        {/* Content */}
        <main className="max-w-3xl mx-auto px-6 py-12">
          {loading ? (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : articles.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {paginatedArticles.map((item, index) => (
                <NewsCard 
                  key={item.id} 
                  item={item} 
                  isFirst={index === 0 && currentPage === 1}
                />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-3 mt-16 pt-12 border-t border-gray-800">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    上一页
                  </button>
                  <span className="px-5 py-3 text-gray-400 font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500 hover:shadow-lg hover:shadow-pink-500/30"
                  >
                    下一页
                  </button>
                </nav>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

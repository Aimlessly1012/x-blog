import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '@/components/Navbar'
import SplitView from '@/components/SplitView'
import { getArticleById } from '@/lib/db'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params
  const article = getArticleById(id)
  
  if (!article) {
    notFound()
  }
  
  const hasTranslation = article.translatedContent && article.content && article.content !== article.translatedContent
  const displaySummary = article.translatedSummary || article.summary

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Title Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
          {/* Author Badge */}
          <div className="flex items-center gap-3 mb-4">
            {article.authorUsername && (
              <div className="bg-pink-600/20 text-pink-400 px-3 py-1 rounded-full text-sm font-medium">
                @{article.authorUsername}
              </div>
            )}
            {article.author && article.authorUsername !== article.author && (
              <span className="text-gray-500 text-sm">{article.author}</span>
            )}
            {article.publishedAt && (
              <span className="text-gray-500 text-xs">
                {formatDistanceToNow(new Date(article.publishedAt), {
                  addSuffix: true,
                  locale: zhCN
                })}
              </span>
            )}
            {article.originalLanguage && (
              <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-xs">
                {article.originalLanguage === 'zh' ? '中文' : article.originalLanguage === 'en' ? 'English' : article.originalLanguage}
              </span>
            )}
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 text-xs flex items-center gap-1 ml-auto"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                原地址
              </a>
            )}
          </div>
          
          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
            {article.title || 'Untitled'}
          </h1>
        </div>

        {/* Split View - Side by Side with Sync Scroll */}
        {hasTranslation ? (
          <SplitView 
            originalContent={article.content || ''}
            translatedContent={article.translatedContent || ''}
            summary={displaySummary}
          />
        ) : (
          /* Fallback: Single column view */
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            {displaySummary && (
              <div className="bg-pink-900/20 rounded-xl p-5 mb-6 border border-pink-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                  <span className="text-xs font-semibold text-pink-400 uppercase tracking-wide">
                    Summary
                  </span>
                </div>
                <div className="text-gray-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {displaySummary}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            <div className="prose prose-invert max-w-none text-base leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.translatedContent || article.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Meta Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xs">
            添加于 {new Date(article.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </main>
    </div>
  )
}

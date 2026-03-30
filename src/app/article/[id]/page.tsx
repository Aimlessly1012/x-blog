import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Title Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.authorUsername && (
              <span className="inline-flex items-center px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                @{article.authorUsername}
              </span>
            )}
            {article.originalLanguage && (
              <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                {article.originalLanguage === 'zh' ? '🇨🇳 中文' : article.originalLanguage === 'en' ? '🇬🇧 English' : article.originalLanguage}
              </span>
            )}
            {article.publishedAt && (
              <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs border border-gray-200">
                🕐 {formatDistanceToNow(new Date(article.publishedAt), {
                  addSuffix: true,
                  locale: zhCN
                })}
              </span>
            )}
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full text-xs font-medium border border-pink-200 hover:bg-pink-100 transition-colors ml-auto"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                原地址
              </a>
            )}
          </div>
          
          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
            {article.title || '无标题'}
          </h1>
          
          {/* Author */}
          {article.author && article.authorUsername !== article.author && (
            <p className="text-gray-500 text-sm mt-2">作者：{article.author}</p>
          )}
        </div>

        {/* Split View or Single Column */}
        {hasTranslation ? (
          <SplitView 
            originalContent={article.content || ''}
            translatedContent={article.translatedContent || ''}
          />
        ) : (
          /* Single column view */
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="prose prose-gray max-w-none text-base leading-relaxed">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {article.translatedContent || article.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Meta Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            添加于 {new Date(article.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </main>
    </div>
  )
}

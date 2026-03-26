'use client'

import { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface SplitViewProps {
  originalContent: string
  translatedContent: string
  summary?: string | null
}

export default function SplitView({ originalContent, translatedContent, summary }: SplitViewProps) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  useEffect(() => {
    const left = leftRef.current
    const right = rightRef.current
    if (!left || !right) return

    const handleLeftScroll = () => {
      if (isScrolling.current) return
      isScrolling.current = true
      
      const { scrollTop, scrollHeight, clientHeight } = left
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
      right.scrollTop = scrollPercentage * (right.scrollHeight - right.clientHeight)
      
      requestAnimationFrame(() => {
        isScrolling.current = false
      })
    }

    const handleRightScroll = () => {
      if (isScrolling.current) return
      isScrolling.current = true
      
      const { scrollTop, scrollHeight, clientHeight } = right
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
      left.scrollTop = scrollPercentage * (left.scrollHeight - left.clientHeight)
      
      requestAnimationFrame(() => {
        isScrolling.current = false
      })
    }

    left.addEventListener('scroll', handleLeftScroll)
    right.addEventListener('scroll', handleRightScroll)

    return () => {
      left.removeEventListener('scroll', handleLeftScroll)
      right.removeEventListener('scroll', handleRightScroll)
    }
  }, [])

  return (
    <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
      {/* Left: Original */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-800 bg-gray-800/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-200">English</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs text-gray-500">原文</span>
          </div>
        </div>
        <div 
          ref={leftRef}
          className="flex-1 overflow-y-auto p-5"
        >
          <div className="prose prose-invert max-w-none text-base leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {originalContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Right: Translation */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-800 bg-pink-900/20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-pink-400">中文</span>
            <span className="text-pink-700">·</span>
            <span className="text-xs text-pink-500">译文/总结</span>
          </div>
        </div>
        <div 
          ref={rightRef}
          className="flex-1 overflow-y-auto p-5"
        >
          {summary && (
            <div className="bg-pink-900/20 rounded-xl p-4 mb-5 border border-pink-800/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wide">
                  Summary
                </span>
              </div>
              <div className="text-gray-300 text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {summary}
                </ReactMarkdown>
              </div>
            </div>
          )}
          <div className="prose prose-invert max-w-none text-base leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {translatedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

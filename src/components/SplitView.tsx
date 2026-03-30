'use client'

import { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface SplitViewProps {
  originalContent: string
  translatedContent: string
}

export default function SplitView({ originalContent, translatedContent }: SplitViewProps) {
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
    <div className="grid md:grid-cols-2 gap-6 min-h-[500px]">
      {/* Left: Original */}
      <div className="bg-gray-950 rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-300">English</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">原文</span>
          </div>
        </div>
        <div 
          ref={leftRef}
          className="flex-1 overflow-y-auto p-5"
        >
          <div className="prose prose-gray max-w-none text-base leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {originalContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Right: Translation */}
      <div className="bg-gray-950 rounded-2xl border border-gray-700 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-800 bg-pink-50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-pink-700">中文</span>
            <span className="text-pink-300">·</span>
            <span className="text-xs text-pink-500">译文/总结</span>
          </div>
        </div>
        <div 
          ref={rightRef}
          className="flex-1 overflow-y-auto p-5"
        >
          <div className="prose prose-gray max-w-none text-base leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {translatedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

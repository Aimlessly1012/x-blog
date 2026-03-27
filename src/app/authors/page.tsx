'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import Navbar from '@/components/Navbar'
import { useState } from 'react'

interface Author {
  username: string
  displayName: string
  bio: string
  avatar: string
  specialties: string[]
}

const AUTHORS: Author[] = [
  {
    username: 'nash_su',
    displayName: 'Nash Su',
    bio: 'AI 研究者与实践者，专注于大模型应用与 Prompt Engineering',
    avatar: 'https://unavatar.io/twitter/nash_su',
    specialties: ['AI Research', 'Prompt Engineering', 'LLM Applications']
  },
  {
    username: 'affaanmustafa',
    displayName: 'Affaan Mustafa',
    bio: 'Product Manager，AI 工具爱好者，分享实用的 AI 工作流',
    avatar: 'https://unavatar.io/twitter/affaanmustafa',
    specialties: ['Product Management', 'AI Workflows', 'Productivity']
  },
  {
    username: 'Voxyz_ai',
    displayName: 'Voxyz AI',
    bio: 'AI 技术解析与教程，帮助开发者快速上手 Claude 和 OpenAI',
    avatar: 'https://unavatar.io/twitter/Voxyz_ai',
    specialties: ['AI Tutorials', 'Claude', 'OpenAI']
  },
  {
    username: 'zodchiii',
    displayName: 'Dark Zodchi',
    bio: 'Prompt 技巧大师，分享 Claude 高级用法与最佳实践',
    avatar: 'https://unavatar.io/twitter/zodchiii',
    specialties: ['Prompt Techniques', 'Claude Tips', 'Best Practices']
  },
  {
    username: 'heynavtoor',
    displayName: 'Nav Toor',
    bio: 'Context Engineering 先驱，探索 AI Agent 的新边界',
    avatar: 'https://unavatar.io/twitter/heynavtoor',
    specialties: ['Context Engineering', 'AI Agent', 'Innovation']
  },
  {
    username: 'PandaTalk8',
    displayName: 'Mr Panda',
    bio: 'Skill 开发与商业化专家，分享 AI 变现经验',
    avatar: 'https://unavatar.io/twitter/PandaTalk8',
    specialties: ['Skill Development', 'Monetization', 'Business']
  },
  {
    username: 'LawrenceW_Zen',
    displayName: '劳伦斯',
    bio: '从零构建 Agent Team，分享实战经验与技术细节',
    avatar: 'https://unavatar.io/twitter/LawrenceW_Zen',
    specialties: ['Agent Team', 'Tutorials', 'Tech Deep Dive']
  },
  {
    username: 'Khazix0918',
    displayName: 'Khazix',
    bio: '开发者工具推荐与效率提升，分享前沿插件与脚本',
    avatar: 'https://unavatar.io/twitter/Khazix0918',
    specialties: ['Dev Tools', 'Plugins', 'Efficiency']
  },
  {
    username: 'bindureddy',
    displayName: 'Bindu Reddy',
    bio: 'AI 创业者与产品专家，关注 AI 产品化与商业落地',
    avatar: 'https://unavatar.io/twitter/bindureddy',
    specialties: ['AI Startup', 'Product', 'Business']
  },
  {
    username: 'rowancheung',
    displayName: 'Rowan Cheung',
    bio: 'AI 资讯达人，每日分享最新 AI 动态与工具推荐',
    avatar: 'https://unavatar.io/twitter/rowancheung',
    specialties: ['AI News', 'Tool Reviews', 'Daily Updates']
  },
  {
    username: 'jackclarkSF',
    displayName: 'Jack Clark',
    bio: 'Anthropic 联合创始人，分享 AI 安全与技术趋势',
    avatar: 'https://unavatar.io/twitter/jackclarkSF',
    specialties: ['AI Safety', 'Anthropic', 'Tech Trends']
  },
  {
    username: 'alexalbert__',
    displayName: 'Alex Albert',
    bio: 'Anthropic 产品经理，深度解析 Claude 功能与应用场景',
    avatar: 'https://unavatar.io/twitter/alexalbert__',
    specialties: ['Claude Product', 'Use Cases', 'Anthropic']
  }
]

export default function AuthorsPage() {
  const [authorUrl, setAuthorUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证 URL 格式
    const twitterUrlPattern = /^https?:\/\/(x\.com|twitter\.com)\/([a-zA-Z0-9_]+)\/?$/
    const match = authorUrl.match(twitterUrlPattern)
    
    if (!match) {
      setMessage({ type: 'error', text: '请输入有效的 X/Twitter 用户链接（例如：https://x.com/username）' })
      return
    }
    
    const username = match[2]
    setIsSubmitting(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/recommend-author', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: authorUrl, submittedBy: 'web' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '提交失败')
      }
      
      setMessage({ 
        type: 'success', 
        text: data.message || `感谢推荐 @${username}！我们会尽快审核并添加到列表中 🎉` 
      })
      setAuthorUrl('')
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || '提交失败，请稍后重试' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <Navbar />
      {/* Header Section */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              🐦 X 热门博主
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              探索 AI 领域最活跃的创作者，获取第一手的技术洞察与实践经验
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-800/50 rounded-full">
                {AUTHORS.length} 位博主
              </span>
              <span>·</span>
              <span>持续更新中</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUTHORS.map((author) => (
            <a
              key={author.username}
              href={`https://x.com/${author.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 hover:scale-[1.02] cursor-pointer overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative space-y-4">
                {/* Avatar + Name */}
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-0.5 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={author.avatar}
                        alt={author.displayName}
                        className="w-full h-full rounded-full object-cover bg-gray-800"
                        loading="lazy"
                        onError={(e) => {
                          // 如果头像加载失败，显示首字母
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                      <div className="hidden w-full h-full rounded-full bg-gray-800 items-center justify-center text-2xl font-bold text-pink-400">
                        {author.displayName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    {/* Online Badge */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 group-hover:scale-125 transition-transform duration-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-100 group-hover:text-pink-400 transition-colors truncate">
                      {author.displayName}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <span>@{author.username}</span>
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                  {author.bio}
                </p>

                {/* Specialties Tags */}
                <div className="flex flex-wrap gap-2">
                  {author.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 text-xs bg-gray-800/50 text-gray-400 rounded-lg border border-gray-700/50 group-hover:border-pink-500/30 group-hover:text-pink-400 transition-all"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Visit Button */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 group-hover:text-pink-400 transition-colors font-medium">
                      访问主页
                    </span>
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-600 group-hover:text-pink-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recommendation Form */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/20 rounded-2xl p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-100">
                推荐优质博主
              </h2>
              <p className="text-gray-400">
                发现值得关注的 AI 领域创作者？提交他们的 X/Twitter 链接吧
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={authorUrl}
                  onChange={(e) => setAuthorUrl(e.target.value)}
                  placeholder="https://x.com/username"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !authorUrl}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>提交中...</span>
                    </>
                  ) : (
                    <>
                      <span>提交推荐</span>
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Success/Error Message */}
              {message && (
                <div
                  className={`p-4 rounded-xl border ${
                    message.type === 'success'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              {/* Example */}
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <span className="text-gray-600">💡</span>
                <div>
                  <span className="font-medium text-gray-400">示例：</span>
                  <span className="ml-2">https://x.com/alexalbert__ 或 https://twitter.com/jackclarkSF</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

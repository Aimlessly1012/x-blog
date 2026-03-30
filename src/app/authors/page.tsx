'use client'

import { ArrowTopRightOnSquareIcon, UserPlusIcon } from '@heroicons/react/24/outline'
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

// 统一标签颜色
const SPECIALTY_COLORS: Record<string, string> = {
  'AI Research': 'bg-purple-100 text-purple-700',
  'Prompt Engineering': 'bg-pink-100 text-pink-700',
  'LLM Applications': 'bg-indigo-100 text-indigo-700',
  'Product Management': 'bg-blue-100 text-blue-700',
  'AI Workflows': 'bg-cyan-100 text-cyan-700',
  'Productivity': 'bg-emerald-100 text-emerald-700',
  'AI Tutorials': 'bg-orange-100 text-orange-700',
  'Claude': 'bg-violet-100 text-violet-700',
  'OpenAI': 'bg-gray-800 text-gray-300',
  'Prompt Techniques': 'bg-pink-100 text-pink-700',
  'Claude Tips': 'bg-violet-100 text-violet-700',
  'Best Practices': 'bg-rose-100 text-rose-700',
  'Context Engineering': 'bg-teal-100 text-teal-700',
  'AI Agent': 'bg-cyan-100 text-cyan-700',
  'Innovation': 'bg-yellow-100 text-yellow-700',
  'Skill Development': 'bg-lime-100 text-lime-700',
  'Monetization': 'bg-amber-100 text-amber-700',
  'Business': 'bg-orange-100 text-orange-700',
  'Agent Team': 'bg-blue-100 text-blue-700',
  'Tutorials': 'bg-orange-100 text-orange-700',
  'Tech Deep Dive': 'bg-indigo-100 text-indigo-700',
  'Dev Tools': 'bg-sky-100 text-sky-700',
  'Plugins': 'bg-violet-100 text-violet-700',
  'Efficiency': 'bg-green-100 text-green-700',
  'AI Startup': 'bg-pink-100 text-pink-700',
  'Product': 'bg-blue-100 text-blue-700',
  'AI News': 'bg-cyan-100 text-cyan-700',
  'Tool Reviews': 'bg-gray-800 text-gray-300',
  'Daily Updates': 'bg-yellow-100 text-yellow-700',
  'AI Safety': 'bg-red-100 text-red-700',
  'Anthropic': 'bg-orange-100 text-orange-700',
  'Tech Trends': 'bg-indigo-100 text-indigo-700',
  'Claude Product': 'bg-violet-100 text-violet-700',
  'Use Cases': 'bg-teal-100 text-teal-700',
}

function getSpecialtyClass(specialty: string) {
  return SPECIALTY_COLORS[specialty] || 'bg-gray-800 text-gray-400'
}

function AuthorCard({ author }: { author: Author }) {
  return (
    <a
      href={`https://x.com/${author.username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-gray-950 rounded-2xl border border-gray-700 p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 block"
    >
      {/* Avatar + Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-0.5">
            <img
              src={author.avatar}
              alt={author.displayName}
              className="w-full h-full rounded-full object-cover bg-gray-950"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const fallback = e.currentTarget.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            <div className="hidden w-full h-full rounded-full bg-gray-700 items-center justify-center text-xl font-bold text-pink-500">
              {author.displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-100 group-hover:text-pink-600 transition-colors truncate">
            {author.displayName}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span>@{author.username}</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
        {author.bio}
      </p>

      {/* Specialties */}
      <div className="flex flex-wrap gap-2">
        {author.specialties.slice(0, 3).map((specialty) => (
          <span
            key={specialty}
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${getSpecialtyClass(specialty)}`}
          >
            {specialty}
          </span>
        ))}
      </div>
    </a>
  )
}

function RecommendForm() {
  const [authorUrl, setAuthorUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
        text: `感谢推荐 @${username}！我们会尽快审核 🎉` 
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
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-100 mb-2">推荐优质博主</h2>
          <p className="text-gray-500 text-sm">发现值得关注的 AI 领域创作者？提交他们的链接吧</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={authorUrl}
              onChange={(e) => setAuthorUrl(e.target.value)}
              placeholder="https://x.com/username"
              className="input"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !authorUrl}
              className="btn btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                  <UserPlusIcon className="w-5 h-5" />
                  <span>推荐</span>
                </>
              )}
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-xl border text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <p>{message.text}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-100 mb-2">X 热门博主</h1>
            <p className="text-gray-500 text-sm">
              {AUTHORS.length} 位优质创作者 · 持续更新
            </p>
          </div>
        </div>
      </header>

      {/* Authors Grid */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AUTHORS.map((author) => (
            <AuthorCard key={author.username} author={author} />
          ))}
        </div>
      </main>

      {/* Recommend Form */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <RecommendForm />
      </div>
    </div>
  )
}

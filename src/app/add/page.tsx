"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function AddArticlePage() {
  const [verified, setVerified] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [form, setForm] = useState({
    url: '',
    title: '',
    author: '',
    authorUsername: '',
    publishedAt: '',
    content: '',
    translatedContent: '',
    originalLanguage: 'en',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if already verified in this session
    const sessionVerified = sessionStorage.getItem('invite_verified')
    if (sessionVerified === 'true') {
      setVerified(true)
    }
  }, [])

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteCode.trim()) {
      setError('请输入邀请码')
      return
    }

    setVerifying(true)
    setError(null)

    try {
      const response = await fetch('/api/invite-code/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '邀请码验证失败')
      }

      // Store verification in session
      sessionStorage.setItem('invite_verified', 'true')
      setVerified(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '邀请码验证失败')
    } finally {
      setVerifying(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!form.title.trim()) {
      setError('请输入标题')
      return
    }
    
    if (!form.content.trim()) {
      setError('请输入内容')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add article')
      }
      
      // Clear session verification
      sessionStorage.removeItem('invite_verified')
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add article')
    } finally {
      setLoading(false)
    }
  }

  // Show invite code verification form
  if (!verified) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        
        <main className="max-w-md mx-auto px-4 py-16">
          <div className="bg-gray-900 rounded-xl shadow-sm p-8 border border-gray-800">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔑</div>
              <h1 className="text-2xl font-bold text-white mb-2">输入邀请码</h1>
              <p className="text-gray-400 text-sm">需要有效的邀请码才能添加文章</p>
            </div>
            
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="请输入邀请码"
                  className="w-full px-6 py-4 text-center text-xl tracking-widest border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none uppercase"
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={verifying}
                className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {verifying ? '验证中...' : '验证'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <a href="/" className="text-gray-500 hover:text-gray-300 text-sm">
                ← 返回首页
              </a>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Show article form
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">添加文章</h1>
            <button
              onClick={() => {
                sessionStorage.removeItem('invite_verified')
                setVerified(false)
                setInviteCode('')
              }}
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              退出
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">原文链接</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://x.com/username/status/123 (可选)"
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="文章标题"
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">发布日期</label>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">作者</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="作者名称"
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">作者用户名</label>
                <input
                  type="text"
                  value={form.authorUsername}
                  onChange={(e) => setForm({ ...form, authorUsername: e.target.value })}
                  placeholder="@username"
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">原文语言</label>
              <select
                value={form.originalLanguage}
                onChange={(e) => setForm({ ...form, originalLanguage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              >
                <option value="en">英文</option>
                <option value="zh">中文</option>
                <option value="ja">日文</option>
                <option value="ko">韩文</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">原文内容</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="粘贴文章原文内容..."
                rows={10}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">翻译内容（可选）</label>
              <textarea
                value={form.translatedContent}
                onChange={(e) => setForm({ ...form, translatedContent: e.target.value })}
                placeholder="翻译后的中文内容...（可选，如果提供则直接显示翻译版）"
                rows={10}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? '添加中...' : '添加文章'}
              </button>
              
              <a href="/" className="px-6 py-3 text-gray-400 hover:text-white transition-colors">
                取消
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

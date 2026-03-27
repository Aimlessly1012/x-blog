'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { UserIcon, EnvelopeIcon, CalendarIcon, ShieldCheckIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const user = session.user as any

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            个人中心
          </h1>
          <p className="text-gray-500 mt-2">查看和管理您的账户信息</p>
        </div>

        {/* 用户信息卡片 */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden backdrop-blur-sm">
          {/* 头部背景 */}
          <div className="h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          </div>

          {/* 用户头像 */}
          <div className="px-8 -mt-16 relative">
            <div className="inline-block">
              {user.image ? (
                <div className="relative">
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={120}
                    height={120}
                    className="rounded-full ring-4 ring-gray-900 shadow-xl"
                  />
                  <div className="absolute inset-0 rounded-full ring-2 ring-pink-500/50 animate-pulse"></div>
                </div>
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center ring-4 ring-gray-900 shadow-xl">
                  <UserIcon className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* 用户详细信息 */}
          <div className="px-8 py-6 space-y-6">
            {/* 用户名和状态 */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-100">{user.name || '未设置昵称'}</h2>
                {user.isAdmin && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 rounded-full text-sm font-semibold border border-pink-500/30">
                    <ShieldCheckIcon className="w-4 h-4" />
                    管理员
                  </span>
                )}
                {user.status === 'approved' && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold border border-emerald-500/30">
                    <CheckBadgeIcon className="w-4 h-4" />
                    已认证
                  </span>
                )}
              </div>
              {user.status === 'pending' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/30">
                  <CalendarIcon className="w-5 h-5" />
                  <span>账户审核中，请等待管理员批准</span>
                </div>
              )}
              {user.status === 'rejected' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/30">
                  <span>账户已被拒绝</span>
                </div>
              )}
            </div>

            {/* 信息列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 邮箱 */}
              {user.email && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                      <EnvelopeIcon className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">邮箱地址</p>
                      <p className="text-gray-100 font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* GitHub ID */}
              {user.githubId && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">GitHub 账户</p>
                      <p className="text-gray-100 font-medium">
                        <a 
                          href={`https://github.com/${user.githubId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-pink-400 transition-colors"
                        >
                          查看资料 →
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 账户状态 */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckBadgeIcon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">账户状态</p>
                    <p className="text-gray-100 font-medium">
                      {user.status === 'approved' && '已激活'}
                      {user.status === 'pending' && '待审核'}
                      {user.status === 'rejected' && '已拒绝'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 角色 */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">用户角色</p>
                    <p className="text-gray-100 font-medium">
                      {user.isAdmin ? '管理员' : '普通用户'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="px-8 py-6 bg-gray-800/30 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">账户统计</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-pink-400">0</p>
                <p className="text-sm text-gray-500 mt-1">发布文章</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">0</p>
                <p className="text-sm text-gray-500 mt-1">收藏文章</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">0</p>
                <p className="text-sm text-gray-500 mt-1">推荐作者</p>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        {user.isAdmin && (
          <div className="mt-8 bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">管理员操作</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/admin/users"
                className="group flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-pink-500/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                  <UserIcon className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-100 group-hover:text-pink-400 transition-colors">用户管理</p>
                  <p className="text-sm text-gray-500">审核和管理用户</p>
                </div>
              </a>

              <a
                href="/admin/recommendations"
                className="group flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <ShieldCheckIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-100 group-hover:text-purple-400 transition-colors">推荐审核</p>
                  <p className="text-sm text-gray-500">审核作者推荐</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

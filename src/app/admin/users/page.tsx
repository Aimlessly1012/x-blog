'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface User {
  id: string
  github_id: string | null
  google_id: string | null
  name: string | null
  email: string | null
  image: string | null
  status: 'pending' | 'approved' | 'rejected'
  is_admin: number
  created_at: string
  updated_at: string
}

export default function UsersManagementPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const isAdmin = (session?.user as any)?.isAdmin

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push('/')
    }
  }, [isAdmin, loading, router])

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateUserStatus(userId: string, status: 'approved' | 'rejected' | 'pending') {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || '更新失败')
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('更新失败')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const pendingUsers = users.filter(u => u.status === 'pending')
  const approvedUsers = users.filter(u => u.status === 'approved')
  const rejectedUsers = users.filter(u => u.status === 'rejected')

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
            用户管理
          </h1>
          <p className="text-gray-500">管理用户访问权限和账户状态</p>
        </div>

        {/* 待审核 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-yellow-400" />
            待审核 ({pendingUsers.length})
          </h2>
          {pendingUsers.length === 0 ? (
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <ClockIcon className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500">暂无待审核用户</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onApprove={() => updateUserStatus(user.id, 'approved')}
                  onReject={() => updateUserStatus(user.id, 'rejected')}
                />
              ))}
            </div>
          )}
        </section>

        {/* 已批准 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
            已批准 ({approvedUsers.length})
          </h2>
          {approvedUsers.length === 0 ? (
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <CheckCircleIcon className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500">暂无已批准用户</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvedUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onRevoke={() => updateUserStatus(user.id, 'rejected')}
                  showRevoke
                />
              ))}
            </div>
          )}
        </section>

        {/* 已拒绝 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <XCircleIcon className="w-6 h-6 text-red-400" />
            已拒绝 ({rejectedUsers.length})
          </h2>
          {rejectedUsers.length === 0 ? (
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <XCircleIcon className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500">暂无已拒绝用户</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rejectedUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onApprove={() => updateUserStatus(user.id, 'approved')}
                  showApprove
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function UserCard({
  user,
  onApprove,
  onReject,
  onRevoke,
  showRevoke,
  showApprove,
}: {
  user: User
  onApprove?: () => void
  onReject?: () => void
  onRevoke?: () => void
  showRevoke?: boolean
  showApprove?: boolean
}) {
  const authProvider = user.github_id ? 'GitHub' : user.google_id ? 'Google' : '未知'
  const authId = user.github_id || user.google_id || '无'

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-gray-700 group-hover:ring-pink-500/50 transition-all"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center ring-2 ring-gray-700">
              <span className="text-white font-semibold">
                {user.name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-100">{user.name || '未知用户'}</h3>
              {user.is_admin === 1 && (
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded-full text-xs font-semibold border border-pink-500/30">
                  管理员
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                authProvider === 'GitHub' 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {authProvider}
              </span>
            </div>
            <p className="text-sm text-gray-400">{user.email || '无邮箱'}</p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-xs text-gray-600">
                ID: <span className="font-mono">{user.id}</span>
              </p>
              <p className="text-xs text-gray-600">
                注册: {new Date(user.created_at).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onApprove && (
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all font-medium border border-emerald-500/30 hover:scale-105 active:scale-95"
            >
              {showApprove ? '重新批准' : '批准'}
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all font-medium border border-red-500/30 hover:scale-105 active:scale-95"
            >
              拒绝
            </button>
          )}
          {showRevoke && onRevoke && (
            <button
              onClick={onRevoke}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all font-medium hover:scale-105 active:scale-95"
            >
              撤销
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

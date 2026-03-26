'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface User {
  google_id: string
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
        alert('更新失败')
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
          <div className="text-gray-400">加载中...</div>
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
          <h1 className="text-3xl font-bold text-gray-100 mb-2">用户管理</h1>
          <p className="text-gray-500">管理用户访问权限</p>
        </div>

        {/* 待审核 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-yellow-400" />
            待审核 ({pendingUsers.length})
          </h2>
          {pendingUsers.length === 0 ? (
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              暂无待审核用户
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map(user => (
                <UserCard
                  key={user.google_id}
                  user={user}
                  onApprove={() => updateUserStatus(user.google_id, 'approved')}
                  onReject={() => updateUserStatus(user.google_id, 'rejected')}
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
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              暂无已批准用户
            </div>
          ) : (
            <div className="space-y-3">
              {approvedUsers.map(user => (
                <UserCard
                  key={user.google_id}
                  user={user}
                  onRevoke={() => updateUserStatus(user.google_id, 'rejected')}
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
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center text-gray-500">
              暂无已拒绝用户
            </div>
          ) : (
            <div className="space-y-3">
              {rejectedUsers.map(user => (
                <UserCard
                  key={user.google_id}
                  user={user}
                  onApprove={() => updateUserStatus(user.google_id, 'approved')}
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
  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user.image && (
            <img
              src={user.image}
              alt={user.name || 'User'}
              className="w-12 h-12 rounded-full ring-2 ring-gray-700"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-100">{user.name || '未知用户'}</h3>
              {user.is_admin === 1 && (
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded text-xs font-semibold">
                  管理员
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-600 mt-1">
              注册时间: {new Date(user.created_at).toLocaleString('zh-CN')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onApprove && (
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors font-medium border border-emerald-500/30"
            >
              批准
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors font-medium border border-red-500/30"
            >
              拒绝
            </button>
          )}
          {showRevoke && onRevoke && (
            <button
              onClick={onRevoke}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              撤销
            </button>
          )}
          {showApprove && onApprove && (
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors font-medium border border-emerald-500/30"
            >
              重新批准
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

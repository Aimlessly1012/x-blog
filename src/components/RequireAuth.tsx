'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">验证身份中...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  // 检查用户状态
  const userStatus = (session?.user as any)?.status
  const isAdmin = (session?.user as any)?.isAdmin

  if (userStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-md text-center">
          <div className="text-6xl mb-6">⏳</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">等待管理员审核</h2>
          <p className="text-gray-400 mb-6">
            你的账号正在等待管理员审核，审核通过后即可访问。
          </p>
          <p className="text-sm text-gray-500">
            如有疑问，请联系管理员
          </p>
        </div>
      </div>
    )
  }

  if (userStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl border border-red-800/50 p-8 max-w-md text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">申请被拒绝</h2>
          <p className="text-gray-400 mb-6">
            抱歉，你的访问申请未通过审核。
          </p>
          <p className="text-sm text-gray-500">
            如有疑问，请联系管理员
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

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

  // 加载中
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">验证身份中...</p>
        </div>
      </div>
    )
  }

  // 未登录
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">正在跳转到登录页...</p>
        </div>
      </div>
    )
  }

  // 已登录但等待审核
  const user = session?.user as any
  if (user?.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">等待管理员审核</h2>
          <p className="text-gray-400 mb-6">
            你的账号正在等待审核，审核通过后即可访问完整内容。
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
          >
            返回登录页
          </button>
        </div>
      </div>
    )
  }

  // 已登录但被拒绝
  if (user?.status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">申请被拒绝</h2>
          <p className="text-gray-400 mb-6">
            抱歉，你的访问申请未通过审核。如有疑问请联系管理员。
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
          >
            返回登录页
          </button>
        </div>
      </div>
    )
  }

  // 已登录且已批准 - 显示内容
  return <>{children}</>
}

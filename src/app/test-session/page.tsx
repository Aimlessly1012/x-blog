'use client'

import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'

export default function TestSessionPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Session 测试页面</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Session Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-4">
              <span className="text-gray-400 w-32">Status:</span>
              <span className="text-gray-200 font-mono">{status}</span>
            </div>
          </div>
        </div>

        {session && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Session Data</h2>
            <pre className="text-xs text-gray-300 bg-gray-950 p-4 rounded-lg overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}

        {!session && status === 'unauthenticated' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-gray-400">未登录。请先<a href="/login" className="text-pink-400 hover:underline">登录</a>。</p>
          </div>
        )}
      </div>
    </div>
  )
}

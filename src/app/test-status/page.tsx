'use client'

import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'

export default function TestStatusPage() {
  const { data: session, status } = useSession()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">Session Debug</h1>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Status</h2>
              <pre className="text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto">
                {JSON.stringify({ status }, null, 2)}
              </pre>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Session User</h2>
              <pre className="text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto">
                {JSON.stringify(session?.user, null, 2)}
              </pre>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Full Session</h2>
              <pre className="text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">userStatus Variable</h2>
              <pre className="text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto">
                {JSON.stringify((session?.user as any)?.status, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

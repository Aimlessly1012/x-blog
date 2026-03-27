'use client'

import { useSession } from 'next-auth/react'

export default function DebugSession() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Session 调试信息</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <pre className="bg-gray-800 p-4 rounded text-sm overflow-auto">
            {status}
          </pre>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Session Data</h2>
          <pre className="bg-gray-800 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        {session?.user && (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {session.user.name || 'N/A'}</p>
              <p><strong>Email:</strong> {session.user.email || 'N/A'}</p>
              <p><strong>Image:</strong> {session.user.image || 'N/A'}</p>
              {session.user.image && (
                <div>
                  <p className="mb-2"><strong>Avatar Preview:</strong></p>
                  <img 
                    src={session.user.image} 
                    alt="User Avatar" 
                    className="w-24 h-24 rounded-full ring-2 ring-pink-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

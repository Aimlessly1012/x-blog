'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { HomeIcon, UserGroupIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.isAdmin

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.jpg"
              alt="HeiTu Logo"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-pink-500/20 group-hover:ring-pink-500/40 transition-all"
            />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              HeiTu 🐰
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-800/50"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="hidden sm:inline">首页</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin/users"
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-800/50"
              >
                <UserGroupIcon className="w-5 h-5" />
                <span className="hidden sm:inline">用户管理</span>
              </Link>
            )}

            {/* User Menu */}
            {session?.user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-800">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-gray-700"
                  />
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800/50"
                  title="退出登录"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">退出</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

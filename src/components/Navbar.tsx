'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { HomeIcon, UserGroupIcon, ArrowRightOnRectangleIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeSolidIcon, UserIcon as UserSolidIcon, SparklesIcon as SparklesSolidIcon, UserGroupIcon as UserGroupSolidIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAdmin = (session?.user as any)?.isAdmin
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  // 避免 hydration 错误：在客户端 mounted 之前返回静态版本
  if (!mounted) {
    return (
      <nav className="border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="relative">
                  <Image
                    src="/images/logo.jpg"
                    alt="HeiTu Logo"
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-gray-700 group-hover:ring-pink-500 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-pink-500/50"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  HeiTu 🐰
                </span>
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-400 hover:text-pink-400 transition-all text-sm font-medium">
                  首页
                </Link>
                <Link href="/authors" className="text-gray-400 hover:text-pink-400 transition-all text-sm font-medium">
                  X热门博主
                </Link>
                <Link href="/skills" className="text-gray-400 hover:text-pink-400 transition-all text-sm font-medium">
                  Skill相关
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Navigation Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="HeiTu Logo"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-pink-500/20 group-hover:ring-pink-500/50 group-hover:scale-110 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 group-hover:from-pink-300 group-hover:to-purple-300 transition-all">
                HeiTu 🐰
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive('/')
                  ? 'text-pink-400 bg-pink-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              {isActive('/') ? (
                <HomeSolidIcon className="w-5 h-5" />
              ) : (
                <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              <span className="hidden sm:inline font-medium">首页</span>
              {isActive('/') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
              )}
            </Link>

            <Link
              href="/authors"
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive('/authors')
                  ? 'text-pink-400 bg-pink-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              {isActive('/authors') ? (
                <UserSolidIcon className="w-5 h-5" />
              ) : (
                <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              <span className="hidden sm:inline font-medium">X热门博主</span>
              {isActive('/authors') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
              )}
            </Link>

            <Link
              href="/skills"
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive('/skills')
                  ? 'text-pink-400 bg-pink-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              {isActive('/skills') ? (
                <SparklesSolidIcon className="w-5 h-5" />
              ) : (
                <SparklesIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              <span className="hidden sm:inline font-medium">Skill相关</span>
              {isActive('/skills') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
              )}
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/admin/users"
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive('/admin/users')
                      ? 'text-pink-400 bg-pink-500/10'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  {isActive('/admin/users') ? (
                    <UserGroupSolidIcon className="w-5 h-5" />
                  ) : (
                    <UserGroupIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="hidden sm:inline font-medium">用户管理</span>
                  {isActive('/admin/users') && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
                  )}
                </Link>

                <Link
                  href="/admin/recommendations"
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive('/admin/recommendations')
                      ? 'text-pink-400 bg-pink-500/10'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  {isActive('/admin/recommendations') ? (
                    <UserSolidIcon className="w-5 h-5" />
                  ) : (
                    <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="hidden sm:inline font-medium">推荐审核</span>
                  {isActive('/admin/recommendations') && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
                  )}
                </Link>
              </>
            )}
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center">
            {session?.user ? (
              <div className="flex items-center gap-2">
                {session.user.image && (
                  <div className="group relative">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full ring-2 ring-gray-700 group-hover:ring-pink-500/50 transition-all cursor-pointer"
                    />
                    {session.user.name && (
                      <div className="absolute top-full mt-2 right-0 px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {session.user.name}
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="group flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 transition-all rounded-xl hover:bg-red-500/10"
                  title="退出登录"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline font-medium">退出</span>
                </button>
              </div>
            ) : status === 'unauthenticated' ? (
              <Link
                href="/login"
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition-all font-medium"
              >
                登录
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}

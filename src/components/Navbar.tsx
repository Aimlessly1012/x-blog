'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { HomeIcon, UserIcon, SparklesIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeSolidIcon, UserIcon as UserSolidIcon, SparklesIcon as SparklesSolidIcon, NewspaperIcon as NewspaperSolidIcon } from '@heroicons/react/24/solid'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm shadow-gray-100">
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
                  className="rounded-full ring-2 ring-pink-200 group-hover:ring-pink-400 group-hover:scale-110 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300/20 to-purple-300/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 group-hover:from-pink-400 group-hover:to-purple-400 transition-all">
                HeiTu 🐰
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive('/')
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
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
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
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
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
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

              <Link
                href="/articles"
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive('/articles')
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {isActive('/articles') ? (
                  <NewspaperSolidIcon className="w-5 h-5" />
                ) : (
                  <NewspaperIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                <span className="hidden sm:inline font-medium">X精选文章</span>
                {isActive('/articles') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

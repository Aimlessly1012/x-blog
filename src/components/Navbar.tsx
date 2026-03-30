'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { HomeIcon, UserIcon, SparklesIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeSolidIcon,
  UserIcon as UserSolidIcon,
  SparklesIcon as SparklesSolidIcon,
  NewspaperIcon as NewspaperSolidIcon,
} from '@heroicons/react/24/solid'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  const linkBase =
    'group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200'
  const linkActive =
    'text-[var(--ac)] bg-[var(--ac-dim)]'
  const linkIdle =
    'text-[var(--t3)] hover:text-[var(--t1)] hover:bg-white/5'

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(7,8,11,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'var(--bd)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative">
              <Image
                src="/images/logo.jpg"
                alt="HeiTu"
                width={32}
                height={32}
                className="rounded-full ring-1 ring-[var(--ac-dim)] group-hover:ring-[var(--ac-glow)] group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <span
              className="text-base font-bold tracking-tight group-hover:opacity-80 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #f0f2f5 0%, var(--ac) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              HeiTu
            </span>
          </Link>

          {/* Divider */}
          <div className="h-5 w-px" style={{ background: 'var(--bd)' }} />

          {/* Nav Links */}
          <div className="flex items-center gap-0.5">
            <Link href="/" className={`${linkBase} ${isActive('/') ? linkActive : linkIdle}`}>
              {isActive('/') ? (
                <HomeSolidIcon className="w-4 h-4" />
              ) : (
                <HomeIcon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">首页</span>
              {isActive('/') && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: 'var(--ac)' }}
                />
              )}
            </Link>

            <Link href="/articles" className={`${linkBase} ${isActive('/articles') ? linkActive : linkIdle}`}>
              {isActive('/articles') ? (
                <NewspaperSolidIcon className="w-4 h-4" />
              ) : (
                <NewspaperIcon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">精选</span>
              {isActive('/articles') && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: 'var(--ac)' }}
                />
              )}
            </Link>

            <Link href="/skills" className={`${linkBase} ${isActive('/skills') ? linkActive : linkIdle}`}>
              {isActive('/skills') ? (
                <SparklesSolidIcon className="w-4 h-4" />
              ) : (
                <SparklesIcon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Skills</span>
              {isActive('/skills') && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: 'var(--ac)' }}
                />
              )}
            </Link>

            <Link href="/authors" className={`${linkBase} ${isActive('/authors') ? linkActive : linkIdle}`}>
              {isActive('/authors') ? (
                <UserSolidIcon className="w-4 h-4" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">X博主</span>
              {isActive('/authors') && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: 'var(--ac)' }}
                />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

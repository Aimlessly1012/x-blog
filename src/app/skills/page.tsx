'use client'

import Navbar from '@/components/Navbar'
import { SparklesIcon } from '@heroicons/react/24/outline'

export default function SkillsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="w-8 h-8 text-pink-400" />
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Skill 相关
              </h1>
            </div>
            <p className="text-gray-400">
              Agent Skills 开发、使用和商业化相关内容
            </p>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-2 border-pink-500/20 mb-6">
              <SparklesIcon className="w-12 h-12 text-pink-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-300 mb-3">即将上线</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              我们正在整理 Skill 相关资源和教程，敬请期待！
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

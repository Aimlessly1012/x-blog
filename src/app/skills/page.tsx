'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { SparklesIcon, MagnifyingGlassIcon, BookOpenIcon, WrenchIcon, RocketLaunchIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const SKILLS_DATA = [
  { name: 'agent-eval', description: 'Head-to-head comparison of coding agents on custom tasks with pass rate, cost, time, and consistency metrics', category: 'Testing' },
  { name: 'agent-harness-construction', description: 'Design and optimize AI agent action spaces, tool definitions, and observation formatting', category: 'Agent' },
  { name: 'agentic-engineering', description: 'Operate as an agentic engineer using eval-first execution, decomposition, and cost-aware model routing', category: 'Agent' },
  { name: 'agent-payment-x402', description: 'Add x402 payment execution to AI agents — per-task budgets, spending controls, and non-custodial wallets', category: 'Agent' },
  { name: 'ai-first-engineering', description: 'Engineering operating model for teams where AI agents generate a large share of implementation output', category: 'Process' },
  { name: 'ai-regression-testing', description: 'Regression testing strategies for AI-assisted development. Sandbox-mode API testing without database', category: 'Testing' },
  { name: 'android-clean-architecture', description: 'Clean Architecture patterns for Android and Kotlin Multiplatform projects', category: 'Architecture' },
  { name: 'api-design', description: 'REST API design patterns including resource naming, status codes, pagination, filtering, error responses', category: 'Backend' },
  { name: 'architecture-decision-records', description: 'Capture architectural decisions made during Claude Code sessions as structured ADRs', category: 'Documentation' },
  { name: 'article-writing', description: 'Write articles, guides, blog posts, tutorials, newsletter issues, and other long-form content', category: 'Content' },
  { name: 'autonomous-loops', description: 'Patterns and architectures for autonomous Claude Code loops — from simple pipelines to production agents', category: 'Agent' },
  { name: 'backend-patterns', description: 'Backend architecture patterns, API design, database optimization, and server-side best practices', category: 'Backend' },
  { name: 'benchmark', description: 'Measure performance baselines, detect regressions before/after PRs, and compare strategies', category: 'Testing' },
  { name: 'blueprint', description: 'System architecture planning and design patterns for large-scale applications', category: 'Architecture' },
  { name: 'browser-qa', description: 'Automate visual testing and UI interaction verification using browser automation', category: 'Testing' },
  { name: 'bun-runtime', description: 'Bun as runtime, package manager, bundler, and test runner. Migration from Node.js', category: 'Backend' },
  { name: 'canary-watch', description: 'Monitor a deployed URL for regressions after deploys, merges, or dependency upgrades', category: 'DevOps' },
  { name: 'claude-api', description: 'Anthropic Claude API patterns for Python and TypeScript. Covers Messages API, streaming, tool use', category: 'API' },
  { name: 'claude-devfleet', description: 'Orchestrate multi-agent coding tasks via Claude DevFleet — plan projects, dispatch parallel agents', category: 'Agent' },
  { name: 'clickhouse-io', description: 'ClickHouse database patterns, query optimization, analytics, and data engineering', category: 'Database' },
  { name: 'codebase-onboarding', description: 'Analyze an unfamiliar codebase and generate a structured onboarding guide', category: 'Documentation' },
  { name: 'coding-standards', description: 'Universal coding standards, best practices, and patterns for TypeScript, JavaScript, React', category: 'Standards' },
  { name: 'context-budget', description: 'Audit Claude Code context window consumption across agents, skills, MCP servers, and rules', category: 'Optimization' },
  { name: 'cost-aware-llm-pipeline', description: 'Build cost-effective LLM pipelines with smart routing, caching, and budget controls', category: 'Optimization' },
  { name: 'database-migrations', description: 'Schema migration strategies for SQL and NoSQL databases with zero-downtime patterns', category: 'Database' },
  { name: 'deep-research', description: 'Conduct thorough research on any topic using web search, summarization, and synthesis', category: 'Research' },
  { name: 'deployment-patterns', description: 'Deploy applications using modern patterns — containers, serverless, edge computing', category: 'DevOps' },
  { name: 'docker-patterns', description: 'Docker best practices, multi-stage builds, security hardening, and compose orchestration', category: 'DevOps' },
  { name: 'documentation-lookup', description: 'Find and synthesize documentation from web search to code examples', category: 'Research' },
  { name: 'evaluate-test', description: 'Write comprehensive tests — unit, integration, e2e — with coverage analysis', category: 'Testing' },
  { name: 'function-calling', description: 'Design and implement function calling patterns for Claude with schema validation', category: 'API' },
  { name: 'git-workflows', description: 'Git branching strategies, commit conventions, code review, and merge conflict resolution', category: 'VCS' },
  { name: 'context-management', description: 'Manage context window efficiently with summarization, compression, and prioritization', category: 'Optimization' },
  { name: 'incident-response', description: 'Respond to production incidents with runbooks, postmortems, and blameless analysis', category: 'DevOps' },
  { name: 'javascript-pro', description: 'Advanced JavaScript patterns, async patterns, memory management, and performance', category: 'Frontend' },
  { name: 'json-schema', description: 'Design and validate JSON schemas for APIs, configuration, and data interchange', category: 'Standards' },
  { name: 'llm-evaluation', description: 'Evaluate LLM outputs using automated metrics, human feedback, and red-teaming', category: 'AI' },
  { name: 'memory-management', description: 'Implement persistent memory systems for AI agents with semantic search', category: 'Agent' },
  { name: 'mcp-servers', description: 'Build and integrate MCP servers for extending Claude with custom tools', category: 'Integration' },
  { name: 'nextjs-pro', description: 'Next.js advanced patterns — App Router, Server Components, streaming, caching', category: 'Frontend' },
  { name: 'openapi-spec', description: 'Design and document REST APIs with OpenAPI/Swagger specifications', category: 'API' },
  { name: 'playwright-testing', description: 'End-to-end testing with Playwright — selectors, assertions, CI integration', category: 'Testing' },
  { name: 'prompt-engineering', description: 'Craft effective prompts for Claude — context, examples, constraints, iteration', category: 'AI' },
  { name: 'python-pro', description: 'Advanced Python patterns, async programming, type hints, and performance optimization', category: 'Backend' },
  { name: 'react-performance', description: 'Optimize React apps — rendering, bundle size, state management, lazy loading', category: 'Frontend' },
  { name: 'security-audit', description: 'Security review patterns for code — OWASP Top 10, secrets detection, dependency audit', category: 'Security' },
  { name: 'sql-optimization', description: 'Optimize SQL queries, indexes, query plans, and database performance tuning', category: 'Database' },
  { name: 'system-design', description: 'Design scalable systems — load balancing, caching, microservices, event-driven', category: 'Architecture' },
  { name: 'test-driven-development', description: 'TDD practices with red-green-refactor cycles and mock patterns', category: 'Testing' },
  { name: 'typescript-pro', description: 'Advanced TypeScript — generics, conditional types, decorators, performance', category: 'Standards' },
  { name: 'vector-databases', description: 'Implement vector similarity search with embeddings for AI applications', category: 'AI' },
  { name: 'web-security', description: 'Web application security — XSS, CSRF, injection, authentication patterns', category: 'Security' },
  { name: 'workflow-automation', description: 'Automate workflows using scheduling, webhooks, and event-driven architectures', category: 'DevOps' },
]

// 统一标签颜色
const CATEGORY_COLORS: Record<string, string> = {
  'Agent': 'bg-purple-100 text-purple-700',
  'AI': 'bg-pink-100 text-pink-700',
  'Testing': 'bg-blue-100 text-blue-700',
  'Backend': 'bg-green-100 text-green-700',
  'Frontend': 'bg-orange-100 text-orange-700',
  'Database': 'bg-cyan-100 text-cyan-700',
  'DevOps': 'bg-yellow-100 text-yellow-700',
  'Architecture': 'bg-indigo-100 text-indigo-700',
  'Security': 'bg-red-100 text-red-700',
  'API': 'bg-teal-100 text-teal-700',
  'Standards': 'bg-gray-800 text-gray-300',
  'Documentation': 'bg-amber-100 text-amber-700',
  'Content': 'bg-rose-100 text-rose-700',
  'Process': 'bg-violet-100 text-violet-700',
  'Optimization': 'bg-lime-100 text-lime-700',
  'Research': 'bg-sky-100 text-sky-700',
  'Integration': 'bg-fuchsia-100 text-fuchsia-700',
  'VCS': 'bg-emerald-100 text-emerald-700',
}

function getCategoryClass(category: string) {
  return CATEGORY_COLORS[category] || 'bg-gray-800 text-gray-400'
}

function SkillCard({ skill, isSelected, onClick }: { skill: typeof SKILLS_DATA[0]; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left border-b border-gray-800 transition-all ${
        isSelected 
          ? 'bg-pink-50 border-l-4 border-l-pink-500' 
          : 'hover:bg-gray-900'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium text-sm ${isSelected ? 'text-pink-700' : 'text-gray-100'}`}>
          {skill.name}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryClass(skill.category)}`}>
          {skill.category}
        </span>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2">{skill.description}</p>
    </button>
  )
}

function SkillDetail({ skill }: { skill: typeof SKILLS_DATA[0] }) {
  return (
    <div className="bg-gray-950 rounded-2xl border border-gray-700 p-8">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
          <SparklesIcon className="w-7 h-7 text-pink-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">{skill.name}</h2>
          <span className={`px-3 py-1 rounded-full text-sm ${getCategoryClass(skill.category)}`}>
            {skill.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-lg leading-relaxed mb-8">{skill.description}</p>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <BookOpenIcon className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-300">分类</span>
          </div>
          <span className={`px-2 py-1 rounded-lg text-sm ${getCategoryClass(skill.category)}`}>
            {skill.category}
          </span>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <WrenchIcon className="w-5 h-5 text-green-500" />
            <span className="font-medium text-gray-300">使用方式</span>
          </div>
          <code className="text-sm text-pink-600 font-mono">/skill {skill.name}</code>
        </div>
      </div>

      {/* How to Use */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-100 mb-4">
          <RocketLaunchIcon className="w-5 h-5 text-pink-500" />
          如何使用
        </h3>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
          <div>
            <h4 className="text-gray-300 font-medium mb-2">1. 安装 Skill</h4>
            <code className="block bg-gray-950 rounded-lg p-3 text-sm text-pink-600 font-mono border border-gray-700">
              skillhub install {skill.name}
            </code>
          </div>
          <div>
            <h4 className="text-gray-300 font-medium mb-2">2. 激活 Skill</h4>
            <code className="block bg-gray-950 rounded-lg p-3 text-sm text-pink-600 font-mono border border-gray-700">
              /skill {skill.name}
            </code>
          </div>
        </div>
      </div>

      {/* External Link */}
      <a
        href={`https://github.com/skill-clawn/everything-claude-code/tree/main/skills/${skill.name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors group/link"
      >
        <span>查看完整文档</span>
        <ArrowRightIcon className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
      </a>
    </div>
  )
}

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState(SKILLS_DATA[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredSkills = SKILLS_DATA.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <SparklesIcon className="w-7 h-7 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-100">Skill 相关</h1>
          </div>
          <p className="text-gray-500 text-sm">
            {SKILLS_DATA.length} 个精选 Skills，持续更新
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gray-950 rounded-2xl border border-gray-700 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索 skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Left - Skills List */}
            <div className="border border-gray-700 rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto">
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  isSelected={selectedSkill.name === skill.name}
                  onClick={() => setSelectedSkill(skill)}
                />
              ))}
            </div>

            {/* Right - Skill Detail */}
            <div>
              <SkillDetail skill={selectedSkill} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

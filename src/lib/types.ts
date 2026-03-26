export interface Article {
  id: string
  url: string
  author: string | null
  authorUsername: string | null
  title: string | null
  content: string | null
  summary: string | null
  translatedContent: string | null
  translatedSummary: string | null
  originalLanguage: string | null
  coverImage: string | null
  publishedAt: string | null
  status: 'pending' | 'crawling' | 'translating' | 'summarizing' | 'completed' | 'failed'
  error: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateArticleInput {
  url?: string | null
  title?: string | null
  author?: string | null
  authorUsername?: string | null
  publishedAt?: string | null
  content?: string | null
  summary?: string | null
  coverImage?: string | null
  translatedContent?: string | null
  translatedSummary?: string | null
  originalLanguage?: string | null
  status?: Article['status']
  error?: string | null
}

export interface UpdateArticleInput {
  author?: string | null
  authorUsername?: string | null
  title?: string | null
  content?: string | null
  summary?: string | null
  translatedContent?: string | null
  translatedSummary?: string | null
  originalLanguage?: string | null
  coverImage?: string | null
  publishedAt?: string | null
  status?: Article['status']
  error?: string | null
}

export interface User {
  id: string
  githubId: string
  name: string | null
  email: string | null
  image: string | null
  status: 'pending' | 'approved' | 'rejected'
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

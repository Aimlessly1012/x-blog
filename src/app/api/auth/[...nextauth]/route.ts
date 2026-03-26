import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { getDb } from '@/lib/db'

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  useSecureCookies: false,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'github') {
        const db = getDb()
        
        // 检查用户是否存在
        let dbUser = db.prepare('SELECT * FROM users WHERE github_id = ?').get(user.id) as any
        
        if (!dbUser) {
          // 新用户 - 检查是否是管理员
          const isAdmin = user.id === process.env.ADMIN_GITHUB_ID
          const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
          const now = new Date().toISOString()
          
          db.prepare(`
            INSERT INTO users (id, github_id, name, email, image, status, is_admin, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            userId,
            user.id,
            user.name,
            user.email,
            user.image,
            isAdmin ? 'approved' : 'pending',
            isAdmin ? 1 : 0,
            now,
            now
          )
          
          dbUser = db.prepare('SELECT * FROM users WHERE github_id = ?').get(user.id) as any
        }
        
        return true
      }
      return true
    },
    async jwt({ token, user, account }) {
      // 首次登录时，将数据库信息添加到 token
      if (account && user) {
        const db = getDb()
        const dbUser = db.prepare('SELECT * FROM users WHERE github_id = ?').get(user.id) as any
        
        if (dbUser) {
          token.status = dbUser.status
          token.isAdmin = dbUser.is_admin === 1
        }
      }
      
      // 每次访问时，刷新数据库中的最新状态
      if (token.sub) {
        const db = getDb()
        const dbUser = db.prepare('SELECT * FROM users WHERE github_id = ?').get(token.sub) as any
        
        if (dbUser) {
          token.status = dbUser.status
          token.isAdmin = dbUser.is_admin === 1
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.sub
        (session.user as any).status = token.status
        (session.user as any).isAdmin = token.isAdmin
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})

export { handler as GET, handler as POST }

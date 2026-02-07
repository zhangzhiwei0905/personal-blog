import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import MusicPlayer from '@/components/MusicPlayer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '我的个人博客',
  description: '分享技术、生活和思考的个人博客',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pb-24">
          {children}
        </main>
        <MusicPlayer />
      </body>
    </html>
  )
}

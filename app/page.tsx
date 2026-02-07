import Link from 'next/link'
import { FaArrowRight, FaClock, FaUser } from 'react-icons/fa'

export default function HomePage() {
  // This will be replaced with actual data from the database
  const recentPosts = [
    {
      id: '1',
      title: '欢迎来到我的博客',
      excerpt: '这是一个使用 Next.js、Tailwind CSS 和 Supabase 构建的现代化个人博客...',
      author: '博主',
      createdAt: new Date().toISOString(),
      slug: 'welcome',
      coverImage: null,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            欢迎来到我的博客
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          分享技术、生活和思考的个人空间
        </p>
      </div>

      {/* Recent Posts */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">最新文章</h2>
          <Link
            href="/posts"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            查看全部
            <FaArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-200 hover:border-purple-300"
            >
              {post.coverImage && (
                <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaUser size={12} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock size={12} />
                    <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">开始您的创作之旅</h2>
        <p className="text-lg mb-8 opacity-90">
          注册账户，分享您的想法和故事
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
        >
          立即注册
        </Link>
      </div>
    </div>
  )
}

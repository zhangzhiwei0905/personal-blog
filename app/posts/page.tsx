'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaClock, FaUser } from 'react-icons/fa'

export default function PostsPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts')
                const data = await res.json()
                setPosts(data.posts || [])
            } catch (error) {
                console.error('Failed to fetch posts:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    所有文章
                </h1>
                <p className="text-gray-600">探索我的思考和分享</p>
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">加载中...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-6">还没有文章</p>
                    <Link
                        href="/create"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        写第一篇文章
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post: any) => (
                        <Link
                            key={post.id}
                            href={`/posts/${post.slug}`}
                            className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-200 hover:border-purple-300"
                        >
                            {post.coverImage && (
                                <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <FaUser size={12} />
                                        <span>{post.author.name || post.author.username}</span>
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
            )}
        </div>
    )
}

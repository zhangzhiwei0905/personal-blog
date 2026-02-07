import { notFound } from 'next/navigation'
import { FaClock, FaUser } from 'react-icons/fa'
import CommentSection from '@/components/CommentSection'
import { renderMarkdown } from '@/lib/markdown'
import { prisma } from '@/lib/db'

type Post = {
    id: string
    title: string
    content: string
    excerpt: string | null
    coverImage: string | null
    published: boolean
    createdAt: Date
    updatedAt: Date
    author: {
        id: string
        username: string
        name: string | null
        avatar: string | null
    }
    comments: Array<{
        id: string
        content: string
        createdAt: Date
        author: {
            id: string
            username: string
            name: string | null
            avatar: string | null
        }
    }>
}

// 直接使用 Prisma 查询，避免 Vercel 上的 fetch URL 问题
async function getPost(slug: string): Promise<Post | null> {
    try {
        console.log('[Page] Fetching post with slug:', slug)

        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        if (!post) {
            console.log('[Page] Post not found:', slug)
            return null
        }

        console.log('[Page] Post found:', post.id)
        return post
    } catch (error) {
        console.error('[Page] Failed to fetch post:', error)
        return null
    }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <article className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-purple-100">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <FaUser className="text-purple-600" />
                            <span>{post.author.name || post.author.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-purple-600" />
                            <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                />
            </article>

            {/* Comments */}
            <CommentSection
                postId={post.id}
                comments={post.comments.map(comment => ({
                    ...comment,
                    createdAt: comment.createdAt.toISOString()
                }))}
            />
        </div>
    )
}

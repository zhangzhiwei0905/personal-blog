import { notFound } from 'next/navigation'
import { FaClock, FaUser } from 'react-icons/fa'
import CommentSection from '@/components/CommentSection'
import { renderMarkdown } from '@/lib/markdown'

type Post = {
    id: string
    title: string
    content: string
    excerpt: string | null
    coverImage: string | null
    createdAt: string
    author: {
        id: string
        name: string | null
        username: string
        avatar: string | null
    }
    comments: Array<{
        id: string
        content: string
        createdAt: string
        author: {
            id: string
            name: string | null
            username: string
            avatar: string | null
        }
    }>
}

async function getPost(slug: string): Promise<Post | null> {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/posts/${slug}`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            return null
        }

        return await res.json()
    } catch (error) {
        console.error('Failed to fetch post:', error)
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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Post Header */}
            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {post.title}
                </h1>

                <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                        <FaUser />
                        <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock />
                        <time>{new Date(post.createdAt).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</time>
                    </div>
                </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
                <div className="mb-8 rounded-xl overflow-hidden">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-auto"
                    />
                </div>
            )}

            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-12">
                <div
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                />
            </div>

            {/* Comment Section */}
            <CommentSection postId={post.id} comments={post.comments || []} />
        </article>
    )
}

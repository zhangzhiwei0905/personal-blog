'use client'

import { useState, useEffect } from 'react'
import { FaClock, FaTrash } from 'react-icons/fa'

interface Comment {
    id: string
    content: string
    createdAt: string
    author: {
        id: string
        name: string | null
        username: string
        avatar: string | null
    }
}

interface CommentSectionProps {
    postId: string
    comments: Comment[]
}

export default function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
    const [comments, setComments] = useState(initialComments)
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        // Load user from localStorage
        const loadUser = () => {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser))
                } catch (error) {
                    console.error('Failed to parse user:', error)
                }
            }
        }

        loadUser()

        // Listen for login events
        const handleUserLogin = () => {
            loadUser()
        }

        window.addEventListener('userLogin', handleUserLogin)

        return () => {
            window.removeEventListener('userLogin', handleUserLogin)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !user) return

        setLoading(true)
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    postId,
                    authorId: user.id,
                }),
            })

            if (res.ok) {
                const comment = await res.json()
                setComments([comment, ...comments])
                setNewComment('')
            }
        } catch (error) {
            console.error('Failed to post comment:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (commentId: string) => {
        try {
            const res = await fetch(`/api/comments?id=${commentId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setComments(comments.filter(c => c.id !== commentId))
            }
        } catch (error) {
            console.error('Failed to delete comment:', error)
        }
    }

    return (
        <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                评论 ({comments.length})
            </h2>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="分享你的想法..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                        rows={4}
                    />
                    <div className="mt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !newComment.trim()}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '发送中...' : '发表评论'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-8 text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 mb-4">登录后即可发表评论</p>
                    <a
                        href={`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`}
                        className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        立即登录
                    </a>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-semibold text-gray-900">{comment.author.name || comment.author.username}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <FaClock size={12} />
                                    <time>{new Date(comment.createdAt).toLocaleDateString('zh-CN')}</time>
                                </div>
                            </div>
                            {user && user.id === comment.author.id && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    aria-label="删除评论"
                                >
                                    <FaTrash size={14} />
                                </button>
                            )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                ))}

                {comments.length === 0 && (
                    <p className="text-center text-gray-500 py-8">还没有评论，来发表第一条吧！</p>
                )}
            </div>
        </div>
    )
}

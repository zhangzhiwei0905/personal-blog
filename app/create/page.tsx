'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaEye, FaImage } from 'react-icons/fa'
import { renderMarkdown } from '@/lib/markdown'

export default function CreatePostPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [previewMode, setPreviewMode] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (published: boolean) => {
        setError('')

        if (!title.trim() || !content.trim()) {
            setError('请填写标题和内容')
            return
        }

        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            alert('请先登录后再发布文章')
            router.push('/login')
            return
        }

        const user = JSON.parse(storedUser)
        setLoading(true)

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    excerpt: excerpt || content.substring(0, 150),
                    published,
                    authorId: user.id,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || '发布失败')
            }

            router.push(`/posts/${data.slug}`)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // 检查文件大小（限制 2MB）
        if (file.size > 2 * 1024 * 1024) {
            alert('图片大小不能超过 2MB')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const base64 = e.target?.result as string
            const imageMarkdown = `\n![${file.name}](${base64})\n`
            setContent(content + imageMarkdown)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-purple-100">
                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    创建新文章
                </h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                <form className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            标题
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            placeholder="给你的文章起个标题..."
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                            摘要（可选）
                        </label>
                        <textarea
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                            rows={3}
                            placeholder="简短描述文章内容..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                内容（支持 Markdown）
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 hover:text-purple-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    title="上传图片"
                                >
                                    <FaImage />
                                    图片
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="flex items-center gap-2 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                                >
                                    <FaEye />
                                    {previewMode ? '编辑' : '预览'}
                                </button>
                            </div>
                        </div>

                        {!previewMode ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none font-mono text-sm"
                                rows={20}
                                placeholder="开始写作，支持 Markdown 语法...

# 一级标题
## 二级标题

**粗体** 或 *斜体*

- 无序列表
- 项目 2

1. 有序列表
2. 项目 2

[链接](https://example.com)

点击上方图片按钮上传图片"
                            />
                        ) : (
                            <div
                                className="w-full min-h-[500px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                            />
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => handleSubmit(true)}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '发布中...' : '立即发布'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSubmit(false)}
                            disabled={loading}
                            className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            保存草稿
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                        >
                            取消
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { FaBold, FaItalic, FaListUl, FaListOl, FaQuoteRight } from 'react-icons/fa'

export default function CreatePostPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [published, setPublished] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>开始写作...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!title.trim() || !editor?.getHTML()) {
            setError('请填写标题和内容')
            return
        }

        setLoading(true)

        try {
            // In real app, get authorId from session
            const authorId = 'temp-user-id'

            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content: editor.getHTML(),
                    excerpt: excerpt || editor.getText().substring(0, 150),
                    published,
                    authorId,
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

    if (!editor) {
        return null
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-purple-100">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                    创作新文章
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg font-semibold"
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

                    {/* Editor Toolbar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            内容
                        </label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-300' : ''
                                        }`}
                                >
                                    <FaBold />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-300' : ''
                                        }`}
                                >
                                    <FaItalic />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-300' : ''
                                        }`}
                                >
                                    <FaListUl />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-300' : ''
                                        }`}
                                >
                                    <FaListOl />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-300' : ''
                                        }`}
                                >
                                    <FaQuoteRight />
                                </button>
                            </div>
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    {/* Publish Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="published"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="published" className="text-sm font-medium text-gray-700">
                            立即发布
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '发布中...' : published ? '发布文章' : '保存草稿'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

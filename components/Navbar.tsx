'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaPen } from 'react-icons/fa'

interface NavbarProps {
    user?: {
        name: string
        email: string
    } | null
}

export default function Navbar({ user }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            我的博客
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                        >
                            首页
                        </Link>
                        <Link
                            href="/posts"
                            className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                        >
                            文章
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    href="/create"
                                    className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                                >
                                    <FaPen size={14} />
                                    写文章
                                </Link>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-600">{user.name}</span>
                                    <Link
                                        href="/api/auth/signout"
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <FaSignOutAlt size={14} />
                                        退出
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                                >
                                    登录
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                                >
                                    注册
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                首页
                            </Link>
                            <Link
                                href="/posts"
                                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                文章
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        href="/create"
                                        className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <FaPen size={14} />
                                        写文章
                                    </Link>
                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-gray-600 mb-3">{user.name}</p>
                                        <Link
                                            href="/api/auth/signout"
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-fit"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <FaSignOutAlt size={14} />
                                            退出
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        登录
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        注册
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

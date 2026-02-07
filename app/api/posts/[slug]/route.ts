import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        console.log('[API] Fetching post with slug:', slug)

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
            console.log('[API] Post not found:', slug)
            return NextResponse.json(
                { error: '文章不存在' },
                { status: 404 }
            )
        }

        console.log('[API] Post found:', post.id)
        return NextResponse.json(post)
    } catch (error: any) {
        console.error('[API] Fetch post error:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        })
        return NextResponse.json(
            { error: '获取文章失败', details: error.message },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const { title, content, excerpt, coverImage, published } = await request.json()

        const post = await prisma.post.update({
            where: { slug },
            data: {
                title,
                content,
                excerpt,
                coverImage,
                published,
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error('Update post error:', error)
        return NextResponse.json(
            { error: '更新文章失败' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        await prisma.post.delete({
            where: { slug },
        })

        return NextResponse.json({ message: '文章已删除' })
    } catch (error) {
        console.error('Delete post error:', error)
        return NextResponse.json(
            { error: '删除文章失败' },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { published: true },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    coverImage: true,
                    createdAt: true,
                    updatedAt: true,
                    // 不包含 content 字段，减少数据传输
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
                skip,
                take: limit,
            }),
            prisma.post.count({ where: { published: true } }),
        ])

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Fetch posts error:', error)
        return NextResponse.json(
            { error: '获取文章失败' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        // In a real app, you would get the user ID from the session
        const { title, content, excerpt, coverImage, published, authorId } = await request.json()

        if (!title || !content || !authorId) {
            return NextResponse.json(
                { error: '请填写标题和内容' },
                { status: 400 }
            )
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
            .replace(/^-|-$/g, '')
            + '-' + Date.now()

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || content.substring(0, 150),
                coverImage,
                published: published || false,
                authorId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
            },
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error('Create post error:', error)
        return NextResponse.json(
            { error: '创建文章失败' },
            { status: 500 }
        )
    }
}

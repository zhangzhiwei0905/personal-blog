import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const { content, postId, authorId } = await request.json()

        if (!content || !postId || !authorId) {
            return NextResponse.json(
                { error: '请填写评论内容' },
                { status: 400 }
            )
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId,
            },
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
        })

        return NextResponse.json(comment, { status: 201 })
    } catch (error) {
        console.error('Create comment error:', error)
        return NextResponse.json(
            { error: '发表评论失败' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const commentId = searchParams.get('id')

        if (!commentId) {
            return NextResponse.json(
                { error: '缺少评论ID' },
                { status: 400 }
            )
        }

        await prisma.comment.delete({
            where: { id: commentId },
        })

        return NextResponse.json({ message: '评论已删除' })
    } catch (error) {
        console.error('Delete comment error:', error)
        return NextResponse.json(
            { error: '删除评论失败' },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: '请提供邮箱和密码' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { error: '邮箱或密码错误' },
                { status: 401 }
            )
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: '邮箱或密码错误' },
                { status: 401 }
            )
        }

        // In a real app, you would create a session here
        // For now, we'll return the user data
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: '登录失败，请稍后重试' },
            { status: 500 }
        )
    }
}

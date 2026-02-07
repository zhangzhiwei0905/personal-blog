import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json()

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: '请填写所有必填字段' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: '密码长度至少为6个字符' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        })

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { error: '该邮箱已被注册' },
                    { status: 409 }
                )
            }
            if (existingUser.username === username) {
                return NextResponse.json(
                    { error: '该用户名已被使用' },
                    { status: 409 }
                )
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                name: username,
            },
        })

        return NextResponse.json({
            message: '注册成功',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        }, { status: 201 })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: '注册失败，请稍后重试' },
            { status: 500 }
        )
    }
}

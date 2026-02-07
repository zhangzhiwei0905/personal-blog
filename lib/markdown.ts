// 极简 Markdown 渲染器 - 专注于图片显示
export function renderMarkdown(markdown: string): string {
    if (!markdown) return ''

    let html = markdown

    // 1. 先处理图片（最重要！）
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        // 直接返回 img 标签，不做任何转义
        return `<img src="${src}" alt="${alt}" class="max-w-full h-auto rounded-lg my-4" style="display: block;" />`
    })

    // 2. 处理代码块
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code>${escapeHtml(code.trim())}</code></pre>`
    })

    // 3. 处理行内代码
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        return `<code class="bg-gray-100 px-2 py-1 rounded text-sm">${escapeHtml(code)}</code>`
    })

    // 4. 转义其他 HTML（但不影响已经生成的 img 标签）
    // 使用占位符保护已生成的标签
    const protectedTags: string[] = []
    html = html.replace(/(<img[^>]+>|<pre[^>]*>[\s\S]*?<\/pre>|<code[^>]*>[\s\S]*?<\/code>)/g, (match) => {
        const index = protectedTags.length
        protectedTags.push(match)
        return `__PROTECTED_${index}__`
    })

    // 现在可以安全转义
    html = escapeHtml(html)

    // 恢复受保护的标签
    protectedTags.forEach((tag, index) => {
        html = html.replace(`__PROTECTED_${index}__`, tag)
    })

    // 5. 处理其他 Markdown 语法
    // 标题
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>')

    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 underline" target="_blank">$1</a>')

    // 粗体和斜体
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

    // 列表
    html = html.replace(/^- (.+)$/gm, '<li class="ml-6">$1</li>')
    html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc my-4">$&</ul>')

    // 引用
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-purple-500 pl-4 my-4">$1</blockquote>')

    // 段落和换行
    html = html.replace(/\n\n/g, '</p><p class="mb-4">')
    html = html.replace(/\n/g, '<br />')
    html = '<p class="mb-4">' + html + '</p>'

    // 清理空段落
    html = html.replace(/<p class="mb-4"><\/p>/g, '')

    return html
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

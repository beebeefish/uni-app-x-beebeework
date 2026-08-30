/**
 * 轻量 Markdown → HTML（内置，无需插件）
 * 覆盖：标题 / 粗斜体 / 删除线 / 行内代码 / 代码块 / 链接 / 图片 / 列表 / 引用 / 分割线 / 表格(简易)
 */
export function markdownToHtml(src) {
	if (!src || typeof src !== 'string') return ''
	let text = src.replace(/\r\n?/g, '\n')

	// 围栏代码块
	text = text.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
		const safe = escapeHtml(code.replace(/\n$/, ''))
		const cls = lang ? ` class="language-${lang}"` : ''
		return `<pre><code${cls}>${safe}</code></pre>`
	})

	const lines = text.split('\n')
	const out = []
	let i = 0
	let inUl = false
	let inOl = false
	let inBq = false

	const closeLists = () => {
		if (inUl) {
			out.push('</ul>')
			inUl = false
		}
		if (inOl) {
			out.push('</ol>')
			inOl = false
		}
	}
	const closeBq = () => {
		if (inBq) {
			out.push('</blockquote>')
			inBq = false
		}
	}

	while (i < lines.length) {
		const line = lines[i]

		// 已是 HTML 块（pre）原样输出
		if (line.startsWith('<pre')) {
			closeLists()
			closeBq()
			out.push(line)
			while (i < lines.length && !lines[i].includes('</pre>')) {
				i++
				if (i < lines.length && !lines[i].startsWith('<pre')) out.push(lines[i])
			}
			i++
			continue
		}

		if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
			closeLists()
			closeBq()
			out.push('<hr/>')
			i++
			continue
		}

		const h = line.match(/^(#{1,6})\s+(.+)$/)
		if (h) {
			closeLists()
			closeBq()
			const n = h[1].length
			out.push(`<h${n}>${inlineMd(h[2])}</h${n}>`)
			i++
			continue
		}

		if (/^>\s?/.test(line)) {
			closeLists()
			if (!inBq) {
				out.push('<blockquote>')
				inBq = true
			}
			out.push(`<p>${inlineMd(line.replace(/^>\s?/, ''))}</p>`)
			i++
			continue
		} else {
			closeBq()
		}

		// GFM 任务列表
		const task = line.match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/)
		if (task) {
			closeBq()
			if (inOl) {
				out.push('</ol>')
				inOl = false
			}
			if (!inUl) {
				out.push('<ul>')
				inUl = true
			}
			const checked = /x/i.test(task[1])
			out.push(
				`<li>${checked ? '☑' : '☐'} ${inlineMd(task[2])}</li>`
			)
			i++
			continue
		}

		const ul = line.match(/^[-*+]\s+(.+)$/)
		if (ul) {
			closeBq()
			if (inOl) {
				out.push('</ol>')
				inOl = false
			}
			if (!inUl) {
				out.push('<ul>')
				inUl = true
			}
			out.push(`<li>${inlineMd(ul[1])}</li>`)
			i++
			continue
		}

		const ol = line.match(/^\d+\.\s+(.+)$/)
		if (ol) {
			closeBq()
			if (inUl) {
				out.push('</ul>')
				inUl = false
			}
			if (!inOl) {
				out.push('<ol>')
				inOl = true
			}
			out.push(`<li>${inlineMd(ol[1])}</li>`)
			i++
			continue
		}

		closeLists()

		// 表格：| a | b | + 对齐行 |:---|:---:|---:|
		if (line.includes('|') && i + 1 < lines.length && /^\|?[\s:|-]+\|/.test(lines[i + 1])) {
			const header = splitTableRow(line)
			const aligns = splitTableRow(lines[i + 1]).map(parseAlign)
			i += 2
			const rows = []
			while (i < lines.length && lines[i].includes('|')) {
				rows.push(splitTableRow(lines[i]))
				i++
			}
			out.push('<table><thead><tr>')
			header.forEach((c, idx) => {
				const a = aligns[idx] ? ` align="${aligns[idx]}"` : ''
				out.push(`<th${a}>${inlineMd(c)}</th>`)
			})
			out.push('</tr></thead><tbody>')
			rows.forEach((r) => {
				out.push('<tr>')
				r.forEach((c, idx) => {
					const a = aligns[idx] ? ` align="${aligns[idx]}"` : ''
					out.push(`<td${a}>${inlineMd(c)}</td>`)
				})
				out.push('</tr>')
			})
			out.push('</tbody></table>')
			continue
		}

		if (!line.trim()) {
			out.push('')
			i++
			continue
		}

		out.push(`<p>${inlineMd(line)}</p>`)
		i++
	}

	closeLists()
	closeBq()
	return out.join('\n')
}

function splitTableRow(line) {
	return line
		.replace(/^\|/, '')
		.replace(/\|$/, '')
		.split('|')
		.map((s) => s.trim())
}

function parseAlign(cell) {
	const s = String(cell || '').replace(/\s/g, '')
	if (/^:?-+:$/.test(s)) return 'center'
	if (/^-+:$/.test(s)) return 'right'
	if (/^:-+$/.test(s)) return 'left'
	return ''
}

function inlineMd(s) {
	let t = escapeHtml(s)
	t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, '<img alt="$1" src="$2"/>')
	t = t.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, '<a href="$2">$1</a>')
	t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
	t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
	t = t.replace(/__([^_]+)__/g, '<strong>$1</strong>')
	t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>')
	t = t.replace(/_([^_]+)_/g, '<em>$1</em>')
	t = t.replace(/~~([^~]+)~~/g, '<del>$1</del>')
	return t
}

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

export default markdownToHtml

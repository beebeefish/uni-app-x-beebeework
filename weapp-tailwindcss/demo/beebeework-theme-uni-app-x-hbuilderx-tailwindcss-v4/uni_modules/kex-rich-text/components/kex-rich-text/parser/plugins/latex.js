/**
 * latex 插件：将 $...$ / $$...$$ 转为可渲染节点
 * 轻量自研（子集）：分数、上下标、根号、希腊字母、基础运算符
 *
 * new Latex() 或 Latex 直接放入 plugins
 */
const GREEK = {
	alpha: 'α',
	beta: 'β',
	gamma: 'γ',
	delta: 'δ',
	epsilon: 'ε',
	theta: 'θ',
	lambda: 'λ',
	mu: 'μ',
	pi: 'π',
	sigma: 'σ',
	phi: 'φ',
	omega: 'ω',
	Alpha: 'Α',
	Beta: 'Β',
	Gamma: 'Γ',
	Delta: 'Δ',
	Pi: 'Π',
	Sigma: 'Σ',
	Omega: 'Ω'
}

const OPS = {
	times: '×',
	div: '÷',
	pm: '±',
	mp: '∓',
	cdot: '·',
	infty: '∞',
	leq: '≤',
	geq: '≥',
	neq: '≠',
	approx: '≈',
	sum: '∑',
	prod: '∏',
	int: '∫'
}

function latexToHtml(src, display) {
	let s = String(src || '').trim()
	s = s.replace(/\\([a-zA-Z]+)/g, (_, name) => {
		if (GREEK[name]) return GREEK[name]
		if (OPS[name]) return OPS[name]
		if (name === 'sqrt') return '√'
		if (name === 'frac') return '__FRAC__'
		return '\\' + name
	})
	// \frac{a}{b}
	s = s.replace(/__FRAC__\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="kex-frac"><span class="kex-frac-n">$1</span><span class="kex-frac-d">$2</span></span>')
	s = s.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
	s = s.replace(/\^(\w)/g, '<sup>$1</sup>')
	s = s.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>')
	s = s.replace(/_(\w)/g, '<sub>$1</sub>')
	s = s.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
	const cls = display ? 'kex-latex kex-latex--block' : 'kex-latex kex-latex--inline'
	const style = display
		? 'display:block;text-align:center;margin:12px 0;font-family:serif;font-size:1.1em'
		: 'display:inline;font-family:serif;padding:0 2px'
	return `<span class="${cls}" style="${style}">${s}</span>`
}

function replaceLatex(content) {
	if (!content || typeof content !== 'string') return content
	let out = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, body) => latexToHtml(body, true))
	out = out.replace(/\$([^$\n]+?)\$/g, (_, body) => latexToHtml(body, false))
	return out
}

export default function Latex() {}

Latex.prototype.onUpdate = function (content) {
	return replaceLatex(content)
}

Latex.latexToHtml = latexToHtml
Latex.replaceLatex = replaceLatex

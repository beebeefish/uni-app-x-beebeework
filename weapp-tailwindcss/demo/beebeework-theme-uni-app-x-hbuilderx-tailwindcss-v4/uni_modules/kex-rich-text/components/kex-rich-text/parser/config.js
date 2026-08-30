/**
 * kex-rich-text 解析配置
 * 标签白名单、默认样式；默认剥离事件属性与 javascript: URL
 */

function makeMap(str) {
	const map = Object.create(null)
	const list = str.split(',')
	for (let i = list.length; i--;) map[list[i]] = true
	return map
}

export const TRUST_TAGS = makeMap(
	'a,abbr,ad,audio,b,blockquote,br,code,col,colgroup,dd,del,div,dl,dt,em,fieldset,font,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,pre,q,ruby,rt,s,section,source,span,strike,strong,sub,sup,svg,table,tbody,td,tfoot,th,thead,title,tr,ul,video,figure,figcaption,mark,u,small,big,center,caption'
)

export const BLOCK_TAGS = makeMap(
	'address,article,aside,body,caption,center,cite,footer,header,html,nav,pre,section,figure,figcaption'
)

/** title/base 仍 ignore（解析时特殊处理）；iframe/embed 不永久 ignore，由平台条件控制 */
export const IGNORE_TAGS = makeMap(
	'area,base,canvas,frame,head,input,link,map,meta,param,rp,script,style,textarea,title,track,wbr,object,form,button,select,option'
)

export const VOID_TAGS = makeMap(
	'area,base,br,col,circle,ellipse,embed,frame,hr,img,input,line,link,meta,param,path,polygon,rect,source,track,use,wbr'
)

export const INLINE_TAGS = makeMap(
	'a,abbr,b,big,code,del,em,i,ins,label,mark,q,s,small,span,strong,sub,sup,u'
)

/** 危险属性前缀 / 名 */
export const DANGER_ATTR = makeMap(
	'onclick,ondblclick,onmousedown,onmouseup,onmouseover,onmousemove,onmouseout,onmouseenter,onmouseleave,onkeydown,onkeypress,onkeyup,onload,onerror,onfocus,onblur,onchange,onsubmit,onreset,onselect,oninput,onabort,ondrag,ondrop,ontouchstart,ontouchmove,ontouchend'
)

export const ENTITIES = {
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	amp: '&',
	nbsp: '\u00A0',
	ensp: '\u2002',
	emsp: '\u2003',
	semi: ';',
	ndash: '–',
	mdash: '—',
	middot: '·',
	lsquo: '‘',
	rsquo: '’',
	ldquo: '“',
	rdquo: '”',
	bull: '•',
	hellip: '…',
	larr: '←',
	uarr: '↑',
	rarr: '→',
	darr: '↓',
	times: '×',
	divide: '÷',
	copy: '©',
	reg: '®',
	trade: '™',
	deg: '°'
}

/** 标签默认样式（可用 tagStyle / theme 覆盖） */
export const DEFAULT_TAG_STYLE = {
	address: 'font-style:italic',
	big: 'display:inline;font-size:1.2em',
	caption: 'display:table-caption;text-align:center',
	center: 'text-align:center',
	cite: 'font-style:italic',
	dd: 'margin-left:40px',
	mark: 'background-color:#fef08a;padding:0 4px;border-radius:2px',
	pre: 'font-family:monospace;white-space:pre-wrap;word-break:break-all;background:#f4f4f5;padding:12px;border-radius:8px;overflow:auto',
	code: 'font-family:monospace;background:#f4f4f5;padding:2px 6px;border-radius:4px;font-size:0.92em',
	blockquote:
		'margin:12px 0;padding:8px 12px;border-left:4px solid #d4d4d8;color:#52525b;background:#fafafa',
	s: 'text-decoration:line-through',
	strike: 'text-decoration:line-through',
	small: 'display:inline;font-size:0.8em',
	u: 'text-decoration:underline',
	table: 'border-collapse:collapse;width:100%',
	th: 'border:1px solid #e4e4e7;padding:8px;background:#f4f4f5;font-weight:600',
	td: 'border:1px solid #e4e4e7;padding:8px',
	hr: 'border:none;border-top:1px solid #e4e4e7;margin:16px 0',
	h1: 'font-size:2em;font-weight:700;margin:0.67em 0',
	h2: 'font-size:1.5em;font-weight:700;margin:0.75em 0',
	h3: 'font-size:1.17em;font-weight:700;margin:0.83em 0',
	h4: 'font-size:1em;font-weight:700;margin:1.12em 0',
	h5: 'font-size:0.83em;font-weight:700;margin:1.5em 0',
	h6: 'font-size:0.75em;font-weight:700;margin:1.67em 0',
	p: 'margin:0.5em 0',
	li: 'margin:4px 0',
	ul: 'padding-left:1.5em;margin:0.5em 0',
	ol: 'padding-left:1.5em;margin:0.5em 0',
	a: 'color:#2563eb;text-decoration:underline',
	img: 'max-width:100%;height:auto;vertical-align:middle',
	video: 'max-width:100%;height:auto',
	figure: 'margin:12px 0',
	figcaption: 'text-align:center;color:#71717a;font-size:0.875em;margin-top:6px'
}

/** svg 属性/标签名大小写映射 */
export const SVG_DICT = {
	animatetransform: 'animateTransform',
	lineargradient: 'linearGradient',
	viewbox: 'viewBox',
	attributename: 'attributeName',
	repeatcount: 'repeatCount',
	repeatdur: 'repeatDur',
	foreignobject: 'foreignObject'
}

export const BLANK_CHAR = makeMap(' ,\r,\n,\t,\f')

// #ifdef H5 || APP-PLUS
TRUST_TAGS.iframe = true
TRUST_TAGS.embed = true
// #endif

export { makeMap }

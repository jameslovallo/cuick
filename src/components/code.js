import { parse } from 'https://cdn.jsdelivr.net/npm/marked/+esm'
import { highlightAllUnder } from 'https://cdn.skypack.dev/prismjs@1.29.0'
import cuick from '../cuick.js'

const codeTemplate = (doc, extension) => `
\`\`\`${extension}
${doc}
\`\`\`
`

export default cuick({
	tag: 'code',
	props: { src: '/README.md', prismTheme: 'one-dark' },
	render() {
		const theme = this.prismTheme.startsWith('http')
			? this.prismTheme
			: `https://cdn.jsdelivr.net/npm/prism-themes/themes/prism-${this.prismTheme}.css`
		const prismStyles = `
			<link rel="stylesheet" href="${theme}">
			<style>
				code[class*='language-'],
				pre[class*='language-'] {
					font-size: 0.9rem;
					line-height: 1.5;
					margin: 0;
					tab-size: 2;
				}
			</style>
		`
		fetch(this.src)
			.then((res) => res.text())
			.then((doc) => {
				if (this.src.endsWith('.md')) {
					this.root.innerHTML = prismStyles + parse(doc)
				} else {
					const srcArr = this.src.split(['.'])
					const extension = srcArr[srcArr.length - 1]
					this.root.innerHTML =
						prismStyles +
						parse(codeTemplate(doc.replace(/\t/g, '  '), extension))
				}
				highlightAllUnder(this.root)
			})
	},
})

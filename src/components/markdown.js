import { parse } from 'https://cdn.jsdelivr.net/npm/marked/+esm'
import prism from 'https://cdn.jsdelivr.net/npm/prismjs/+esm'
import cuick from '../cuick.js'

export default cuick({
	tag: 'md',
	props: { src: '/README.md', prismTheme: 'one-dark' },
	render() {
		const theme = this.prismTheme.startsWith('http')
			? this.prismTheme
			: `https://cdn.jsdelivr.net/npm/prism-themes/themes/prism-${this.prismTheme}.css`
		this.root.innerHTML += `<link rel="stylesheet" href="${theme}">`
		fetch(this.src)
			.then((res) => res.text())
			.then((text) => {
				this.root.innerHTML += parse(text)
				prism.highlightAllUnder(this.root)
			})
	},
})

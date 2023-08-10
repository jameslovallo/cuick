import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'app',
	fetch(page) {
		fetch((page === '/' ? '' : '/pages' + page) + '/index.html')
			.then((res) => res.text())
			.then((html) => {
				if (page === '/') {
					html = html.split('<cuick-app>')[1].split('</cuick-app>')[0].trim()
				}
				history.pushState({ html }, '', page)
				this.innerHTML = html
				this.handleLinks(this)
				this.dispatchEvent(new CustomEvent('fetch', { detail: page }))
			})
	},
	handleLinks(target) {
		const links = target.querySelectorAll('a')
		links.forEach((a) => {
			const { pathname } = a
			if (pathname.startsWith('/')) {
				a.addEventListener('click', (e) => {
					e.preventDefault()
					this.fetch(pathname)
				})
			}
		})
	},
	setup() {
		const { pathname } = location
		let firstPage = pathname === '/' ? undefined : pathname
		firstPage && firstPage !== '/' && this.fetch(firstPage)
		this.handleLinks(document)
		addEventListener('popstate', (e) => {
			this.innerHTML = e.state.html
			this.handleLinks(this)
		})
	},
	template() {
		return html`<slot></slot>`
	},
	styles: css`
		:host {
			display: block;
		}
	`,
})

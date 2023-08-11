import cuick from '../cuick.js'

export default cuick({
	tag: 'app',
	shadow: false,
	pageRoot: '/pages',
	fetch(page) {
		fetch(this.pageRoot + page + '/index.html')
			.then((res) => res.text())
			.then((html) => {
				history.pushState({ html }, '', page)
				this.innerHTML = html
				this.handleScripts()
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
	handleScripts() {
		const scripts = this.querySelectorAll('script')
		scripts.forEach((script) => {
			const newScript = document.createElement('script')
			const { src, type, textContent } = script
			if (src) newScript.src = src
			if (type) newScript.type = type
			if (textContent) newScript.textContent = textContent
			script.replaceWith(newScript)
		})
	},
	setup() {
		const { pathname } = location
		this.fetch(pathname)
		this.handleLinks(document)
		addEventListener('popstate', (e) => {
			this.innerHTML = e.state.html
			this.handleLinks(this)
		})
	},
})

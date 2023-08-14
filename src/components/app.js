import cuick from '../cuick.js'

export default cuick({
	tag: 'app',
	shadow: false,
	loaded: false,
	props: { pageRoot: '/pages' },
	async fetch(page) {
		if (!this.loaded || page !== location.pathname) {
			try {
				const response = await fetch(this.pageRoot + page + '/index.html')
				const { status } = await response
				const html = await response.text()
				history.pushState({ html }, '', page)
				if (status === 200 && !html.startsWith('<!DOCTYPE html>')) {
					this.innerHTML = html
					this.handleScripts()
					this.handleLinks(this)
					this.dispatchEvent(new CustomEvent('fetch', { detail: page }))
				} else {
					this.innerHTML = `
					<h1>Error 404</h1>
					<p>We couldn't find that page, please try again.</p>
					<a href="/">Go Home</a>
				`
				}
			} catch (error) {
				console.error(error)
			}
		}
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
		this.loaded = true
		this.handleLinks(document)
		addEventListener('popstate', (e) => {
			this.innerHTML = e.state.html
			this.handleLinks(this)
		})
	},
})

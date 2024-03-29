import cuick from '../cuick.js'

const page404 = `
	<style>
		html, body {
			height: 100%;
		}
		main {
			align-items: center;
			display: flex;
			height: 100%;
			justify-content: center;
			text-align: center;
		}
	</style>
	<h1>Error 404</h1>
	<p>Sorry, that page could not be found.</p>
	<a href="/">Go Home</a>
`

export default cuick({
	tag: 'app',
	shadow: false,
	loaded: false,
	async fetch(page) {
		try {
			const response = await fetch(
				this.pageRoot + (page === '/' ? '' : page) + '/index.html'
			)
			const { status } = await response
			let html = await response.text()
			history.pushState({ html }, '', page)
			if (status === 200) {
				if (html.includes('</cuick-app>')) {
					html = html.split(/<cuick-app.+?>/g)[1].split('</cuick-app>')[0]
				}
				this.innerHTML = html
				this.handleScripts()
				this.dispatchEvent(new CustomEvent('fetch', { detail: page }))
			} else this.innerHTML = page404
			this.handleLinks(this)
		} catch (error) {
			console.error(error)
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
		const dev = this.children.length === 0
		this.pageRoot = dev ? '/pages' : ''
		dev && this.fetch(pathname)
		this.handleLinks(document)
		addEventListener('popstate', (e) => {
			const {
				state: { html },
			} = e
			this.innerHTML = html.includes('Cannot GET') ? page404 : html
			this.handleLinks(this)
		})
	},
})

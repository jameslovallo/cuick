cuick({
	tag: 'i18n-nav',
	setup() {
		this.nav = this.context('i18n').t().nav
	},
	template({ nav: { home, about, contact } }) {
		return html`<nav>
			<a>${home}</a>
			<a>${about}</a>
			<a>${contact}</a>
		</nav>`
	},
})

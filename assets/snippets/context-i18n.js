cuick({
	tag: 'i18n-nav',
	template() {
		const { home, about, contact } = this.context('i18n').t().nav
		return html`<nav>
			<a>${home}</a>
			<a>${about}</a>
			<a>${contact}</a>
		</nav>`
	},
})

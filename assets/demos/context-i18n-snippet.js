cuick({
	tag: 'i18n-nav',
	template() {
		const {
			nav: { home, about, contact },
		} = this.context('i18n').t()
		return html`<nav>
			<a>${home}</a>
			<a>${about}</a>
			<a>${contact}</a>
		</nav>`
	},
})

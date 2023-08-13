/**
 * Assign languages
 */

const i18n = document.querySelector('cuick-i18n')
i18n.languages.en = {
	label: 'English',
	nav: {
		home: 'Home',
		about: 'About',
		contact: 'Contact Us',
	},
}
i18n.languages.es = {
	label: 'Español',
	nav: {
		home: 'Inicio',
		about: 'Acerca de',
		contact: 'Contáctanos',
	},
}
i18n.languages.fr = {
	label: 'French',
	nav: {
		home: 'Accueil',
		about: 'À Propos',
		contact: 'Contactez-Nous',
	},
}

/**
 * Reference translations using Context API
 */

import cuick, { css, html } from '/src/cuick.js'

cuick({
	tag: 'i18n-nav',
	template() {
		const i18n = this.context('i18n')
		const { home, about, contact } = i18n.t().nav
		return html`
			<nav>
				<a>${home}</a>
				<a>${about}</a>
				<a>${contact}</a>
				<select
					@change=${(e) => {
						i18n.selectedLanguage = e.target.value
					}}
				>
					${Object.keys(i18n.languages).map((lang) => {
						return html`
							<option value=${lang}>${i18n.languages[lang].label}</option>
						`
					})}
				</select>
			</nav>
		`
	},
	styles: css`
		nav {
			align-items: center;
			background: var(--theme-surface-background);
			border: 1px solid var(--theme-border);
			box-shadow: var(--theme-surface-shadow);
			display: inline-flex;
			font-size: 14px;
			gap: 1em;
			padding: 0.5em;
		}
		@media (max-width: 480px) {
			nav {
				display: grid;
			}
		}
	`,
})

cuick({
	tag: 'i18n-flag',
	template() {
		const flagPath = 'https://s2.svgbox.net/flags-hd.svg?ic='
		let { selectedLanguage: lang } = this.context('i18n')
		if (lang === 'en') lang = 'gb'
		return html`<img src=${flagPath + lang} />`
	},
	styles: css`
		img {
			border: 1px solid var(--theme-border);
			display: block;
			height: auto;
			width: 100px;
		}
	`,
})

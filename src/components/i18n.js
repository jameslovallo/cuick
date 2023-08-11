import cuick from '../cuick.js'

export default cuick({
	tag: 'i18n',
	shadow: false,
	languages: {},
	props: { selectedLanguage: 'en' },
	setup() {
		this.setAttribute('context', 'i18n')
	},
	t() {
		return this.languages[this.selectedLanguage]
	},
})

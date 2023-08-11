import cuick, { html } from '../cuick.js'

cuick({
	tag: 'counter',
	count: 0,
	template({ count }) {
		const add = () => this.count++
		return html`<button @click=${add}>${count}</button>`
	},
})

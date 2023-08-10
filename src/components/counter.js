import cuick, { html } from '../cuick.js'

export default cuick({
	tag: 'counter',
	count: 0,
	template({ count }) {
		return html`<button @click=${() => this.count++}>
			Count: ${count}
		</button>`
	},
})

import { highlightAllUnder } from 'https://cdn.skypack.dev/prismjs@1.29.0'
import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'story',
	setup() {
		this.el = this.firstElementChild
		this.el.addEventListener('update', () => {
			const code = this.root.querySelector('code')
			if (code) {
				code.textContent = this.el.outerHTML.replaceAll('\n\t', '\n')
				highlightAllUnder(this.root)
			}
		})
	},
	onRender() {
		this.el.dispatchEvent(new Event('update'))
	},
	template({ el: { propConfigs } }) {
		return html`
			<link
				rel="stylesheet"
				href="https://cdn.jsdelivr.net/npm/prism-themes/themes/prism-one-dark.css"
			/>
			<slot></slot>
			<form part="controls">
				${Object.keys(propConfigs).map((prop) => {
					const { name, defaultValue, controlType, options } = propConfigs[prop]
					return html`
						<label>
							${name}
							${controlType !== 'select'
								? html`<input
										type=${controlType}
										value=${this.el[prop]}
										@input=${(e) => {
											if (controlType === 'checkbox') {
												e.target.checked
													? this.el.setAttribute(prop, '')
													: this.el.removeAttribute(prop)
											} else {
												this.el[prop] = e.target.value
											}
										}}
								  />`
								: html`
										<select @input=${(e) => (this.el[prop] = e.target.value)}>
											${options.map((opt) => html`<option>${opt}</option>`)}
										</select>
								  `}
						</label>
					`
				})}
			</form>
			<pre class="language-html"><code></code></pre>
		`
	},
	styles: css`
		:host {
			display: block;
			border: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
			border-radius: 0.5rem;
			overflow: hidden;
		}
		slot {
			display: block;
			padding: 1rem;
		}
		[part='controls'] {
			background: var(--themeSurfaceBg, var(--defaultSurfaceBg));
			list-style: none;
			margin: 0;
			padding: 0;
		}
		label {
			align-items: center;
			display: flex;
			justify-content: space-between;
			padding: 0.5rem 1rem;
		}
		label:not(:last-of-type) {
			border-bottom: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
		}
		input,
		select {
			appearance: none;
			background: transparent;
			border: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
			border-radius: 1rem;
			font: inherit;
			height: 2rem;
			padding: 0 1rem;
		}
		select {
			min-width: 100px;
		}
		code[class*='language-'],
		pre[class*='language-'] {
			border-radius: 0;
			font-size: 0.9rem;
			line-height: 1.5;
			margin: 0;
			tab-size: 2;
		}
	`,
})

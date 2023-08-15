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
	copyCode() {
		navigator.clipboard.writeText(this.el.outerHTML)
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
					const { name, controlType, options } = propConfigs[prop]
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
										<select
											value=${this.el[prop]}
											@input=${(e) => (this.el[prop] = e.target.value)}
										>
											${options.map((opt) => html`<option>${opt}</option>`)}
										</select>
								  `}
						</label>
					`
				})}
			</form>
			<div part="code">
				HTML
				<button @click=${() => this.copyCode()}>
					<svg viewBox="0 0 24 24">
						<path
							d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
						/>
					</svg>
					Copy
				</button>
			</div>
			<pre class="language-html"><code></code></pre>
		`
	},
	styles: css`
		:host {
			display: block;
			border-radius: 0.5rem;
			box-shadow: var(--themeSurfaceShadow, var(--defaultSurfaceShadow));
			overflow: hidden;
		}
		@media (prefers-color-scheme: dark) {
			:host {
				border: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
				box-shadow: none;
			}
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
			border-top: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
			display: flex;
			justify-content: space-between;
			padding: 0.5rem 1rem;
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
		[part='code'] {
			align-content: center;
			color: white;
			display: flex;
			font-size: 0.9rem;
			justify-content: space-between;
			margin-bottom: -3rem;
			padding: 1rem;
		}
		[part='code'] button {
			align-items: center;
			background: transparent;
			border: none;
			color: inherit;
			cursor: pointer;
			display: flex;
			gap: 0.5rem;
			padding: 0;
		}
		[part='code'] button svg {
			display: block;
			fill: currentColor;
			width: 0.75rem;
		}
		code[class*='language-'],
		pre[class*='language-'] {
			border-radius: 0;
			font-size: 0.9rem;
			line-height: 1.5;
			margin: 0;
			tab-size: 2;
		}
		pre[class*='language-'] {
			padding-top: 3rem;
		}
	`,
})

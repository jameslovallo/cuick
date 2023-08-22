import { highlightAllUnder } from 'https://cdn.skypack.dev/prismjs@1.29.0'
import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'story',
	setup() {
		this.el = this.firstElementChild
	},
	updateCode() {
		this.code.textContent = this.el.outerHTML.replaceAll('\n\t', '\n')
		highlightAllUnder(this.root)
	},
	onRender() {
		this.code = this.root.querySelector('code')
		this.code && this.updateCode()
	},
	getStyles(styles) {
		if (styles) {
			styles = styles.split('/* End of default theme */')[1]
			const host = styles.match(/:host {[\s\S]*?}/gm)
			if (host && host[0]) {
				const rules = host[0].match(/--.+?:.+?;/gm)
				return rules.map((rule) => rule.replace(';', '').split(': '))
			} else return []
		} else return []
	},
	copyCode() {
		navigator.clipboard.writeText(this.el.outerHTML)
	},
	template({ el: { propConfigs, styles } }) {
		styles = this.getStyles(styles)
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
								? html`
										<input
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
												this.updateCode()
											}}
										/>
								  `
								: html`
										<select
											@input=${(e) => {
												this.el[prop] = e.target.value
												this.updateCode()
											}}
										>
											${options.map(
												(opt) =>
													html`
														<option
															selected=${this.el[prop] === opt ? '' : null}
														>
															${opt}
														</option>
													`
											)}
										</select>
								  `}
						</label>
					`
				})}
				${styles.map((style) => {
					const [prop, value] = style
					const isColor =
						prop.toLowerCase().endsWith('color') ||
						prop.toLowerCase().endsWith('bg')
					return html`
						<label>
							<span>${prop}</span>
							<input
								type=${isColor ? 'color' : 'text'}
								value=${value}
								style=${`background: ${value}`}
								@input=${(e) => {
									console.log('input')
									this.el.style.setProperty(prop, e.target.value)
									e.target.style.background = e.target.value
									this.updateCode()
								}}
							/>
						</label>
					`
				})}
			</form>
			<div part="code">
				<span>HTML</span>
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
			border-top: var(--themeSurfaceDivider, var(--defaultSurfaceDivider));
			display: flex;
			font-size: 14px;
			gap: 1rem;
			justify-content: space-between;
			padding: 0.5rem 1rem;
		}
		label span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		input,
		select {
			-moz-appearance: none;
			-webkit-appearance: none;
			appearance: none;
			border-radius: 1rem;
			border: var(--themeSurfaceDivider, var(--defaultSurfaceDivider));
			font: inherit;
			height: 2rem;
			margin: 0;
			max-width: 50%;
			padding: 0 0.75rem;
		}
		select {
			min-width: 100px;
		}
		input[type='checkbox'] {
			padding: 2px;
			width: 100px;
		}
		input[type='checkbox']:before {
			align-items: center;
			border: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
			border-radius: 1rem;
			box-shadow: var(--themeSurfaceShadow, var(--defaultSurfaceShadow));
			box-sizing: border-box;
			content: 'false';
			display: flex;
			height: 100%;
			justify-content: center;
			transition: 0.33s;
			width: 60px;
		}
		input[type='checkbox']:checked:before {
			content: 'true';
			margin-left: 34px;
		}
		input[type='color']::-webkit-color-swatch {
			display: none;
		}
		input[type='color']::-moz-color-swatch {
			display: none;
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
		[part='code'] > * {
			opacity: 0.75;
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
		[part='code'] button:hover {
			opacity: 1;
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

import { highlightElement } from 'https://cdn.skypack.dev/prismjs@1.29.0'
import cuick, { camelToKebab, css, html } from '../cuick.js'

cuick({
	tag: 'story',
	props: { element: '' },
	render() {
		this.root.innerHTML = `
			<link rel="stylesheet" href="https://unpkg.com/prism-themes@1.9.0/themes/prism-one-dark.css">
			<style>${this.styles}</style>
			<slot></slot>
			<div part="controls"></div>
			<div part="code-actions">
				HTML
				<button part="code-copy-button">
					Copy
					<svg viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" /></svg>
				</button>
			</div>
			<pre><code part="code" class="language-html"></code></pre>
		`

		const el = this.firstElementChild || this.querySelector(this.element)
		const code = this.root.querySelector('[part=code]')
		const copy = this.root.querySelector('[part=code-copy-button]')
		const controls = this.root.querySelector('[part=controls]')

		const elHTML = () => el.outerHTML.replace(/\n\t/g, '\n')

		const highlightCode = () => {
			code.textContent = elHTML()
			highlightElement(code)
		}

		highlightCode()

		el.addEventListener('update', highlightCode)

		copy.addEventListener('click', () => {
			navigator.clipboard.writeText(elHTML())
		})

		if (el.props) {
			Object.keys(el.props).forEach((key) => {
				const kebab = camelToKebab(key)
				const config = el.props[key]

				let propType = typeof config,
					controlType = 'input',
					inputType,
					options,
					handler = (t) => el.setAttribute(kebab, t.value)

				if (propType === 'string') {
					inputType = 'text'
				} else if (propType === 'number') {
					inputType = 'number'
				} else if (propType === 'boolean') {
					inputType = 'checkbox'
					handler = (t) =>
						t.checked ? el.setAttribute(kebab, '') : el.removeAttribute(kebab)
				} else if (propType === 'object') {
					if (Array.isArray(config) || config.options) {
						controlType = 'select'
						options = config?.options || config
					}
				}

				const label = document.createElement('label')
				label.innerText = key
				controls.appendChild(label)

				const control = document.createElement(controlType)
				if (inputType) control.type = inputType
				if (inputType === 'checkbox') {
					control.checked = el[key]
				} else control.value = el[key]

				if (options) {
					options.forEach((opt) => {
						const option = document.createElement('option')
						option.innerText = opt
						control.appendChild(option)
					})
				}

				if (config.default) control.value = config.default
				label.appendChild(control)
				control.addEventListener('input', (e) => handler(e.target))
			})
		}

		if (el.styles && el.styles.includes(':host')) {
			const styles = el.styles
				.split(':host {')[1]
				.split('}')[0]
				.match(/--[a-z-]+: .+?(?=;)/g)
			const cssVars = styles.map((cssVar) => {
				let [name, value] = cssVar.split(':')
				return { name, value }
			})
			cssVars.forEach((cssVar) => {
				const { name, value } = cssVar
				const label = document.createElement('label')
				label.innerText = name
				controls.appendChild(label)
				const input = document.createElement('input')
				if (name.endsWith('color')) {
					input.type = 'color'
					input.style.background = value
				}
				input.value = value
				input.addEventListener('input', (e) => {
					el.style.setProperty(name, e.target.value)
					e.target.style.background = e.target.value
					highlightCode()
				})
				label.appendChild(input)
			})
		}
	},
	styles: css`
		:host {
			--canvas-max-height: unset;
			border-radius: 0.25rem;
			box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 1px,
				rgba(0, 0, 0, 0.07) 0px 0px 0px 1px;
			display: block;
			overflow: hidden;
		}
		slot {
			display: block;
			max-height: var(--canvas-max-height);
			overflow: auto;
			padding: 1rem;
		}
		label {
			align-items: center;
			background: #fafafa;
			border-top: 1px solid #eee;
			display: flex;
			justify-content: space-between;
			padding: 0.75rem;
		}
		input,
		select {
			background: white;
			border: none;
			border-radius: 1rem;
			box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
			display: block;
			margin: 0;
			padding: 0.5rem;
		}
		select {
			cursor: pointer;
			min-width: 100px;
		}
		input[type='color'] {
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			border: none;
			border-radius: 1rem;
			cursor: pointer;
			font: inherit;
		}
		input[type='color']::-webkit-color-swatch {
			border: none;
			opacity: 0;
		}
		input[type='color']::-moz-color-swatch {
			border: none;
			opacity: 0;
		}
		input[type='checkbox'] {
			-moz-appearance: none;
			-webkit-appearance: none;
			align-items: center;
			appearance: none;
			background: transparent;
			cursor: pointer;
			display: flex;
			height: 2rem;
			overflow: hidden;
			padding: 1px;
			width: 100px;
		}
		input[type='checkbox']:before {
			align-items: center;
			background: white;
			border-radius: 1rem;
			box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
			content: 'false';
			display: flex;
			height: 100%;
			justify-content: center;
			margin-left: 0;
			transition: 0.25s;
			width: 60px;
		}
		input[type='checkbox']:checked:before {
			color: dodgerblue;
			content: 'true';
			margin-left: 38px;
		}
		[part='code-actions'] {
			align-items: center;
			background: rgb(40, 44, 52);
			color: #ccc;
			display: flex;
			font-size: 0.75rem;
			padding: 0.75rem 0.75rem 0;
			justify-content: space-between;
		}
		[part='code-actions'] button {
			align-items: center;
			background: none;
			border: 0;
			color: inherit;
			cursor: pointer;
			display: flex;
			font-size: 0.75rem;
			gap: 0.5rem;
		}
		[part='code-actions'] button:hover {
			color: white;
		}
		[part='code-actions'] svg {
			display: block;
			fill: currentColor;
			width: 0.75rem;
		}
		code[class*='language-'],
		pre[class*='language-'] {
			border-radius: 0;
			font-size: 0.75rem;
			line-height: 2;
			margin: 0;
		}
		pre[class*='language-'] {
			padding: 0.5em 1em 0.75rem;
		}
	`,
})

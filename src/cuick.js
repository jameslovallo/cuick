import { camelToKebab, css, setDefaultTheme } from './utils/index.js'
import { html, svg, render as uhtml } from '//cdn.skypack.dev/uhtml'
export { camelToKebab, css, html, svg }

setDefaultTheme()

export default function cuick(options) {
	const { shadow, props } = options

	let { tag } = options
	if (!tag.includes('-')) tag = 'cuick-' + tag

	const update = new Event('update')
	const propNames = Object.keys(props || {})

	const specialKeys = [
		'tag',
		'shadow',
		'props',
		'setup',
		'template',
		'handlebars',
		'styles',
		'render',
		'onIntersect',
		'onResize',
	]

	class c extends HTMLElement {
		constructor() {
			super()
			Object.assign(this, options)

			if (shadow === false) {
				this.root = this
			} else {
				this.attachShadow({ mode: 'open' })
				this.root = this.shadowRoot
			}

			if (propNames) this.defineProps()
			this.defineState()
			if (typeof this.inersected === 'function') this.handleIntersect()
			if (typeof this.onResize === 'function') this.handleResize()
		}

		debounce(fn) {
			var timeout
			return function () {
				if (timeout) cancelAnimationFrame(timeout)
				timeout = requestAnimationFrame(() => fn.apply(this, arguments))
			}
		}

		connectedCallback() {
			this.addEventListener('update', this.debounce(this.render))
			this.setup && this.setup()
			this.dispatchEvent(update)
		}

		defineProps() {
			propNames.forEach((prop) => {
				const kebab = camelToKebab(prop)
				const config = props[prop]
				let configType = typeof config,
					defaultValue = config?.default || config,
					options,
					controlType
				if (configType === 'object') {
					if (Array.isArray(config)) {
						defaultValue = config[0]
						options = config
					} else {
						if (config.options) {
							defaultValue = config?.default || config.options[0]
							options = config.options
						}
					}
				}
				switch (typeof defaultValue) {
					case 'string':
						controlType = 'text'
					case 'number':
						controlType = 'number'
					case 'boolean':
						controlType = 'checkbox'
				}
				if (prop.toLowerCase().endsWith('color')) controlType = 'color'
				if (options) controlType = 'select'

				Object.defineProperty(this, prop, {
					get: () => {
						return configType === 'boolean'
							? this.hasAttribute(kebab)
							: this.getAttribute(kebab) || defaultValue
					},
					set: (v) => {
						const isBool = configType === 'boolean'
						v
							? this.setAttribute(kebab, isBool ? '' : v || defaultValue)
							: this.removeAttribute(v)
					},
				})
			})
		}

		static get observedAttributes() {
			return propNames.map((prop) => camelToKebab(prop))
		}

		attributeChangedCallback() {
			this.dispatchEvent(update)
		}

		defineState() {
			const reactive = (object) => {
				if (object === null || typeof object !== 'object') {
					return object
				}
				for (const property in object) {
					object[property] = reactive(object[property])
				}
				return new Proxy(object, {
					get: (target, property) => {
						return target[property]
					},
					set: (target, property, value) => {
						target[property] = reactive(value)
						this.dispatchEvent(update)
						return true
					},
					deleteProperty: (target, prop) => {
						delete target[prop]
						this.dispatchEvent(update)
						return true
					},
				})
			}
			const state = {}
			Object.keys(options).forEach((key) => {
				if (!specialKeys.includes(key) && typeof options[key] !== 'function') {
					state[key] = options[key]
				}
			})
			this.__state = reactive(state)
			Object.keys(this.__state).forEach((key) => {
				Object.defineProperty(this, key, {
					get: () => {
						return this.__state[key]
					},
					set: (v) => (this.__state[key] = v),
				})
			})
		}

		context(c) {
			if (!this.__ctx) this.__ctx = {}
			if (!this.__ctx[c]) {
				const closest = (selector, base = this) => {
					function __closestFrom(el) {
						if (!el || el === document || el === window) return null
						let found = el.closest(selector)
						return found ? found : __closestFrom(el.getRootNode().host)
					}
					return __closestFrom(base)
				}
				this.__ctx[c] = closest(`[context=${c}]`)
				this.__ctx[c].addEventListener('update', () =>
					this.dispatchEvent(update)
				)
				return this.__ctx[c]
			} else return this.__ctx[c]
		}

		uhtml() {
			const template = this.template(this)
			// prettier-ignore
			const css = this.styles && html`<style>${this.styles}</style>`
			uhtml(this.root, html`${template}${css}`)
		}

		handlebars() {
			import('//cdn.skypack.dev/handlebars').then((m) => {
				const handlebars = m.default
				const html = (v) => v[0]
				const compiled = m.default.compile(
					this.hbs(html, handlebars),
					this
				)(this)
				const style = this.styles ? `<style>${this.styles}</style>` : ''
				this.root.innerHTML = compiled + style
			})
		}

		render() {
			if (this.template && typeof this.template === 'function') this.uhtml()
			if (this.hbs && typeof this.hbs === 'function') this.handlebars()
		}

		handleIntersect() {
			new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						entry.isIntersecting &&
							this.onIntersect(entry.intersectionRatio.toFixed(2))
					})
				},
				{
					root: null,
					rootMargin: '0px',
					threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
				}
			).observe(this)
		}

		handleResize() {
			new ResizeObserver(() =>
				requestAnimationFrame(() => this.onResize(Math.round(this.clientWidth)))
			).observe(this)
		}
	}

	!customElements.get(tag) && customElements.define(tag, c)
}

import { camelToKebab, css, fetchAndRender } from './utils/index.js'
import { html, svg, render as uhtml } from '//cdn.skypack.dev/uhtml'
export { camelToKebab, css, html, svg }

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
		'styles',
		'intersected',
		'resized',
		'render',
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
			if (typeof this.resized === 'function') this.handleResize()
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
			propNames.forEach((key) => {
				let defaultValue, handler, options

				const kebab = camelToKebab(key)

				const propHandlers = {
					boolean: () => this.hasAttribute(kebab),
					number: (v) => Number(v),
					string: (v) => v,
				}

				const config = this.props[key]
				const type = typeof config
				const isObj = type === 'object'

				if (isObj) {
					const isArr = Array.isArray(config)
					if (isArr) {
						options = config
						defaultValue = config[0]
						handler = propHandlers[typeof defaultValue]
					} else {
						options = config.options
						defaultValue = config?.default || (options && options[0])
						handler =
							config?.handler || propHandlers[typeof defaultValue] || ((v) => v)
					}
				} else {
					defaultValue = config
					handler = propHandlers[type]
				}

				const handleBool = (v) => {
					if (v === true) {
						this.setAttribute(kebab, '')
					} else {
						this.removeAttribute(kebab)
					}
				}

				const readAttr = () => this.getAttribute(kebab) || defaultValue

				Object.defineProperty(this, key, {
					get: () => {
						const v = readAttr()
						return handler(v)
					},
					set: (v) => {
						if (type === 'boolean') {
							handleBool(v)
						} else {
							if (options && !options.includes(v)) {
								console.error(
									`Value '${v}' cannot be assigned to prop '${key}'`
								)
							} else this.setAttribute(kebab, v)
						}
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

		async render() {
			if (this.template || this.fetchTemplate) {
				const template = this.fetchTemplate
					? await fetchAndRender(this.fetchTemplate())
					: await this.template(this)
				// prettier-ignore
				const css = this.styles && html`<style>${this.styles}</style>`
				uhtml(this.root, html`${template}${css}`)
			}
			this.hbs &&
				import('//cdn.skypack.dev/handlebars').then(async (m) => {
					const handlebars = m.default
					const template =
						typeof this.hbs === 'function'
							? await this.hbs(handlebars)
							: this.hbs
					const compiled = m.default.compile(template, this)(this)
					const style = this.styles ? `<style>${this.styles}</style>` : ''
					this.root.innerHTML = compiled + style
				})
		}

		handleIntersect() {
			new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						entry.isIntersecting &&
							this.intersected(entry.intersectionRatio.toFixed(2))
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
				requestAnimationFrame(() => this.resized(Math.round(this.clientWidth)))
			).observe(this)
		}
	}

	!customElements.get(tag) && customElements.define(tag, c)
}

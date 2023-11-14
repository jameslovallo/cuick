import cuick, { css, html } from '../cuick.js'
import { componentNames } from './index.js'

const app = document.querySelector('cuick-app')
const drawer = document.querySelector('nav cuick-dialog')

cuick({
	tag: 'sidebar',
	currentPath: location.pathname,
	setup() {
		app.addEventListener('fetch', (e) => {
			this.currentPath = e.detail
			drawer.closeDialog()
		})
	},
	template({ currentPath }) {
		return html`<slot></slot>
			<p>Components</p>
			<ul>
				${componentNames
					.filter((name) => name !== 'story')
					.map((name) => {
						const href = `/stories/${name}`
						return html`<li>
							<a
								class=${currentPath === href ? 'active' : null}
								href=${href}
								@click=${(e) => {
									e.preventDefault()
									app.fetch(href)
								}}
							>
								${name}
							</a>
						</li>`
					})}
			</ul>`
	},
	styles: css`
		:host {
			/* surface */
			border: none;
		}
		p {
			font-weight: bold;
			margin: 0 1rem 0.5rem;
		}
		ul {
			list-style: none;
			margin: 0;
			padding: 0;
			& a {
				color: currentColor;
				display: block;
				padding: 0.5rem 1rem;
				position: relative;
				text-decoration: none;
				&:hover:before,
				&.active:before {
					content: '';
					height: 100%;
					left: 0;
					opacity: 0.1;
					position: absolute;
					top: 0;
					width: 100%;
					background: var(--primaryBg);
				}
				&.active {
					color: var(--primaryBg);
				}
				&:active {
					background: var(--primaryBg);
					color: white;
				}
			}
		}
	`,
})

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
				${componentNames.map((name) => {
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
			--sidebar-background-color: #fafafa;
			--sidebar-color: currentcolor;
			--sidebar-link-color: currentcolor;
			--sidebar-link-active-color: dodgerblue;
			--sidebar-link-hover-background-color: #eee;
			background: var(--sidebar-background-color);
			display: block;
			padding: 1rem 0;
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
				color: var(--sidebar-link-color);
				display: block;
				padding: 0.5rem 1rem;
				text-decoration: none;
				&:hover,
				&.active {
					background: var(--sidebar-link-hover-background-color);
				}
				&.active {
					color: var(--sidebar-link-active-color);
				}
				&:active {
					background: var(--sidebar-link-active-color);
					color: white;
				}
			}
		}
	`,
})

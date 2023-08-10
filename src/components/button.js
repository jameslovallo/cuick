import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'button',
	props: {
		label: 'Click me',
		href: '',
		target: ['_self', '_blank'],
		size: { default: 'medium', options: ['small', 'medium', 'large'] },
		shape: ['squared', 'rounded', 'pill'],
		variant: ['filled', 'outlined', 'subtle', 'ghost', 'text'],
		icon: false,
	},
	template({ label, href, target, size, shape, variant, icon }) {
		const classList = [size, shape, variant, icon ? 'icon' : ''].join(' ')
		return html`
			${href
				? html`<a class=${classList} href=${href} target=${target}>
						<slot>${label}</slot>
				  </a>`
				: html`<button class=${classList}>
						<slot>${label}</slot>
				  </button>`}
		`
	},
	styles: css`
		:host {
			--button-color: dodgerblue;
			--button-filled-color: white;
			display: inline-block;
		}
		a,
		button {
			background: transparent;
			border: none;
			color: var(--button-color);
			cursor: pointer;
			font-size: 14px;
			line-height: 1;
			overflow: hidden;
			padding: unset;
			position: relative;
		}
		a:before,
		button:before {
			content: '';
			background-color: var(--button-color);
			height: 100%;
			left: 0;
			position: absolute;
			top: 0;
			width: 100%;
			z-index: -1;
		}
		slot {
			align-items: center;
			display: flex;
			gap: 0.25rem;
		}
		.small slot::slotted(*) {
			width: 1rem;
		}
		.medium slot::slotted(*) {
			width: 1.25rem;
		}
		.large slot::slotted(*) {
			width: 1.5rem;
		}
		.small {
			height: 22px;
			padding: 0 0.5rem;
		}
		.medium {
			height: 30px;
			padding: 0 1rem;
		}
		.large {
			height: 38px;
			padding: 0 1.5rem;
		}
		.icon.small {
			width: 22px;
		}
		.icon.medium {
			width: 30px;
		}
		.icon.large {
			width: 38px;
		}
		.icon {
			align-items: center;
			aspect-ratio: 1;
			display: inline-flex;
			justify-content: center;
			padding: 0;
		}
		.icon slot::slotted(*) {
			color: currentcolor;
			width: 1rem;
		}
		.icon.medium slot::slotted(*) {
			width: 1.25rem;
		}
		.icon.large slot::slotted(*) {
			width: 1.5rem;
		}
		.squared {
			border-radius: 0;
		}
		.rounded {
			border-radius: 0.25rem;
		}
		.pill {
			border-radius: 3rem;
		}
		.filled {
			color: var(--button-filled-color);
		}
		.filled:hover:before {
			opacity: 0.8;
		}
		.filled:active:before {
			opacity: 1;
		}
		.outlined,
		.subtle {
			box-shadow: inset 0 0 0 1px var(--button-color);
		}
		.outlined:hover:before,
		.text:hover:before {
			opacity: 0.2;
		}
		.outlined:before,
		.outlined:active:before,
		.text:before,
		.text:active:before {
			opacity: 0;
		}
		.ghost:hover:before,
		.subtle:hover:before {
			opacity: 0.25;
		}
		.ghost:before,
		.subtle:before,
		.ghost:active:before,
		.subtle:active:before {
			opacity: 0.1;
		}
	`,
})

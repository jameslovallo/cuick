import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'badge',
	props: {
		label: 'ribbon',
		href: '',
		target: ['_self', '_blank'],
		variant: ['ribbon', 'badge'],
	},
	template({ href, label, target, variant }) {
		const el = (slot) =>
			href
				? html`<a part=${variant} href=${href} target=${target}> ${slot} </a>`
				: html`<div part="${variant}">${slot}</div>`
		return html`
			<slot><div class="demo-box"></div></slot>
			${el(html`<span part="label">${label}</span>`)}
		`
	},
	styles: css`
		:host {
			--badge-background-color: dodgerblue;
			--badge-color: white;
			display: block;
			position: relative;
			width: max-content;
		}
		[part='badge'],
		[part='ribbon'] {
			color: var(--badge-color);
			font-size: 12px;
			letter-spacing: 1px;
			text-decoration: none;
			text-transform: uppercase;
		}
		[part='badge'] {
			align-items: center;
			background: var(--badge-background-color);
			border-radius: 12px;
			display: flex;
			height: 24px;
			justify-content: center;
			min-width: 24px;
			position: absolute;
			right: -6px;
			top: -6px;
		}
		[part='badge'] [part='label'] {
			margin: 0 6px;
		}
		[part='ribbon'] {
			color: var(--badge-color);
			position: absolute;
			right: -8px;
			top: 8px;
		}
		[part='ribbon']:before {
			background: var(--badge-background-color);
			clip-path: polygon(0 0, 0% 100%, 100% 0);
			content: '';
			filter: brightness(0.66);
			height: 8px;
			position: absolute;
			right: 0;
			top: 100%;
			width: 8px;
		}
		[part='ribbon'] [part='label'] {
			background: var(--badge-background-color);
			clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%);
			display: block;
			height: 100%;
			padding: 7px 8px 7px 16px;
		}
		.demo-box {
			background: rgba(125, 125, 125, 0.5);
			box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 1px,
				rgba(0, 0, 0, 0.07) 0px 0px 0px 1px;
			height: 4rem;
			min-width: 200px;
		}
	`,
})

import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'avatar',
	props: {
		label: 'A',
		src: '',
		alt: '',
		size: { default: 'medium', options: ['small', 'medium', 'large'] },
		shape: ['squared', 'rounded', 'circle'],
	},
	template({ label, src, alt, size, shape }) {
		const classList = [size, shape].join(' ')
		return src
			? html`<img src=${src} alt=${alt ? alt : null} class=${classList} />`
			: html`<slot class=${classList}> ${label}</slot>`
	},
	styles: css`
		:host {
			--avatar-background-color: dodgerblue;
			--avatar-color: white;
			color: var(--avatar-color);
			display: inline-block;
		}
		img,
		slot {
			background: var(--avatar-background-color);
			border-radius: var(--avatar-border-radius);
			height: var(--avatar-size);
			width: var(--avatar-size);
		}
		img {
			display: block;
			object-fit: cover;
			object-position: center center;
		}
		slot {
			align-items: center;
			display: flex;
			font-size: var(--avatar-font-size);
			justify-content: center;
			overflow: hidden;
		}
		slot::slotted(*) {
			width: var(--avatar-font-size);
		}
		.small {
			--avatar-size: 2rem;
			--avatar-font-size: 1rem;
		}
		.medium {
			--avatar-size: 3rem;
			--avatar-font-size: 1.5rem;
		}
		.large {
			--avatar-size: 4rem;
			--avatar-font-size: 2rem;
		}
		.rounded {
			--avatar-border-radius: 0.25rem;
		}
		.circle {
			--avatar-border-radius: 2rem;
		}
	`,
})

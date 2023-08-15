import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'accordion',
	maxHeight: '0',
	open: false,
	props: { label: 'Click me', content: 'Content' },
	toggleAccordion(e) {
		e.preventDefault()
		const accordion = this.root.querySelector('details')
		if (!accordion.open) {
			accordion.open = true
			this.open = true
			this.maxHeight = this.root.querySelector(
				'[part=content] slot'
			).offsetHeight
		} else {
			this.maxHeight = 0
			this.open = false
			setTimeout(() => {
				accordion.open = false
			}, 333)
		}
	},
	template({ maxHeight, open, label, content }) {
		return html`<details class="surface">
			<summary part="summary" @click=${(e) => this.toggleAccordion(e)}>
				<slot name="summary">${label}</slot>
				<svg
					part="indicator"
					class=${open ? 'open' : 'closed'}
					viewBox="0 0 24 24"
				>
					<path
						d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
					/>
				</svg>
			</summary>
			<div part="content" style=${`max-height: ${maxHeight}px`}>
				<slot>${content}</slot>
			</div>
		</details>`
	},
	styles: css`
		:host {
			--accordion-padding: 1rem;
			display: block;
		}
		:host(:not(:last-of-type)) {
			border-bottom: 0;
		}
		cuick-accordion + :host() {
			background: red;
		}
		summary {
			align-items: center;
			box-sizing: border-box;
			cursor: pointer;
			display: flex;
			justify-content: space-between;
			list-style-type: none;
			overflow: hidden;
			padding: var(--accordion-padding);
			text-overflow: ellipsis;
			user-select: none;
			white-space: nowrap;
		}
		summary::-webkit-details-marker {
			display: none;
		}
		summary svg {
			display: block;
			fill: currentColor;
			height: 1rem;
			transform: scale(1.5);
			transition: transform 0.33s;
			width: 1rem;
		}
		summary svg.open {
			transform: scale(1.5) rotate(180deg);
		}
		[part='content'] {
			max-height: 0;
			overflow: hidden;
			transition: ease-out max-height 0.33s;
		}
		[part='content'] slot {
			display: block;
			padding: var(--accordion-padding);
		}
	`,
})

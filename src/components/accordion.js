import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'accordion',
	maxHeight: '0',
	open: false,
	props: { label: 'Click me', content: 'Content' },
	toggleAccordion(e) {
		e.preventDefault()
		const contentHeight = this.root.querySelector(
			'[part=content] slot'
		).offsetHeight
		if (!this.open) {
			this.open = true
			this.maxHeight = contentHeight + 'px'
		} else this.maxHeight = '0'
	},
	template({ maxHeight, open, label, content }) {
		const classList = [
			'surface',
			open && maxHeight === '0' ? 'closing' : null,
		].join(' ')
		return html`
			<details open=${open ? '' : null} class=${classList}>
				<summary part="summary" @click=${(e) => this.toggleAccordion(e)}>
					<slot name="summary">${label}</slot>
					<svg viewBox="0 0 24 24">
						<path
							d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
						/>
					</svg>
				</summary>
				<div
					part="content"
					style=${`max-height: ${maxHeight}`}
					@transitionEnd=${() => {
						if (maxHeight === '0') this.open = false
					}}
				>
					<slot>${content}</slot>
				</div>
			</details>
		`
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
		details[open]:not(.closing) svg {
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

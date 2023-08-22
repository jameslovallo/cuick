import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'card',
	props: {
		horizontal: false,
	},
	template() {
		return html`
			<slot name="media"></slot>
			<slot></slot>
			<slot name="actions"></slot>
		`
	},
	styles: css`
		:host {
			--cardBg: var(--themeSurfaceBg, var(--defaultSurfaceBg));
			--cardColor: var(--themeSurfaceColor, var(--defaultSurfaceColor));
			--cardBorder: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
			--cardBorderRadius: 0;
			--cardPadding: 1rem;
			--cardShadow: var(--themeSurfaceShadow, var(--defaultSurfaceShadow));
			background: var(--cardBg);
			border: var(--cardBorder);
			border-radius: var(--cardBorderRadius);
			box-shadow: var(--cardShadow);
			color: var(--cardColor);
			display: block;
			overflow: hidden;
		}
		:host([horizontal]) {
			align-items: center;
			display: grid;
			grid-template-columns: auto 1fr auto;
		}
		:host([horizontal]) slot[name='media']::slotted(*:first-child) {
			margin-left: var(--cardPadding);
		}
		:host([horizontal]) slot:not([name]) {
			gap: 0.5rem;
		}
		:host([horizontal]) slot[name='actions']::slotted(*:last-child) {
			margin-right: var(--cardPadding);
		}
		slot[name='media'] {
			border-bottom-left-radius: var(--cardBorderRadius);
			border-bottom-right-radius: var(--cardBorderRadius);
			display: flex;
			overflow: hidden;
		}
		slot:not([name]) {
			display: grid;
			gap: 1rem;
			padding: var(--cardPadding);
		}
		slot:not([name])::slotted(*) {
			font-size: 14px;
			line-height: 1 !important;
			margin: 0 !important;
			opacity: 0.8;
		}
		slot:not([name])::slotted(h2),
		slot:not([name])::slotted(h3),
		slot:not([name])::slotted(h4),
		slot:not([name])::slotted(h5),
		slot:not([name])::slotted(h6) {
			font-size: 18px;
			opacity: 1;
		}
		slot[name='actions'] {
			display: flex;
		}
	`,
})

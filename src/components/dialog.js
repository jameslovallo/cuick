import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'dialog',
	open: false,
	props: {
		variant: ['modal', 'drawer'],
		enterFrom: ['bottom', 'left', 'right', 'top'],
	},
	openDialog() {
		this.root.querySelector('dialog').showModal()
		this.open = true
	},
	closeDialog() {
		this.open = false
	},
	setup() {
		this.querySelector('[slot=open]')?.addEventListener('click', () =>
			this.openDialog()
		)
		this.querySelector('[slot=close]')?.addEventListener('click', () =>
			this.closeDialog()
		)
	},
	template({ open, variant, enterFrom }) {
		const classList = [variant, enterFrom, open ? 'open' : 'closed'].join(' ')
		return html`
			<slot name="open">
				<button @click=${() => this.openDialog()}>Open Dialog</button>
			</slot>
			<dialog
				class=${classList}
				@transitionEnd=${(e) => !open && e.target.close()}
			>
				<slot></slot>
				<slot name="close">
					<button @click=${() => this.closeDialog()}>Close Dialog</button>
				</slot>
			</dialog>
		`
	},
	styles: css`
		:host {
			--dialog-background-color: themeSurfaceBg;
			--dialog-color: themeSurfaceColor;
			--dialog-border: none;
			--dialog-border-radius: 1rem;
			--dialog-box-shadow: var(--theme-surface-shadow);
			--dialog-padding: 1rem;
			--dialog-height: unset;
			--dialog-width: unset;
			display: inline-block;
		}
		[name='open'],
		[name='close'],
		[name='open']::slotted(*),
		[name='close']::slotted(*) {
			cursor: pointer;
		}
		dialog {
			background-color: var(--dialog-background-color);
			border: var(--dialog-border);
			border-radius: var(--dialog-border-radius);
			box-shadow: var(--dialog-box-shadow);
			color: var(--dialog-color);
			height: var(--dialog-height);
			padding: var(--dialog-padding);
			position: fixed;
			transition: 0.33s;
			width: var(--dialog-width);
		}
		dialog::backdrop {
			background-color: var(--dialog-backdrop-color, black);
			opacity: 0.15;
			transition: 0.33s;
		}
		dialog.closed::backdrop {
			opacity: 0;
		}
		dialog.modal {
			height: min-content;
			width: var(--dialog-width, min(80ch, 100%));
		}
		dialog.modal.closed {
			opacity: 0;
		}
		dialog.modal.open {
			opacity: 1;
		}
		dialog.drawer.left,
		dialog.drawer.right {
			height: 100%;
			margin: unset;
			max-height: unset;
			top: 0;
			width: var(--dialog-width, 200px);
		}
		dialog.drawer.left {
			border-bottom-left-radius: 0;
			border-top-left-radius: 0;
			left: 0;
			right: unset;
		}
		dialog.drawer.right {
			border-bottom-right-radius: 0;
			border-top-right-radius: 0;
			left: unset;
			right: 0;
		}
		dialog.drawer.bottom,
		dialog.drawer.top {
			height: var(--dialog-height, max-content);
			margin: 0 auto;
			max-height: unset;
			width: var(--dialog-width, min(80ch, 100%));
		}
		dialog.drawer.bottom {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			bottom: 0;
			top: unset;
		}
		dialog.drawer.top {
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			bottom: unset;
			top: 0;
		}
		dialog.open {
			transform: translate3d(0, 0, 0);
		}
		dialog.bottom.closed {
			transform: translate3d(0, 100%, 0);
		}
		dialog.left.closed {
			transform: translate3d(-100%, 0, 0);
		}
		dialog.right.closed {
			transform: translate3d(100%, 0, 0);
		}
		dialog.top.closed {
			transform: translate3d(0, -100%, 0);
		}
	`,
})

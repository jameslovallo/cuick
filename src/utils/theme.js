const defaultTheme = `<style>
	:root {
		--theme-background: white;
		--theme-border: #eee;
		--theme-color: black;
		--theme-primary-background: dodgerblue;
		--theme-primary-color: white;
		--theme-surface-background: #fafafa;
		--theme-surface-color: unset;
		--theme-surface-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 1px, rgba(0, 0, 0, 0.07) 0px 0px 0px 1px;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--theme-background: #111;
			--theme-border: #282c34;
			--theme-color: unset;
			--theme-surface-background: #171a1f;
			--theme-surface-color: unset;
		}
	}
</style>`

export default function setDefaultTheme() {
	const styleTag = document.querySelector('[data-theme=cuick]')
	if (!styleTag) {
		const styleTag = document.createElement('style')
		styleTag.innerText = defaultTheme
		document.head.insertAdjacentHTML('beforebegin', defaultTheme)
	}
}

import { transform } from '//cdn.skypack.dev/nested-css-to-flat'

const defaultTheme = `
	* {
		box-sizing: border-box
	}
	:root {
		--primaryBg: dodgerblue;
		--primaryColor: white;
		--surfaceBg: #fafafa;
		--surfaceBorder: none;
		--surfaceColor: black;
		--surfaceShadow:
			rgba(0, 0, 0, 0.1) 0px 1px 3px 1px,
			rgba(0, 0, 0, 0.07) 0px 0px 0px 1px;
	}
	/* End of default theme */
`

const primary = `
	--bg: var(--primaryBg);
	--color: var(--primaryColor);
	background: var(--bg);
	color: var(--color);
`

const surface = `
	--bg: var(--surfaceBg);
	--border: var(--surfaceBorder);
	--box-shadow: var(--surfaceShadow);
	--color: var(--surfaceColor);
	background: var(--bg);
	border: var(--border);
	box-shadow: var(--box-shadow);
	color: var(--color);
`

export default ([v]) => {
	v = v.replace('/* primary */', primary)
	v = v.replace('/* surface */', surface)
	v = defaultTheme + v
	return v.includes('&') ? transform(v) : v
}

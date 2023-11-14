import { transform } from '//cdn.skypack.dev/nested-css-to-flat'

const defaultTheme = `
	* {
		box-sizing: border-box
	}
	:host {
		--defaultPrimaryBg: dodgerblue;
		--defaultPrimaryColor: white;
		--defaultSurfaceBg: #fafafa;
		--defaultSurfaceBorder: 1px solid rgba(125, 125, 125, 0.5);
		--defaultSurfaceColor: black;
		--defaultSurfaceShadow: none;
	}
	/* End of default theme */
`

const primary = `
	background: var(--primaryBg, var(--defaultPrimaryBg));
	color: var(--primaryColor, var(--defaultPrimaryColor));
`

const surface = `
	background: var(--surfaceBg, var(--defaultSurfaceBg));
	border: var(--surfaceBorder, var(--defaultSurfaceBorder));
	box-shadow: var(--surfaceShadow, var(--defaultSurfaceShadow));
	color: var(--surfaceColor, var(--defaultSurfaceColor));
`

export default ([v]) => {
	v = v.replace('/* primary */', primary)
	v = v.replace('/* surface */', surface)
	v = defaultTheme + v
	return v.includes('&') ? transform(v) : v
}

import { transform } from '//cdn.skypack.dev/nested-css-to-flat'

const defaultTheme = `
	* {
		box-sizing: border-box
	}
	:root {
		--defaultPrimaryBg: dodgerblue;
		--defaultPrimaryColor: white;
		--defaultSurfaceBg: #fafafa;
		--defaultSurfaceBorder: none;
		--defaultSurfaceDivider: 1px solid #eee;
		--defaultSurfaceColor: black;
		--defaultSurfaceShadow:
			rgba(0, 0, 0, 0.1) 0px 1px 3px 1px,
			rgba(0, 0, 0, 0.07) 0px 0px 0px 1px;
	}
	/* End of default theme */
`

const surface = `
	background: var(--themeSurfaceBg, var(--defaultSurfaceBg));
	border: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
	box-shadow: var(--themeSurfaceShadow, var(--defaultSurfaceShadow));
	color: var(--themeSurfaceColor, var(--defaultSurfaceColor));
`

export default ([v]) => {
	v = defaultTheme + v.replace('/* surface */', surface)
	return v.includes('&') ? transform(v) : v
}

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
	.surface {
		background: var(--themeSurfaceBg, var(--defaultSurfaceBg));
		box-shadow: var(--themeSurfaceShadow, var(--defaultSurfaceShadow));
	}
	@media (prefers-color-scheme: dark) {
		.surface{
			border: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
			box-shadow: none;
		}
	}
	/* End of default theme */
`

export default ([v]) => {
	v = defaultTheme + v
	return v.includes('&') ? transform(v) : v
}

import { transform } from '//cdn.skypack.dev/nested-css-to-flat'

const defaultTheme = `
	* {
		box-sizing: border-box
	}
	:host {
		--defaultDivider: #eee;
		--defaultPrimaryBg: dodgerblue;
		--defaultPrimaryColor: white;
		--defaultSurfaceBg: #fafafa;
		--defaultSurfaceBorder: none;
		--defaultSurfaceColor: black;
		--defaultSurfaceShadow:
			rgba(0, 0, 0, 0.1) 0px 1px 3px 1px,
			rgba(0, 0, 0, 0.07) 0px 0px 0px 1px;
	}
	@media( prefers-color-scheme: dark ) {
		:host {
			--defaultDivider: #282c34;
			--defaultPrimaryBg: dodgerblue;
			--defaultPrimaryColor: white;
			--defaultSurfaceBg: #171a1f;
			--defaultSurfaceBorder: 1px solid #282c34;
			--defaultSurfaceColor: white;
			--defaultSurfaceShadow: none;
		}
	}
	.surface {
		background: var(--themeSurfaceBg, var(--defaultSurfaceBg));
		border: var(--themeSurfaceBorder, var(--defaultSurfaceBorder));
		box-shadow: var(--themeSurfaceShadow, var(--defaultSurfaceShadow));
	}
`

export default ([v]) => {
	v = defaultTheme + v
	return v.includes('&') ? transform(v) : v
}

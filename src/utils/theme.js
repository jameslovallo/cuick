import { transform } from '//cdn.skypack.dev/nested-css-to-flat'

const light = {
	themeDivider: '#eee',
	themePrimaryBg: 'dodgerblue',
	themePrimaryColor: 'white',
	themeSurfaceBg: '#fafafa',
	themeSurfaceBorder: 'none',
	themeSurfaceColor: 'black',
	themeSurfaceShadow:
		'rgba(0, 0, 0, 0.1) 0px 1px 3px 1px, rgba(0, 0, 0, 0.07) 0px 0px 0px 1px',
}

const dark = {
	themeDivider: '#282c34',
	themePrimaryBg: 'dodgerblue',
	themePrimaryColor: 'white',
	themeSurfaceBg: '#171a1f',
	themeSurfaceBorder: '1px solid #282c34',
	themeSurfaceColor: 'white',
	themeSurfaceShadow: 'none',
}

const isDark = matchMedia('(prefers-color-scheme: dark)').matches

const theme = isDark ? dark : light

const reset = `* { box-sizing: border-box }`

export default ([v]) => {
	v = reset + v
	Object.keys(theme).forEach((key) => {
		v = v.replaceAll(key, `var(--${key}, ${theme[key]})`)
	})
	return v.includes('&') ? transform(v) : v
}

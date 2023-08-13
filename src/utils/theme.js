import { transform } from '//cdn.skypack.dev/nested-css-to-flat'

const root = `* { box-sizing: border-box }`

const light = {
	themeBorder: '#eee',
	themePrimaryBg: 'dodgerblue',
	themePrimaryColor: 'white',
	themeSurfaceBg: '#fafafa',
	themeSurfaceColor: 'unset',
	themeSurfaceShadow:
		'rgba(0, 0, 0, 0.1) 0px 1px 3px 1px, rgba(0, 0, 0, 0.07) 0px 0px 0px 1px',
}

const dark = {
	themeBorder: '#282c34',
	themeSurfaceBg: '#171a1f',
	themeSurfaceColor: 'unset',
}

const isDark = matchMedia('(prefers-color-scheme: dark)').matches

const theme = isDark ? { ...light, ...dark } : light

export default ([v]) => {
	v = root + v
	Object.keys(theme).forEach((key) => {
		v = v.replace(key, `var(--${key}, ${theme[key]})`)
	})
	return v.includes('& ') ? transform(v) : v
}

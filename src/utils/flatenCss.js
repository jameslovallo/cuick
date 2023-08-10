import { transform } from '//cdn.skypack.dev/nested-css-to-flat'

export default ([v]) => {
	v = '* {box-sizing: border-box}' + v
	return v.includes('& ') ? transform(v) : v
}

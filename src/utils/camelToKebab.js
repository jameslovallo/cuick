export default function (value) {
	value.match(/[a-z][A-Z]/g)?.forEach((camel) => {
		const kebab = camel.toLowerCase().split('').join('-')
		value = value.replace(camel, kebab).toLowerCase()
	})
	return value
}

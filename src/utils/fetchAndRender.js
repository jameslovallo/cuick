export default async function (url) {
	const wrapper = document.createElement('div')
	wrapper.innerHTML = await fetch(url).then((res) => res.text())
	return wrapper.firstChild
}

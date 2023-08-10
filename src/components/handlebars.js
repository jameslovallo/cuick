import cuick from '../cuick.js'

cuick({
	tag: 'handlebars',
	props: { name: 'James', profession: 'web developer' },
	hbs: `My name is {{name}} and I am a {{profession}}.`,
})

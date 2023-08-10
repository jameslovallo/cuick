import cuick, { css, html } from '../cuick.js'

const getWeather = async (lat, lon) => {
	const meta = await fetch(`https://api.weather.gov/points/${lat},${lon}`).then(
		(res) => res.json()
	)
	const {
		properties: {
			forecast: forecastURL,
			relativeLocation: {
				properties: { city, state },
			},
		},
	} = meta
	const forecast = await fetch(forecastURL).then((res) => res.json())
	return { city, state, forecast }
}

export default cuick({
	tag: 'forecast',
	props: {
		lat: 42.34,
		lon: -83.06,
		headingLevel: { default: 3, options: [1, 2, 3, 4, 5, 6] },
	},
	async template() {
		const { city, state, forecast } = await getWeather(this.lat, this.lon)
		const { periods } = forecast.properties
		const tag = (tag, content) => {
			const el = document.createElement(tag)
			el.innerText = content
			return el
		}
		return html`
			${tag('h' + this.headingLevel, `Forecast for ${city}, ${state}`)}
			${periods.map((period, i) => {
				const { name, detailedForecast, temperature, temperatureUnit } = period
				return html`
					${i === 0 ? html`<hr />` : ''}
					<b>${name}: ${temperature}° ${temperatureUnit}</b>
					<p>${detailedForecast}</p>
					<hr />
				`
			})}
		`
	},
	styles: css`
		hr {
			margin-block: 1rem;
		}
	`,
})

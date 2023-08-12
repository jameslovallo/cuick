import cuick, { css } from '/src/cuick.js'

cuick({
	tag: 'hbs',
	props: {
		author: '',
		avatarSize: ['small', 'medium', 'large'],
		avatarBackgroundColor: 'dodgerblue',
		avatarColor: 'white',
	},
	initials: '',
	hbs(html) {
		this.initials = this.author
			.split(' ')
			.map((name) => name.charAt(0))
			.join('')
		return html`
			<cuick-avatar
				label="{{initials}}"
				size="{{avatarSize}}"
				style="
					--avatar-background-color: {{avatarBackgroundColor}};
					--avatar-color: {{avatarColor}};
				"
			></cuick-avatar>
			<p>{{#if author}} {{author}} {{else}} Unknown Author {{/if}}</p>
		`
	},
	styles: css`
		:host {
			align-items: center;
			display: inline-flex;
			gap: 0.5rem;
		}
	`,
})

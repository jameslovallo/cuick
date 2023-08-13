import cuick, { css, html } from '../cuick.js'

export default cuick({
	tag: 'video',
	playing: false,
	progress: 0,
	props: {
		src: 'https://joy1.videvo.net/videvo_files/video/free/2013-08/large_watermarked/hd0992_preview.mp4',
		poster: '',
		playLabel: 'Play',
		pauseLabel: 'Pause',
	},
	togglePlayback() {
		const video = this.root.querySelector('video')
		this.playing = !this.playing
		video[this.playing ? 'play' : 'pause']()
	},
	template({ playing, progress, src, poster, playLabel, pauseLabel }) {
		const pause = 'M14,19H18V5H14M6,19H10V5H6V19Z'
		const play = 'M8,5.14V19.14L19,12.14L8,5.14Z'
		const buttonLabel = `
			${playing ? pauseLabel : playLabel} - ${Math.round(progress)}%
		`
		return html`
			<video
				src=${src}
				poster=${poster ? poster : null}
				playsinline
				@click=${() => this.togglePlayback()}
				@timeupdate=${(e) => {
					const { currentTime, duration } = e.target
					if (!isNaN(duration)) this.progress = (currentTime / duration) * 100
				}}
				@ended=${(e) => {
					this.playing = false
					this.progress = 0
					e.target.src = this.src
				}}
			></video>
			<button
				part="button"
				aria-label=${buttonLabel}
				title=${buttonLabel}
				@click=${() => this.togglePlayback()}
			>
				<svg part="icon" viewBox="0 0 24 24">
					<path d=${playing ? pause : play} />
				</svg>
				<svg part="progress" viewbox="0 0 42 42" fill="transparent">
					<circle
						cx="21"
						cy="21"
						r="15.91549430918954"
						stroke="var(--video-button-color)"
						stroke-dashoffset="25"
						stroke-dasharray=${`${progress} ${100 - progress}`}
						stroke-width="2px"
					/>
				</svg>
			</button>
		`
	},
	styles: css`
		:host {
			--video-aspect-ratio: 16/9;
			--video-button-background-color: var(--theme-primary-background);
			--video-button-color: var(--theme-primary-color);
			aspect-ratio: var(--video-aspect-ratio);
			display: block;
			position: relative;
		}
		video {
			aspect-ratio: var(--video-aspect-ratio);
			display: block;
			height: auto;
			object-fit: cover;
			width: 100%;
		}
		[part='button'] {
			align-items: center;
			background: var(--video-button-background-color);
			border: none;
			border-radius: 50%;
			bottom: 1rem;
			box-shadow: 0 0 2px black;
			cursor: pointer;
			display: flex;
			height: 3rem;
			left: 1rem;
			justify-content: center;
			overflow: hidden;
			position: absolute;
			width: 3rem;
		}
		[part='icon'] {
			display: block;
			fill: var(--video-button-color);
			height: 1.5rem;
			width: 1.5rem;
		}
		[part='progress'] {
			height: 100%;
			left: 0;
			position: absolute;
			top: 0;
			transform-origin: center;
			transform: scale(125%);
			width: 100%;
		}
	`,
})

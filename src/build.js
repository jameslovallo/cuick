import fs from 'fs'

// remove and re-create dist folder

fs.rmSync('./dist', { recursive: true, force: true })
fs.mkdirSync('./dist')

// helper functions

const copyToDist = (src, dest) => {
	fs.cpSync(src, dest, { recursive: true })
}

const getFiles = (dir, files = []) => {
	const fileList = fs.readdirSync(dir)
	for (const file of fileList) {
		const name = `${dir}/${file}`
		if (fs.statSync(name).isDirectory()) {
			getFiles(name, files)
		} else files.push(name)
	}
	return files
}

const getFile = (path) =>
	fs.readFileSync(path, { encoding: 'utf8' }, (err, data) =>
		err ? console.error(err) : data
	)

// build site

copyToDist('./assets', './dist/assets')
copyToDist('./src', './dist/src')
copyToDist('./pages', './dist')
fs.cp('./style.css', './dist/style.css', (err) => err && console.error(err))

const template = getFile('./index.html')

const buildPage = (page) => {
	const endOfAppWrapper = '</cuick-app>'
	return template.replace(endOfAppWrapper, `\n\n${page}\n\n` + endOfAppWrapper)
}

const pages = await getFiles('./dist')

pages.forEach((path) => {
	const content = getFile(path)
	fs.writeFileSync(path.replace('./pages', './dist'), buildPage(content))
})

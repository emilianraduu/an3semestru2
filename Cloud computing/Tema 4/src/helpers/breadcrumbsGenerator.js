function isUUID (uuid) {
	let s = '' + uuid
	s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
	return s !== null
}

function getBreadcrumb (urlComponents) {
	if (urlComponents.length) {
		const urlComponent = urlComponents.shift()
		return {
			name: urlComponent,
			path: `/${urlComponent}`
		}
	}
}

export function getBreadcrumbs (pathname, uuidToName) {
	let breadcrumbs = []
	let urlComponents = pathname.split('/')
	if (urlComponents[0] === '') {
		urlComponents.shift()
	}
	while (urlComponents.length) {
		let breadcrumb = getBreadcrumb(urlComponents)
		if (isUUID(breadcrumb.name) && breadcrumbs.length && !isUUID(breadcrumbs[breadcrumbs.length - 1])) {
			let targetMatching = uuidToName[breadcrumbs[breadcrumbs.length - 1].name]
			let targetData = targetMatching && targetMatching.source && (targetMatching.sourcePropertyInner ? targetMatching.source[targetMatching.sourceProperty][targetMatching.sourcePropertyInner] : targetMatching.source[targetMatching.sourceProperty])
			let targetData2 = targetMatching && targetMatching.source2 && targetMatching.source2[targetMatching.sourceProperty2]
			if (targetData2 && breadcrumbs.length > 2) {
				targetData = targetData2
			}
			if (targetData) {
				let propertyNames = targetMatching.properties.map((property) => {
					return targetData[property]
				})
				if (propertyNames.length) {
					breadcrumb.name = propertyNames.join(' ')
				}
			}
		}
		if (breadcrumb.name) {
			breadcrumbs.push(breadcrumb)
		}
	}
	let path = ''
	for (let i = 0; i < breadcrumbs.length; i++) {
		path = `${path}${breadcrumbs[i].path}`
		breadcrumbs[i].path = path
	}
	return breadcrumbs
}
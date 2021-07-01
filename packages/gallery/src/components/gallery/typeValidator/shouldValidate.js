export default function shouldValidate(props) {
	return props.shouldValidateTypes === true || getQueryParams('shouldValidateTypes') === 'true'
}

function getQueryParams(field) {
	return safelyGetQueryParam(field) || ''
}

function safelyGetQueryParam() {
	try {
		const urlSearchParams = new URLSearchParams(window.location.search);
		return Object.fromEntries(urlSearchParams.entries());
	} catch (err) {
		console.log('cannot use the URLSearchParams', err)
		return {}
	}
}

interface CredentialRequestOptions {
	otp: OTPOptions
}

interface OTPOptions {
	transport: string[]
}

interface Credential {
	code: string
}

interface Window {
	MSStream?: any
}

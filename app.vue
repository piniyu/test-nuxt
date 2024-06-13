<template>
	<div>
		<h2>Is IOS? {{ isIOS() }}</h2>
		<p>
			Send an SMS that includes<br />
			<code>@web-otp.glitch.me #12345 </code><br />
			at the last line to this phone.
		</p>

		<!-- <form action="/" method="post"> -->
		<label>Enter OTP here:</label>
		<input type="text" autocomplete="one-time-code" inputmode="numeric" />
		<!-- <button type="submit">submit</button> -->
		<!-- </form> -->
	</div>
</template>
<script setup lang="ts">
	const isIOS = () => {
		const userAgent = window?.navigator.userAgent
		console.log(userAgent)
		return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
	}

	onMounted(() => {
		if ('OTPCredential' in window && !isIOS() && window.navigator) {
			window.addEventListener('DOMContentLoaded', e => {
				const input = document.querySelector(
					'input[autocomplete="one-time-code"]',
				) as HTMLInputElement
				if (!input) return
				const ac = new AbortController()
				const form = input.closest('form')
				if (form) {
					form.addEventListener('submit', e => {
						ac.abort()
					})
				}
				navigator.credentials
					.get({
						otp: { transport: ['sms'] },
						signal: ac.signal,
					})
					.then(otp => {
						input.value = otp?.code || ''
						if (form) form.submit()
					})
					.catch(err => {
						console.log(err)
					})
			})
		}
	})
</script>

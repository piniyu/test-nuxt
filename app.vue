<template>
	<div>
		<h2>Is Chrome {{ isChromium() }}</h2>
		<h2>Is IOS? {{ isIOS() }}</h2>
		<p>
			Send an SMS that includes<br />
			<code>@web-otp.glitch.me #12345 </code><br />
			at the last line to this phone.
		</p>

		<!-- <form action="/" method="post"> -->
		<div>
			<label>Enter OTP here:</label>
			<input type="text" autocomplete="one-time-code" inputmode="numeric" />
		</div>
		<div>
			<label>Enter OTP here:</label>
			<input
				v-for="(number, index) in otp"
				v-model="otp[index]"
				:key="index"
				type="text"
				autocomplete="one-time-code"
				inputmode="numeric"
				@input="onOtpInput($event, index)"
				maxlength="7"
				ref="inputsRef"
				@keydown="onKeydown($event, index)"
			/>
			<!-- <input type="text" autocomplete="one-time-code" inputmode="numeric" />
			<input type="text" autocomplete="one-time-code" inputmode="numeric" />
			<input type="text" autocomplete="one-time-code" inputmode="numeric" />
			<input type="text" autocomplete="one-time-code" inputmode="numeric" />
			<input type="text" autocomplete="one-time-code" inputmode="numeric" /> -->
		</div>
		<!-- <button type="submit">submit</button> -->
		<!-- </form> -->
	</div>
</template>
<script setup lang="ts">
	const numOfOtp = 6

	const otp = ref<string[]>(Array(6).fill(''))
	const inputsRef = ref<HTMLInputElement[] | null>(null)

	const isChromium = () => {
		const userAgent = navigator?.userAgent
		console.log(userAgent)
		if (userAgent) {
			return userAgent.includes('Chrome') || userAgent.includes('CriOS')
		}
		// return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
	}

	const isIOS = () => {
		const userAgent = navigator?.userAgent
		return (
			/iPad|iPhone|iPod/.test(userAgent) ||
			(navigator?.platform === 'MacIntel' && navigator?.maxTouchPoints > 1)
		)
	}

	const onOtpInput = (e: Event, index: number) => {
		const target = e.target as HTMLInputElement

		// 貼上/autocomplete otp時自動填入對應input
		if (target.value.length >= numOfOtp) {
			// 輸入後游標位置
			const cursorPosition = target.selectionStart
			// 若游標在 位置0 開始貼,最後游標會停留的位置為6
			if (cursorPosition === numOfOtp) {
				// 由前往後取六位otp
				otp.value = target.value.split('').slice(0, numOfOtp)
				// 若游標在 位置1 開始貼,最後游標會停留的位置為6
			} else {
				// 由最後往前取六位otp
				otp.value = target.value.split('').slice(-numOfOtp, target.value.length)
			}
		} else if (target.value.length < numOfOtp && target.value.length > 0) {
			// 輸入後游標位置
			const cursorPosition = target.selectionStart
			// 代表輸入後游標跑到1的位置 -> 游標起始位置為0 -> 從input value前開始輸入
			if (cursorPosition === 1) {
				otp.value[index] = target.value[0]
				// 代表輸入後游標跑到2的位置 -> 游標起始位置為1 -> 從input value後開始輸入
			} else if (cursorPosition === 2) {
				otp.value[index] = target.value.slice(-1)
			}

			// 若有下一個 element 則往下聚焦
			const nextElementSibling =
				target.nextElementSibling as HTMLInputElement | null
			nextElementSibling?.focus()
		}
	}

	/** otp input keydown event handler */
	const onKeydown = (e: Event, index: number) => {
		const key = (e as KeyboardEvent).key.toLowerCase()
		const target = e.target as HTMLInputElement

		// 按下刪除鍵時 可以往前刪除前格value
		if ((key === 'backspace' || key === 'delete') && otp.value[index] === '') {
			const previousElementSibling =
				target.previousElementSibling as HTMLInputElement | null
			previousElementSibling?.focus()
		}
	}

	onMounted(() => {
		if ('OTPCredential' in window && !isChromium() && window.navigator) {
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

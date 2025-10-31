<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import loginBg from '$lib/assets/images/login_bg.png';
	
	let username = '';
	let password = '';
	let rememberMe = false;
	
	function handleSubmit() {
		// Handle login logic here
		console.log('Login attempt:', { username, password, rememberMe });
		
		// Simulasi login berhasil - redirect ke dashboard
		// Dalam implementasi nyata, Anda perlu memvalidasi kredensial terlebih dahulu
		if (username && password) {
			goto('/dashboard');
		}
	}
</script>

<svelte:head>
	<title>Sign In - Kahasolusi</title>
</svelte:head>

<div class="min-h-screen relative flex items-center justify-center login-container" 
     style="background-image: url('{loginBg}')">
	
	
	
	<!-- Login Form Container -->
	<div class="relative z-10 w-full max-w-md mx-4">
		<div class="bg-white/95 form-container rounded-2xl shadow-2xl p-8 border border-white/20">
			<!-- Header -->
			<div class="text-center mb-8">
				<h2 class="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
				<p class="text-gray-600 text-sm">Masukkan username dan password untuk melanjutkan</p>
			</div>
			
			<!-- Login Form -->
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Username Input -->
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
						Username
					</label>
					<input
						type="text"
						id="username"
						bind:value={username}
						placeholder="Masukkan username"
						class="input-field w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-[#176684] outline-none transition-all duration-200 bg-gray-100 text-gray-900 placeholder-gray-500 shadow-inner"
						required
					/>
				</div>
				
				<!-- Password Input -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						Password
					</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						placeholder="Masukkan password"
						class="input-field w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-[#176684] outline-none transition-all duration-200 bg-gray-100 text-gray-900 placeholder-gray-500 shadow-inner"
						required
					/>
				</div>
				
				<!-- Remember Me Checkbox -->
				<div class="flex items-center">
					<input
						type="checkbox"
						id="remember"
						bind:checked={rememberMe}
						class="w-4 h-4 text-[#176684] bg-gray-100 border-gray-300 rounded focus:ring-[#176684] focus:ring-2"
					/>
					<label for="remember" class="ml-2 text-sm text-gray-600">
						Remember Me
					</label>
				</div>
				
				<!-- Submit Button -->
				<button
					type="submit"
					class="w-full bg-[#176684] hover:bg-[#0f5469] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#176684] focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
				>
					Sign In
				</button>
			</form>

		</div>
	</div>
</div>

<style>
	/* Custom styling untuk halaman login */
	.login-container {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: fixed;
	}
	
	.form-container {
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	
	.input-field {
		transition: all 0.3s ease;
	}
	
	.input-field:focus {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	
	.gradient-bg {
		background: linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #0c4a6e 100%);
	}
	
	/* Mobile responsive adjustments */
	@media (max-width: 640px) {
		.form-container {
			margin: 1rem;
			padding: 1.5rem;
		}
	}
</style>
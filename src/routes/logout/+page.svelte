tidak<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore.js';
	import { authAPI } from '$lib/api.js';
	
	onMount(async () => {
		try {
			// Call logout API
			await authAPI.logout();
		} catch (error) {
			console.error('Logout API error:', error);
		}
		
		// Clear auth store
		authStore.logout();
		
		// Clear cookie
		document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Strict';
		
		// Redirect to login
		goto('/login');
	});
</script>

<svelte:head>
	<title>Logout - Kahasolusi</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
	<div class="text-center">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
		<p class="text-gray-600">Signing out...</p>
	</div>
</div>
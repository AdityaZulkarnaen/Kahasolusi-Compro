<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	onMount(() => {
		// Simulasi logout - clear session dan redirect ke homepage
		// Dalam implementasi nyata, Anda akan menghapus token/session
		console.log('User logged out');
		goto('/');
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
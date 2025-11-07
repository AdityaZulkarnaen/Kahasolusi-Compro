<script>
	import { onMount } from 'svelte';
	import { feedbackAPI } from '$lib/api.js';
	import { MessageSquare, Eye, EyeOff, Trash2, Filter, Calendar, User, Mail, CheckCircle, XCircle, Clock, Search, Download, Monitor, Mail as MailIcon } from 'lucide-svelte';
	
	// Feedback data
	let feedbacks = [];
	let loading = true;
	let error = null;
	
	// Filter states
	let searchQuery = '';
	let selectedDisplayStatus = 'all'; // all, displayed, hidden
	let selectedReadStatus = 'all'; // all, read, unread
	let sortBy = 'recent'; // recent, oldest, name
	let filteredFeedbacks = [];
	
	// Modal states
	let selectedFeedback = null;
	let isDetailModalOpen = false;
	let showDeleteModal = false;
	let feedbackToDelete = null;
	let deleting = false;
	
	// Load feedback from API
	async function loadFeedbacks() {
		try {
			loading = true;
			error = null;
			const response = await feedbackAPI.get();
			feedbacks = response.data || [];
			filterAndSortFeedbacks();
		} catch (err) {
			error = err.message || 'Gagal memuat data feedback';
			console.error('Failed to load feedbacks:', err);
		} finally {
			loading = false;
		}
	}
	
	// Filter and sort functions
	function filterAndSortFeedbacks() {
		let filtered = feedbacks;
		
		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(feedback => 
				feedback.visitor_name.toLowerCase().includes(query) ||
				feedback.visitor_email.toLowerCase().includes(query) ||
				feedback.message.toLowerCase().includes(query) ||
				(feedback.company_name && feedback.company_name.toLowerCase().includes(query))
			);
		}
		
		// Display status filter
		if (selectedDisplayStatus !== 'all') {
			const isDisplayed = selectedDisplayStatus === 'displayed' ? 1 : 0;
			filtered = filtered.filter(feedback => feedback.is_displayed === isDisplayed);
		}
		
		// Read status filter
		if (selectedReadStatus !== 'all') {
			const isRead = selectedReadStatus === 'read' ? 1 : 0;
			filtered = filtered.filter(feedback => feedback.is_read === isRead);
		}
		
		// Sorting
		switch (sortBy) {
			case 'oldest':
				filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
				break;
			case 'name':
				filtered.sort((a, b) => a.visitor_name.localeCompare(b.visitor_name));
				break;
			case 'recent':
			default:
				filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				break;
		}
		
		filteredFeedbacks = filtered;
	}
	
	// Reactive statement to trigger filtering
	$: if (searchQuery || selectedDisplayStatus || selectedReadStatus || sortBy || feedbacks) {
		filterAndSortFeedbacks();
	}
	
	// Toggle display status
	async function toggleDisplay(feedbackId) {
		try {
			const feedback = feedbacks.find(f => f.feedback_id === feedbackId);
			if (!feedback) return;
			
			const newStatus = feedback.is_displayed === 1 ? 0 : 1;
			await feedbackAPI.update(feedbackId, { is_displayed: newStatus });
			
			feedbacks = feedbacks.map(f => 
				f.feedback_id === feedbackId 
					? { ...f, is_displayed: newStatus }
					: f
			);
			filterAndSortFeedbacks();
		} catch (err) {
			alert('Gagal mengubah status tampilan: ' + err.message);
		}
	}
	
	// Mark as read/unread
	async function toggleRead(feedbackId) {
		try {
			const feedback = feedbacks.find(f => f.feedback_id === feedbackId);
			if (!feedback) return;
			
			const newStatus = feedback.is_read === 1 ? 0 : 1;
			await feedbackAPI.update(feedbackId, { is_read: newStatus });
			
			feedbacks = feedbacks.map(f => 
				f.feedback_id === feedbackId 
					? { ...f, is_read: newStatus }
					: f
			);
			filterAndSortFeedbacks();
		} catch (err) {
			alert('Gagal mengubah status baca: ' + err.message);
		}
	}
	
	// Delete feedback - show confirmation modal
	function confirmDelete(feedback) {
		feedbackToDelete = feedback;
		showDeleteModal = true;
	}
	
	// Execute delete
	async function executeDelete() {
		if (!feedbackToDelete) return;
		
		deleting = true;
		try {
			await feedbackAPI.delete(feedbackToDelete.feedback_id);
			feedbacks = feedbacks.filter(f => f.feedback_id !== feedbackToDelete.feedback_id);
			filterAndSortFeedbacks();
			showDeleteModal = false;
			feedbackToDelete = null;
			
			// Close detail modal if open and deleting the viewed feedback
			if (isDetailModalOpen && selectedFeedback?.feedback_id === feedbackToDelete.feedback_id) {
				isDetailModalOpen = false;
				selectedFeedback = null;
			}
		} catch (err) {
			alert('Gagal menghapus feedback: ' + err.message);
		} finally {
			deleting = false;
		}
	}
	
	// Cancel delete
	function cancelDelete() {
		showDeleteModal = false;
		feedbackToDelete = null;
	}
	
	// View detail
	function viewDetail(feedback) {
		selectedFeedback = feedback;
		isDetailModalOpen = true;
		
		// Mark as read when viewing
		if (feedback.is_read === 0) {
			toggleRead(feedback.feedback_id);
		}
	}
	
	function closeDetailModal() {
		isDetailModalOpen = false;
		selectedFeedback = null;
	}
	
	// Handle ESC key to close modals
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			if (showDeleteModal) {
				cancelDelete();
			}
		}
	}
	
	// Handle click outside modal
	function handleModalClick(event) {
		if (event.target === event.currentTarget) {
			if (showDeleteModal) {
				cancelDelete();
			}
		}
	}
	
	// Export data
	function exportData() {
		const csvContent = [
			['ID', 'Visitor Name', 'Email', 'Company', 'Message', 'IP Address', 'User Agent', 'Displayed', 'Read', 'Created At'].join(','),
			...filteredFeedbacks.map(f => [
				f.feedback_id,
				f.visitor_name,
				f.visitor_email,
				f.company_name || '',
				`"${f.message.replace(/"/g, '""')}"`,
				f.ip_address || '',
				`"${(f.user_agent || '').replace(/"/g, '""')}"`,
				f.is_displayed ? 'Yes' : 'No',
				f.is_read ? 'Yes' : 'No',
				f.created_at
			].join(','))
		].join('\n');
		
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `feedback_export_${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	}
	
	// Utility functions
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Asia/Jakarta'
		});
	}
	
	function getShortMessage(message, maxLength = 100) {
		if (!message) return '';
		return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
	}
	
	// Get stats
	$: stats = {
		total: feedbacks.length,
		displayed: feedbacks.filter(f => f.is_displayed === 1).length,
		hidden: feedbacks.filter(f => f.is_displayed === 0).length,
		unread: feedbacks.filter(f => f.is_read === 0).length,
		read: feedbacks.filter(f => f.is_read === 1).length
	};
	
	onMount(() => {
		loadFeedbacks();
	});
</script>

<svelte:head>
	<title>Feedback Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Header -->
	<div class="mb-6">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Feedback Management</h1>
				<p class="text-gray-600 mt-1">Kelola feedback dari pengunjung website</p>
			</div>
			<button 
				onclick={exportData}
				class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors gap-2"
			>
				<Download class="w-4 h-4" />
				Export Data
			</button>
		</div>
	</div>

	<!-- Loading State -->
	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
				<p class="text-gray-600">Memuat data feedback...</p>
			</div>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
			<p class="font-medium">Error: {error}</p>
			<button 
				onclick={loadFeedbacks}
				class="mt-2 text-sm underline hover:no-underline"
			>
				Coba lagi
			</button>
		</div>
	{:else}
		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 mb-6">
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Feedback</p>
						<p class="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
					</div>
					<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
						<MessageSquare class="w-5 h-5 text-blue-600" />
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Ditampilkan</p>
						<p class="text-2xl font-bold text-green-600 mt-1">{stats.displayed}</p>
					</div>
					<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
						<Eye class="w-5 h-5 text-green-600" />
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Disembunyikan</p>
						<p class="text-2xl font-bold text-gray-600 mt-1">{stats.hidden}</p>
					</div>
					<div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
						<EyeOff class="w-5 h-5 text-gray-600" />
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Belum Dibaca</p>
						<p class="text-2xl font-bold text-orange-600 mt-1">{stats.unread}</p>
					</div>
					<div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
						<MailIcon class="w-5 h-5 text-orange-600" />
					</div>
				</div>
			</div>

			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Sudah Dibaca</p>
						<p class="text-2xl font-bold text-blue-600 mt-1">{stats.read}</p>
					</div>
					<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
						<CheckCircle class="w-5 h-5 text-blue-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Filters and Search -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
			<div class="flex flex-col xl:flex-row gap-4">
				<!-- Search Bar -->
				<div class="flex-1 min-w-0">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Cari feedback berdasarkan nama, email, perusahaan, atau pesan..."
							class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
						/>
					</div>
				</div>

				<!-- Filter Buttons -->
				<div class="flex flex-wrap gap-2">
					<!-- Display Status Filter -->
					<div class="relative">
						<select 
							bind:value={selectedDisplayStatus}
							class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[180px]"
						>
							<option value="all">Semua Status Tampilan</option>
							<option value="displayed">Ditampilkan</option>
							<option value="hidden">Disembunyikan</option>
						</select>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>

					<!-- Read Status Filter -->
					<div class="relative">
						<select 
							bind:value={selectedReadStatus}
							class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[160px]"
						>
							<option value="all">Semua Status Baca</option>
							<option value="read">Sudah Dibaca</option>
							<option value="unread">Belum Dibaca</option>
						</select>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>

					<!-- Sort Filter -->
					<div class="relative">
						<select 
							bind:value={sortBy}
							class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]"
						>
							<option value="recent">Terbaru</option>
							<option value="oldest">Terlama</option>
							<option value="name">Nama A-Z</option>
						</select>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Feedback Table -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
			{#if filteredFeedbacks.length === 0}
				<div class="text-center py-12 px-4">
					<MessageSquare class="w-12 h-12 text-gray-400 mx-auto mb-3" />
					<p class="text-gray-600 font-medium">Tidak ada feedback yang ditemukan</p>
					<p class="text-sm text-gray-500 mt-1">Coba ubah filter atau kata kunci pencarian Anda</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 border-b border-gray-200">
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
									Visitor
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
									Pesan
								</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
									Tanggal
								</th>
								<th class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
									Status
								</th>
								<th class="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
									Aksi
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each filteredFeedbacks as feedback (feedback.feedback_id)}
								<tr class="hover:bg-gray-50 transition-colors {feedback.is_read === 0 ? 'bg-blue-50' : ''}">
									<!-- Visitor Info -->
									<td class="px-4 py-4">
										<div class="flex items-start gap-3">
											<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
												<User class="w-5 h-5 text-blue-600" />
											</div>
											<div class="min-w-0">
												<p class="font-medium text-gray-900 truncate">{feedback.visitor_name}</p>
												<p class="text-sm text-gray-600 truncate">{feedback.visitor_email}</p>
												{#if feedback.company_name}
													<p class="text-xs text-gray-500 truncate mt-0.5">{feedback.company_name}</p>
												{/if}
												{#if feedback.is_read === 0}
													<span class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
														<MailIcon class="w-3 h-3" />
														Baru
													</span>
												{/if}
											</div>
										</div>
									</td>

									<!-- Message -->
									<td class="px-4 py-4">
										<p class="text-sm text-gray-900 line-clamp-2">
											{getShortMessage(feedback.message, 150)}
										</p>
										<button
											onclick={() => viewDetail(feedback)}
											class="text-sm text-blue-600 hover:text-blue-700 mt-1 hover:underline"
										>
											Lihat detail
										</button>
									</td>

									<!-- Date -->
									<td class="px-4 py-4">
										<div class="flex items-center gap-2 text-sm text-gray-600">
											<Calendar class="w-4 h-4" />
											{formatDate(feedback.created_at)}
										</div>
									</td>

									<!-- Status -->
									<td class="px-4 py-4">
										<div class="flex flex-col items-center gap-2">
											<span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium {feedback.is_displayed === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
												{#if feedback.is_displayed === 1}
													<Eye class="w-3 h-3" />
													Tampil
												{:else}
													<EyeOff class="w-3 h-3" />
													Sembunyi
												{/if}
											</span>
										</div>
									</td>

									<!-- Actions -->
									<td class="px-4 py-4">
										<div class="flex items-center justify-center gap-2">
											<!-- Toggle Display -->
											<button
												onclick={() => toggleDisplay(feedback.feedback_id)}
												class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
												title={feedback.is_displayed === 1 ? 'Sembunyikan' : 'Tampilkan'}
											>
												{#if feedback.is_displayed === 1}
													<EyeOff class="w-4 h-4 text-gray-600" />
												{:else}
													<Eye class="w-4 h-4 text-green-600" />
												{/if}
											</button>

											<!-- Toggle Read -->
											<button
												onclick={() => toggleRead(feedback.feedback_id)}
												class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
												title={feedback.is_read === 1 ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
											>
												{#if feedback.is_read === 1}
													<XCircle class="w-4 h-4 text-gray-600" />
												{:else}
													<CheckCircle class="w-4 h-4 text-blue-600" />
												{/if}
											</button>

											<!-- Delete -->
											<button
												onclick={() => confirmDelete(feedback)}
												class="p-2 hover:bg-red-50 rounded-lg transition-colors"
												title="Hapus"
											>
												<Trash2 class="w-4 h-4 text-red-600" />
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Result Count -->
				<div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
					<p class="text-sm text-gray-600">
						Menampilkan <span class="font-medium">{filteredFeedbacks.length}</span> dari <span class="font-medium">{feedbacks.length}</span> feedback
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Detail Modal -->
{#if isDetailModalOpen && selectedFeedback}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4" 
		style="background-color: rgba(0, 0, 0, 0.3);"
		onclick={closeDetailModal}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div 
			class="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" 
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Modal Header -->
			<div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
				<h3 class="text-xl font-bold text-gray-900">Detail Feedback</h3>
				<button 
					onclick={closeDetailModal}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<XCircle class="w-5 h-5 text-gray-600" />
				</button>
			</div>

			<!-- Modal Body -->
			<div class="p-6 space-y-6">
				<!-- Visitor Info -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
						<User class="w-4 h-4" />
						Informasi Pengunjung
					</h4>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p class="text-xs text-gray-500 mb-1">Nama</p>
							<p class="text-sm font-medium text-gray-900">{selectedFeedback.visitor_name}</p>
						</div>
						<div>
							<p class="text-xs text-gray-500 mb-1">Email</p>
							<p class="text-sm font-medium text-gray-900">{selectedFeedback.visitor_email}</p>
						</div>
						<div>
							<p class="text-xs text-gray-500 mb-1">Perusahaan</p>
							<p class="text-sm font-medium text-gray-900">{selectedFeedback.company_name || '-'}</p>
						</div>
						<div>
							<p class="text-xs text-gray-500 mb-1">Tanggal</p>
							<p class="text-sm font-medium text-gray-900">{formatDate(selectedFeedback.created_at)}</p>
						</div>
						<div class="md:col-span-2">
							<p class="text-xs text-gray-500 mb-1">IP Address</p>
							<p class="text-sm font-medium text-gray-900">{selectedFeedback.ip_address || '-'}</p>
						</div>
					</div>
				</div>

				<!-- Message -->
				<div>
					<h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
						<MessageSquare class="w-4 h-4" />
						Pesan
					</h4>
					<div class="bg-white border border-gray-200 rounded-lg p-4">
						<p class="text-gray-900 whitespace-pre-wrap">{selectedFeedback.message}</p>
					</div>
				</div>

				<!-- User Agent -->
				{#if selectedFeedback.user_agent}
					<div>
						<h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Monitor class="w-4 h-4" />
							Browser / Device
						</h4>
						<div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
							<p class="text-xs text-gray-600 font-mono break-all">{selectedFeedback.user_agent}</p>
						</div>
					</div>
				{/if}

				<!-- Status -->
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600">Status Tampilan:</span>
						<span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium {selectedFeedback.is_displayed === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
							{#if selectedFeedback.is_displayed === 1}
								<Eye class="w-3 h-3" />
								Ditampilkan
							{:else}
								<EyeOff class="w-3 h-3" />
								Disembunyikan
							{/if}
						</span>
					</div>

					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600">Status Baca:</span>
						<span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium {selectedFeedback.is_read === 1 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}">
							{#if selectedFeedback.is_read === 1}
								<CheckCircle class="w-3 h-3" />
								Sudah Dibaca
							{:else}
								<MailIcon class="w-3 h-3" />
								Belum Dibaca
							{/if}
						</span>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<button
						onclick={() => {
							toggleDisplay(selectedFeedback.feedback_id);
							selectedFeedback = { ...selectedFeedback, is_displayed: selectedFeedback.is_displayed === 1 ? 0 : 1 };
						}}
						class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						{selectedFeedback.is_displayed === 1 ? 'Sembunyikan' : 'Tampilkan'}
					</button>

					<button
						onclick={() => {
							confirmDelete(selectedFeedback);
							closeDetailModal();
						}}
						class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
					>
						Hapus
					</button>
				</div>

				<button
					onclick={closeDetailModal}
					class="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && feedbackToDelete}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.3);"
		onclick={handleModalClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="delete-modal-title"
		tabindex="-1"
	>
		<div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
						<Trash2 class="w-5 h-5 text-red-600" />
					</div>
					<div>
						<h3 id="delete-modal-title" class="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
						<p class="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
					</div>
				</div>
			</div>

			<!-- Modal Body -->
			<div class="p-6">
				<div class="mb-4">
					<p class="text-gray-700 mb-3">
						Apakah Anda yakin ingin menghapus feedback ini?
					</p>
					<div class="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
						<div class="flex items-start gap-3">
							<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
								<User class="w-5 h-5 text-blue-600" />
							</div>
							<div class="flex-1 min-w-0">
								<h4 class="font-medium text-gray-900 truncate">
									{feedbackToDelete.visitor_name}
								</h4>
								<p class="text-sm text-gray-500 truncate">
									{feedbackToDelete.visitor_email}
								</p>
								{#if feedbackToDelete.company_name}
									<p class="text-xs text-gray-400 truncate mt-1">
										{feedbackToDelete.company_name}
									</p>
								{/if}
								<p class="text-sm text-gray-600 mt-2 line-clamp-2">
									{feedbackToDelete.message}
								</p>
							</div>
						</div>
					</div>
				</div>
				
				<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
					<div class="flex items-start gap-2">
						<svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
						<div>
							<p class="text-sm font-medium text-yellow-800">Peringatan!</p>
							<p class="text-sm text-yellow-700">
								Data feedback akan dihapus secara permanen dari database.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="flex gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
				<button
					type="button"
					onclick={cancelDelete}
					class="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
					disabled={deleting}
				>
					Batal
				</button>
				<button
					type="button"
					onclick={executeDelete}
					disabled={deleting}
					class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if deleting}
						<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
						Menghapus...
					{:else}
						<Trash2 class="w-4 h-4" />
						Hapus Feedback
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>


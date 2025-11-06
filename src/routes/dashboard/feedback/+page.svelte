<script>
	import { onMount } from 'svelte';
	import { MessageSquare, Star, ThumbsUp, ThumbsDown, Eye, Trash2, Reply, Filter, Calendar, User, Mail, CheckCircle, XCircle, Clock, Search, Download } from 'lucide-svelte';
	
	// Feedback data
	let feedbacks = [
		{
			feedback_id: 1,
			client_name: 'Budi Santoso',
			client_email: 'budi.santoso@email.com',
			client_company: 'PT. Digital Nusantara',
			project_name: 'E-Commerce Platform',
			rating: 5,
			feedback_title: 'Pelayanan Luar Biasa!',
			feedback_message: 'Tim Kaha Solution sangat profesional dan responsive. Project e-commerce kami selesai tepat waktu dengan kualitas yang sangat memuaskan. Highly recommended!',
			feedback_type: 'project_review', // project_review, general_feedback, complaint, suggestion
			status: 'approved', // pending, approved, rejected
			is_featured: true,
			is_public: true,
			created_at: '2024-01-25',
			updated_at: '2024-01-25',
			admin_response: 'Terima kasih atas kepercayaan Anda kepada Kaha Solution. Kami senang dapat membantu mewujudkan project e-commerce yang sukses.',
			responded_by: 'Admin',
			responded_at: '2024-01-26'
		},
		{
			feedback_id: 2,
			client_name: 'Sarah Wijaya',
			client_email: 'sarah.wijaya@startup.id',
			client_company: 'StartupTech Indonesia',
			project_name: 'Mobile App Development',
			rating: 4,
			feedback_title: 'Hasil Bagus, Komunikasi Bisa Diperbaiki',
			feedback_message: 'Aplikasi mobile yang dibuat sudah sesuai dengan requirement. Namun komunikasi selama development masih bisa diperbaiki untuk update progress yang lebih regular.',
			feedback_type: 'project_review',
			status: 'approved',
			is_featured: false,
			is_public: true,
			created_at: '2024-01-22',
			updated_at: '2024-01-23',
			admin_response: 'Terima kasih atas feedback konstruktifnya. Kami akan meningkatkan komunikasi untuk project selanjutnya.',
			responded_by: 'Project Manager',
			responded_at: '2024-01-23'
		},
		{
			feedback_id: 3,
			client_name: 'Ahmad Rahman',
			client_email: 'ahmad.rahman@company.com',
			client_company: 'CV. Maju Berkembang',
			project_name: null,
			rating: 5,
			feedback_title: 'Konsultasi Gratis Sangat Membantu',
			feedback_message: 'Tim technical consultant memberikan insight yang sangat valuable untuk digital transformation perusahaan kami. Penjelasan detail dan mudah dipahami.',
			feedback_type: 'general_feedback',
			status: 'approved',
			is_featured: true,
			is_public: true,
			created_at: '2024-01-20',
			updated_at: '2024-01-20',
			admin_response: null,
			responded_by: null,
			responded_at: null
		},
		{
			feedback_id: 4,
			client_name: 'Lisa Permata',
			client_email: 'lisa.permata@ecommerce.co.id',
			client_company: 'Permata E-Commerce',
			project_name: 'Website Maintenance',
			rating: 2,
			feedback_title: 'Response Time Support Lambat',
			feedback_message: 'Website maintenance sudah ok, tapi ketika ada issue urgent, response time support team terlalu lambat. Harapannya bisa lebih cepat tanggap.',
			feedback_type: 'complaint',
			status: 'pending',
			is_featured: false,
			is_public: false,
			created_at: '2024-01-18',
			updated_at: '2024-01-18',
			admin_response: null,
			responded_by: null,
			responded_at: null
		},
		{
			feedback_id: 5,
			client_name: 'Dwi Handoko',
			client_email: 'dwi.handoko@tech.id',
			client_company: 'Tech Innovation Hub',
			project_name: null,
			rating: 4,
			feedback_title: 'Saran Penambahan Layanan AI/ML',
			feedback_message: 'Kaha Solution sudah bagus di web dan mobile development. Saran saya untuk menambah layanan AI/ML development karena banyak client yang mulai membutuhkan.',
			feedback_type: 'suggestion',
			status: 'approved',
			is_featured: false,
			is_public: true,
			created_at: '2024-01-15',
			updated_at: '2024-01-19',
			admin_response: 'Terima kasih atas sarannya. Tim kami sedang mengembangkan capabilities AI/ML dan akan segera meluncurkan layanan tersebut.',
			responded_by: 'CEO',
			responded_at: '2024-01-19'
		},
		{
			feedback_id: 6,
			client_name: 'Rina Sari',
			client_email: 'rina.sari@marketing.com',
			client_company: 'Digital Marketing Pro',
			project_name: 'Landing Page Optimization',
			rating: 5,
			feedback_title: 'Conversion Rate Meningkat 40%!',
			feedback_message: 'Setelah landing page dioptimasi oleh Kaha Solution, conversion rate kami meningkat dari 2.5% menjadi 3.5%. ROI dari investment ini sangat worth it!',
			feedback_type: 'project_review',
			status: 'approved',
			is_featured: true,
			is_public: true,
			created_at: '2024-01-12',
			updated_at: '2024-01-12',
			admin_response: 'Senang mendengar hasil yang positif! Tim kami akan terus membantu optimasi untuk hasil yang lebih baik lagi.',
			responded_by: 'Marketing Team',
			responded_at: '2024-01-13'
		}
	];
	
	// Filter states
	let searchQuery = '';
	let selectedType = 'all';
	let selectedStatus = 'all';
	let selectedRating = 'all';
	let sortBy = 'recent'; // recent, rating_high, rating_low, name
	let filteredFeedbacks = feedbacks;
	
	// Modal states
	let selectedFeedback = null;
	let isDetailModalOpen = false;
	let isResponseModalOpen = false;
	let adminResponse = '';
	
	// Filter and sort functions
	function filterAndSortFeedbacks() {
		let filtered = feedbacks;
		
		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(feedback => 
				feedback.client_name.toLowerCase().includes(query) ||
				feedback.client_email.toLowerCase().includes(query) ||
				feedback.client_company.toLowerCase().includes(query) ||
				feedback.feedback_title.toLowerCase().includes(query) ||
				feedback.feedback_message.toLowerCase().includes(query) ||
				(feedback.project_name && feedback.project_name.toLowerCase().includes(query))
			);
		}
		
		// Type filter
		if (selectedType !== 'all') {
			filtered = filtered.filter(feedback => feedback.feedback_type === selectedType);
		}
		
		// Status filter
		if (selectedStatus !== 'all') {
			filtered = filtered.filter(feedback => feedback.status === selectedStatus);
		}
		
		// Rating filter
		if (selectedRating !== 'all') {
			const rating = parseInt(selectedRating);
			filtered = filtered.filter(feedback => feedback.rating === rating);
		}
		
		// Sorting
		switch (sortBy) {
			case 'rating_high':
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			case 'rating_low':
				filtered.sort((a, b) => a.rating - b.rating);
				break;
			case 'name':
				filtered.sort((a, b) => a.client_name.localeCompare(b.client_name));
				break;
			case 'recent':
			default:
				filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				break;
		}
		
		filteredFeedbacks = filtered;
	}
	
	// Utility functions
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			timeZone: 'Asia/Jakarta'
		});
	}
	
	function getTypeColor(type) {
		switch (type) {
			case 'project_review': return 'bg-blue-100 text-blue-800';
			case 'general_feedback': return 'bg-green-100 text-green-800';
			case 'complaint': return 'bg-red-100 text-red-800';
			case 'suggestion': return 'bg-purple-100 text-purple-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	function getStatusColor(status) {
		switch (status) {
			case 'approved': return 'bg-green-100 text-green-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'rejected': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	function getTypeLabel(type) {
		const labels = {
			'project_review': 'Project Review',
			'general_feedback': 'General Feedback',
			'complaint': 'Complaint',
			'suggestion': 'Suggestion'
		};
		return labels[type] || type;
	}
	
	function getRatingStars(rating) {
		return Array.from({ length: 5 }, (_, i) => i < rating);
	}
	
	// CRUD operations
	function openDetailModal(feedback) {
		selectedFeedback = feedback;
		isDetailModalOpen = true;
	}
	
	function closeDetailModal() {
		selectedFeedback = null;
		isDetailModalOpen = false;
	}
	
	function openResponseModal(feedback) {
		selectedFeedback = feedback;
		adminResponse = feedback.admin_response || '';
		isResponseModalOpen = true;
	}
	
	function closeResponseModal() {
		selectedFeedback = null;
		adminResponse = '';
		isResponseModalOpen = false;
	}
	
	function submitResponse() {
		if (selectedFeedback && adminResponse.trim()) {
			feedbacks = feedbacks.map(feedback => 
				feedback.feedback_id === selectedFeedback.feedback_id 
					? { 
						...feedback, 
						admin_response: adminResponse,
						responded_by: 'Admin',
						responded_at: new Date().toISOString().split('T')[0],
						updated_at: new Date().toISOString().split('T')[0]
					}
					: feedback
			);
			closeResponseModal();
			filterAndSortFeedbacks();
			alert('Response berhasil disimpan!');
		}
	}
	
	function updateStatus(feedbackId, newStatus) {
		feedbacks = feedbacks.map(feedback => 
			feedback.feedback_id === feedbackId 
				? { ...feedback, status: newStatus, updated_at: new Date().toISOString().split('T')[0] }
				: feedback
		);
		filterAndSortFeedbacks();
	}
	
	function toggleFeatured(feedbackId) {
		feedbacks = feedbacks.map(feedback => 
			feedback.feedback_id === feedbackId 
				? { ...feedback, is_featured: !feedback.is_featured, updated_at: new Date().toISOString().split('T')[0] }
				: feedback
		);
		filterAndSortFeedbacks();
	}
	
	function togglePublic(feedbackId) {
		feedbacks = feedbacks.map(feedback => 
			feedback.feedback_id === feedbackId 
				? { ...feedback, is_public: !feedback.is_public, updated_at: new Date().toISOString().split('T')[0] }
				: feedback
		);
		filterAndSortFeedbacks();
	}
	
	function deleteFeedback(feedbackId) {
		if (confirm('Apakah Anda yakin ingin menghapus feedback ini?')) {
			feedbacks = feedbacks.filter(feedback => feedback.feedback_id !== feedbackId);
			filterAndSortFeedbacks();
		}
	}
	
	function exportData() {
		const csvContent = [
			['ID', 'Client Name', 'Email', 'Company', 'Project', 'Rating', 'Type', 'Status', 'Title', 'Message', 'Created At'].join(','),
			...filteredFeedbacks.map(f => [
				f.feedback_id,
				f.client_name,
				f.client_email,
				f.client_company,
				f.project_name || '',
				f.rating,
				f.feedback_type,
				f.status,
				f.feedback_title,
				`"${f.feedback_message.replace(/"/g, '""')}"`,
				f.created_at
			].join(','))
		].join('\n');
		
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'feedback_export.csv';
		a.click();
		window.URL.revokeObjectURL(url);
	}
	
	// Get stats
	$: stats = {
		total: feedbacks.length,
		pending: feedbacks.filter(f => f.status === 'pending').length,
		approved: feedbacks.filter(f => f.status === 'approved').length,
		featured: feedbacks.filter(f => f.is_featured).length,
		avgRating: feedbacks.length > 0 ? 
			(feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : 0,
		responseRate: feedbacks.length > 0 ? 
			((feedbacks.filter(f => f.admin_response).length / feedbacks.length) * 100).toFixed(1) : 0
	};
	
	onMount(() => {
		filterAndSortFeedbacks();
	});
	
	// Reactive statements
	$: if (searchQuery !== undefined || selectedType !== undefined || selectedStatus !== undefined || selectedRating !== undefined || sortBy !== undefined) {
		filterAndSortFeedbacks();
	}
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
				<p class="text-gray-600 mt-1">Kelola feedback dan review dari client</p>
			</div>
			<button 
				on:click={exportData}
				class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors gap-2"
			>
				<Download class="w-4 h-4" />
				Export Data
			</button>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-6 mb-6">
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
					<p class="text-sm font-medium text-gray-600">Pending</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
				</div>
				<div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
					<Clock class="w-5 h-5 text-yellow-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Approved</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.approved}</p>
				</div>
				<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
					<CheckCircle class="w-5 h-5 text-green-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Featured</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.featured}</p>
				</div>
				<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
					<Star class="w-5 h-5 text-purple-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Avg Rating</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.avgRating}</p>
				</div>
				<div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
					<Star class="w-5 h-5 text-orange-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Response Rate</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.responseRate}%</p>
				</div>
				<div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
					<Reply class="w-5 h-5 text-indigo-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
		<div class="flex flex-wrap items-center gap-4">
			<!-- Search -->
			<div class="flex-1 min-w-[280px]">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Cari feedback, client, atau project..."
						bind:value={searchQuery}
						class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
					/>
				</div>
			</div>
			
			<!-- Type Filter -->
			<select 
				bind:value={selectedType}
				class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]"
			>
				<option value="all">Semua Type</option>
				<option value="project_review">Project Review</option>
				<option value="general_feedback">General Feedback</option>
				<option value="complaint">Complaint</option>
				<option value="suggestion">Suggestion</option>
			</select>
			
			<!-- Status Filter -->
			<select 
				bind:value={selectedStatus}
				class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]"
			>
				<option value="all">Semua Status</option>
				<option value="pending">Pending</option>
				<option value="approved">Approved</option>
				<option value="rejected">Rejected</option>
			</select>
			
			<!-- Rating Filter -->
			<select 
				bind:value={selectedRating}
				class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]"
			>
				<option value="all">Semua Rating</option>
				<option value="5">5 Stars</option>
				<option value="4">4 Stars</option>
				<option value="3">3 Stars</option>
				<option value="2">2 Stars</option>
				<option value="1">1 Star</option>
			</select>
			
			<!-- Sort -->
			<select 
				bind:value={sortBy}
				class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]"
			>
				<option value="recent">Terbaru</option>
				<option value="rating_high">Rating Tertinggi</option>
				<option value="rating_low">Rating Terendah</option>
				<option value="name">Nama Client</option>
			</select>
		</div>
	</div>

	<!-- Feedback List -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="px-4 py-3 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Feedback List ({filteredFeedbacks.length})</h3>
		</div>
		
		<div class="divide-y divide-gray-200">
			{#each filteredFeedbacks as feedback}
				<div class="p-4 hover:bg-gray-50 transition-colors">
					<div class="flex items-start justify-between gap-4">
						<!-- Feedback Info -->
						<div class="flex-1">
							<div class="flex items-start gap-4">
								<!-- Client Avatar -->
								<div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
									<User class="w-5 h-5 text-blue-600" />
								</div>
								
								<!-- Feedback Details -->
								<div class="flex-1 space-y-3">
									<!-- Header -->
									<div class="flex items-start justify-between">
										<div>
											<h4 class="text-lg font-semibold text-gray-900">{feedback.feedback_title}</h4>
											<div class="flex items-center gap-2 mt-1">
												<span class="text-sm font-medium text-gray-700">{feedback.client_name}</span>
												<span class="text-sm text-gray-500">•</span>
												<span class="text-sm text-gray-500">{feedback.client_company}</span>
												{#if feedback.project_name}
													<span class="text-sm text-gray-500">•</span>
													<span class="text-sm text-blue-600">{feedback.project_name}</span>
												{/if}
											</div>
										</div>
										
										<!-- Rating -->
										<div class="flex items-center gap-1">
											{#each getRatingStars(feedback.rating) as filled}
												<Star class="w-4 h-4 {filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
											{/each}
											<span class="text-sm text-gray-600 ml-1">({feedback.rating})</span>
										</div>
									</div>
									
									<!-- Message -->
									<p class="text-gray-700 line-clamp-2">{feedback.feedback_message}</p>
									
									<!-- Tags -->
									<div class="flex flex-wrap gap-2">
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getTypeColor(feedback.feedback_type)}">
											{getTypeLabel(feedback.feedback_type)}
										</span>
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getStatusColor(feedback.status)}">
											{feedback.status}
										</span>
										{#if feedback.is_featured}
											<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
												Featured
											</span>
										{/if}
										{#if feedback.is_public}
											<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
												Public
											</span>
										{/if}
									</div>
									
									<!-- Response Status -->
									{#if feedback.admin_response}
										<div class="flex items-center gap-2 text-sm text-green-600">
											<Reply class="w-4 h-4" />
											<span>Responded by {feedback.responded_by} on {formatDate(feedback.responded_at)}</span>
										</div>
									{:else}
										<div class="flex items-center gap-2 text-sm text-gray-500">
											<Clock class="w-4 h-4" />
											<span>No response yet</span>
										</div>
									{/if}
									
									<!-- Meta -->
									<div class="flex items-center gap-4 text-sm text-gray-500">
										<div class="flex items-center gap-1">
											<Calendar class="w-4 h-4" />
											<span>{formatDate(feedback.created_at)}</span>
										</div>
										<div class="flex items-center gap-1">
											<Mail class="w-4 h-4" />
											<span>{feedback.client_email}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<!-- Actions -->
						<div class="flex flex-col gap-2">
							<button 
								on:click={() => openDetailModal(feedback)}
								class="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
								title="View Details"
							>
								<Eye class="w-4 h-4" />
							</button>
							
							{#if !feedback.admin_response}
								<button 
									on:click={() => openResponseModal(feedback)}
									class="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
									title="Add Response"
								>
									<Reply class="w-4 h-4" />
								</button>
							{/if}
							
							{#if feedback.status === 'pending'}
								<button 
									on:click={() => updateStatus(feedback.feedback_id, 'approved')}
									class="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
									title="Approve"
								>
									<CheckCircle class="w-4 h-4" />
								</button>
								<button 
									on:click={() => updateStatus(feedback.feedback_id, 'rejected')}
									class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
									title="Reject"
								>
									<XCircle class="w-4 h-4" />
								</button>
							{/if}
							
							<button 
								on:click={() => toggleFeatured(feedback.feedback_id)}
								class="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
								title={feedback.is_featured ? 'Remove from Featured' : 'Add to Featured'}
							>
								<Star class="w-4 h-4 {feedback.is_featured ? 'fill-current' : ''}" />
							</button>
							
							<button 
								on:click={() => deleteFeedback(feedback.feedback_id)}
								class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
								title="Delete"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
		
		{#if filteredFeedbacks.length === 0}
			<div class="text-center py-12">
				<MessageSquare class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada feedback</h3>
				<p class="mt-1 text-sm text-gray-500">
					{searchQuery ? 'Tidak ada feedback yang sesuai dengan pencarian.' : 'Belum ada feedback dari client.'}
				</p>
			</div>
		{/if}
	</div>
</div>

<!-- Detail Modal -->
{#if isDetailModalOpen && selectedFeedback}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
		<div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
			<div class="mt-3">
				<!-- Modal Header -->
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-lg font-medium text-gray-900">Detail Feedback</h3>
					<button 
						on:click={closeDetailModal}
						class="text-gray-400 hover:text-gray-600"
					>
						<span class="sr-only">Close</span>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Modal Content -->
				<div class="space-y-6">
					<!-- Client Info -->
					<div class="bg-gray-50 rounded-lg p-4">
						<h4 class="font-medium text-gray-900 mb-2">Informasi Client</h4>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span class="text-gray-600">Nama:</span>
								<span class="font-medium text-gray-900 ml-2">{selectedFeedback.client_name}</span>
							</div>
							<div>
								<span class="text-gray-600">Email:</span>
								<span class="font-medium text-gray-900 ml-2">{selectedFeedback.client_email}</span>
							</div>
							<div>
								<span class="text-gray-600">Perusahaan:</span>
								<span class="font-medium text-gray-900 ml-2">{selectedFeedback.client_company}</span>
							</div>
							{#if selectedFeedback.project_name}
								<div>
									<span class="text-gray-600">Project:</span>
									<span class="font-medium text-gray-900 ml-2">{selectedFeedback.project_name}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Feedback Content -->
					<div>
						<div class="flex items-center justify-between mb-4">
							<h4 class="font-medium text-gray-900">{selectedFeedback.feedback_title}</h4>
							<div class="flex items-center gap-1">
								{#each getRatingStars(selectedFeedback.rating) as filled}
									<Star class="w-5 h-5 {filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
								{/each}
							</div>
						</div>
						<p class="text-gray-700 whitespace-pre-wrap">{selectedFeedback.feedback_message}</p>
					</div>

					<!-- Admin Response -->
					{#if selectedFeedback.admin_response}
						<div class="bg-blue-50 rounded-lg p-4">
							<h4 class="font-medium text-blue-900 mb-2">Response Admin</h4>
							<p class="text-blue-800 whitespace-pre-wrap">{selectedFeedback.admin_response}</p>
							<div class="mt-2 text-sm text-blue-600">
								Responded by {selectedFeedback.responded_by} on {formatDate(selectedFeedback.responded_at)}
							</div>
						</div>
					{/if}

					<!-- Meta Info -->
					<div class="border-t pt-4">
						<div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
							<div>Type: <span class="font-medium">{getTypeLabel(selectedFeedback.feedback_type)}</span></div>
							<div>Status: <span class="font-medium">{selectedFeedback.status}</span></div>
							<div>Created: <span class="font-medium">{formatDate(selectedFeedback.created_at)}</span></div>
							<div>Updated: <span class="font-medium">{formatDate(selectedFeedback.updated_at)}</span></div>
						</div>
					</div>
				</div>

				<!-- Modal Actions -->
				<div class="flex items-center justify-end gap-3 mt-8">
					<button 
						on:click={closeDetailModal}
						class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Tutup
					</button>
					{#if !selectedFeedback.admin_response}
						<button 
							on:click={() => { closeDetailModal(); openResponseModal(selectedFeedback); }}
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Add Response
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Response Modal -->
{#if isResponseModalOpen && selectedFeedback}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
		<div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
			<div class="mt-3">
				<!-- Modal Header -->
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-lg font-medium text-gray-900">Response untuk {selectedFeedback.client_name}</h3>
					<button 
						on:click={closeResponseModal}
						class="text-gray-400 hover:text-gray-600"
					>
						<span class="sr-only">Close</span>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Original Feedback -->
				<div class="bg-gray-50 rounded-lg p-4 mb-6">
					<h4 class="font-medium text-gray-900 mb-2">{selectedFeedback.feedback_title}</h4>
					<p class="text-gray-700 text-sm">{selectedFeedback.feedback_message}</p>
				</div>

				<!-- Response Form -->
				<div>
					<label for="admin_response" class="block text-sm font-medium text-gray-700 mb-2">Response Admin</label>
					<textarea
						id="admin_response"
						bind:value={adminResponse}
						placeholder="Tulis response untuk feedback ini..."
						rows="6"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
					></textarea>
				</div>

				<!-- Modal Actions -->
				<div class="flex items-center justify-end gap-3 mt-6">
					<button 
						on:click={closeResponseModal}
						class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Batal
					</button>
					<button 
						on:click={submitResponse}
						disabled={!adminResponse.trim()}
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Kirim Response
					</button>
				</div>
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
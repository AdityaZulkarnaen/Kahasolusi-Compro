import ProjectExampleImg from '$lib/assets/images/project_example.png';

export const projects = [
    {
        id: 1,
        title: 'Aplikasi Jogja Center',
        description: 'Jogja Center adalah sebuah inisiatif pengembangan sistem analitik berbasis big data, yang difokuskan pada pengembangan sistem analitik dan penelusuran perkembangan keputusan, serta menyajikan pada dimensi-dimensi Jogja Smart Province (JSP).',
        category: 'pemerintah',
        image: ProjectExampleImg,
        link: '#',
        problems: [
            'Biro Perekonomian Pemerintah Daerah Daerah Istimewa Yogyakarta melalui inisiatif Jogja Center menghadapi tantangan dalam mengelola dan menganalisis data dalam skala besar. Volume data yang terus bertambah dari berbagai sektor membuat proses analisis lambat dan kurang efisien. Selain itu, belum adanya sistem analitik terpadu membuat pengambilan keputusan strategis berbasis data menjadi kurang optimal, terutama dalam mendukung realisasi visi Jogja Smart Province (JSP).'
        ],
        results: [
            'Insight Data UKM Online',
            'Demographic Proses UKM di Ecommerce',
            'Insight Google Analytic',
            'Saluran Langsungnya Kerja',
            'Proses Pengajuan',
            'Analisis Keuangan Publik',
            'Pemberian Koperasi di DIY',
            'Perusahaan UMKM di DIY'
        ],
        images: [
            {
                url: ProjectExampleImg,
                alt: 'Dashboard Jogja Center'
            },
            {
                url: ProjectExampleImg,
                alt: 'Analytics Dashboard'
            }
        ],
        technologies: [
            {
                name: 'HTML5',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"></path><path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z"></path><path fill="#EBEBEB" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z"></path><path fill="#fff" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z"></path></svg>'
            },
            {
                name: 'CSS3',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z"></path><path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z"></path><path fill="#fff" d="M64.001 51.429h18.302l1.264-14.163H64.001V23.435h34.682l-.332 3.711-3.4 38.114h-30.95V51.429z"></path><path fill="#EBEBEB" d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031H33.752l1.937 21.717 28.331 7.863.063-.018v-14.39z"></path><path fill="#fff" d="M81.127 64.675l-1.666 18.522-15.426 4.164v14.39l28.354-7.858.208-2.337 2.406-26.881H81.127z"></path><path fill="#EBEBEB" d="M64.048 23.435v13.831H30.64l-.277-3.108-.63-7.012-.331-3.711h34.646zm-.047 27.996v13.831H48.792l-.277-3.108-.631-7.012-.33-3.711h16.447z"></path></svg>'
            },
            {
                name: 'JavaScript',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"></path><path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"></path></svg>'
            }
        ],
        client: 'Pemerintah DIY',
        year: 2024
    },
    {
        id: 2,
        title: 'Portal Desa Digital',
        description: 'Platform digital untuk administrasi desa yang mencakup sistem informasi penduduk, pelayanan publik, dan manajemen keuangan desa. Dilengkapi dengan fitur e-commerce untuk UMKM lokal dan sistem pelaporan terintegrasi.',
        category: 'pemerintah',
        image: ProjectExampleImg,
        link: '#',
        problems: [
            'Administrasi desa masih menggunakan sistem manual berbasis kertas',
            'Kesulitan dalam pelacakan data penduduk dan demografi',
            'Kurangnya transparansi dalam pengelolaan keuangan desa',
            'UMKM desa kesulitan memasarkan produk secara online',
            'Proses pelaporan ke pemerintah pusat memakan waktu lama'
        ],
        results: [
            'Digitalisasi 100% administrasi desa',
            'Database penduduk terintegrasi dan real-time',
            'Transparansi keuangan desa meningkat 85%',
            'Marketplace UMKM dengan 200+ produk lokal',
            'Waktu pelaporan berkurang dari 2 minggu menjadi 1 hari',
            'Peningkatan pendapatan desa sebesar 45%'
        ],
        images: [
            {
                url: ProjectExampleImg,
                alt: 'Dashboard Portal Desa'
            },
            {
                url: ProjectExampleImg,
                alt: 'Marketplace UMKM'
            }
        ],
        technologies: [
            {
                name: 'Vue.js',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#41B883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"></path><path fill="#34495E" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"></path></svg>'
            },
            {
                name: 'Laravel',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#FF2D20" d="M40.53 61.48l15.85-5.42v-8.42l-26.96 9.21v8.39l26.96 18.44v-8.55zm-11.1 21.92v-27.9l11.1 7.75v12.4zm76.8-22.8l-26.96-9.21v8.42l15.85 5.42-15.85 10.68v8.55l26.96-18.44v-8.42zm-15.86 22.8l-11.1-7.75v-12.4l11.1 7.75z"></path></svg>'
            },
            {
                name: 'MySQL',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#00618A" d="M125.477 122.783l-2.616-2.537c-2.479-3.292-5.668-6.184-8.514-9.482-2.693-3.295-5.8-6.24-9.314-8.771-4.313-3.295-8.717-6.24-13.608-8.533-4.364-2.03-8.905-3.471-13.752-3.988-2.479-0.259-4.364-0.772-6.065-1.8-1.224-0.772-2.22-1.803-3.207-2.833-0.772-0.776-1.545-1.545-2.318-2.318-0.772-0.773-1.545-1.545-2.318-2.318-0.772-0.776-1.545-1.545-2.318-2.318-0.772-0.773-1.545-1.545-2.318-2.318l-7.133-7.133c-2.479-2.479-4.871-5.137-7.262-7.794-1.8-2.03-3.859-3.859-6.24-5.144-2.03-1.03-4.364-1.545-6.698-1.545-2.03-0.259-4.364-0.259-6.395 0-1.287 0.259-2.575 0.259-3.859 0.517-1.8 0.517-3.471 1.287-5.144 2.316-2.576 1.545-4.871 3.471-6.698 5.668-1.8 2.316-3.471 4.633-5.144 6.698-2.063 2.575-3.859 5.411-5.668 8.248-1.8 3.036-3.859 5.672-6.24 8.041-2.03 2.03-4.313 3.859-6.698 5.411-2.316 1.545-4.633 2.833-6.698 4.633-1.8 1.287-3.471 2.575-5.144 3.859-1.8 1.287-3.471 2.575-5.144 3.859-2.83 2.03-5.668 4.313-8.248 6.698-2.479 2.316-4.871 4.633-7.262 6.949-2.479 2.479-4.871 5.137-7.262 7.794-1.8 2.03-3.859 3.859-6.24 5.144-2.03 1.03-4.364 1.545-6.698 1.545h-1.029c-0.517 0-1.029 0-1.545-0.259-0.517-0.259-1.029-0.517-1.545-0.776-0.517-0.259-1.029-0.517-1.545-0.776-0.517-0.259-1.029-0.517-1.545-0.776-0.517-0.259-1.029-0.517-1.545-0.776-0.517-0.259-1.029-0.517-1.545-0.776-0.517-0.259-1.029-0.517-1.545-0.776-0.517-0.259-1.029-0.517-1.545-0.776l-1.8-1.029c-2.063-1.287-3.859-2.833-5.411-4.633l-2.616-2.537v-0.259c0-0.517 0.259-1.029 0.517-1.545 0.517-1.029 1.287-2.03 2.03-2.833 1.287-1.545 2.575-2.833 4.12-3.859 2.316-1.545 4.633-2.833 6.698-4.633 1.8-1.287 3.471-2.575 5.144-3.859 1.8-1.287 3.471-2.575 5.144-3.859 2.03-1.545 4.12-3.295 5.924-5.137 2.316-2.316 4.633-4.633 6.698-7.262 1.8-2.575 3.859-5.144 5.668-7.794 1.545-2.316 3.295-4.633 5.144-6.698 2.03-2.316 4.364-4.364 6.698-6.24 2.575-1.8 5.411-3.295 8.248-4.364 2.316-0.776 4.633-1.287 6.949-1.545 2.316-0.259 4.633-0.259 6.949 0.259 2.316 0.517 4.633 1.287 6.698 2.316 2.479 1.287 4.633 2.833 6.698 4.633 2.316 2.03 4.364 4.364 6.24 6.698l7.133 7.133c2.479 2.479 4.871 5.137 7.262 7.794 1.8 2.03 3.859 3.859 6.24 5.144 2.03 1.03 4.364 1.545 6.698 1.545 2.03 0.259 4.364 0.259 6.395 0 1.287-0.259 2.575-0.259 3.859-0.517 1.8-0.517 3.471-1.287 5.144-2.316 2.575-1.545 4.871-3.471 6.698-5.668 1.8-2.316 3.471-4.633 5.144-6.698 2.063-2.575 3.859-5.411 5.668-8.248 1.8-3.036 3.859-5.672 6.24-8.041 2.03-2.03 4.313-3.859 6.698-5.411 2.316-1.545 4.633-2.833 6.698-4.633 1.8-1.287 3.471-2.575 5.144-3.859 1.8-1.287 3.471-2.575 5.144-3.859 2.83-2.03 5.668-4.313 8.248-6.698 2.479-2.316 4.871-4.633 7.262-6.949 2.479-2.479 4.871-5.137 7.262-7.794 1.8-2.03 3.859-3.859 6.24-5.144 2.03-1.03 4.364-1.545 6.698-1.545h1.029c0.517 0 1.029 0 1.545 0.259 0.517 0.259 1.029 0.517 1.545 0.776 0.517 0.259 1.029 0.517 1.545 0.776 0.517 0.259 1.029 0.517 1.545 0.776 0.517 0.259 1.029 0.517 1.545 0.776 0.517 0.259 1.029 0.517 1.545 0.776 0.517 0.259 1.029 0.517 1.545 0.776 0.517 0.259 1.029 0.517 1.545 0.776l1.8 1.029c2.063 1.287 3.859 2.833 5.411 4.633l2.616 2.537v0.259c0 0.517-0.259 1.029-0.517 1.545-0.517 1.029-1.287 2.03-2.03 2.833z"></path></svg>'
            }
        ],
        client: 'Kementerian Desa PDTT',
        year: 2024
    },
    {
        id: 3,
        title: 'E-Commerce Fashion Store',
        description: 'Platform e-commerce untuk fashion store dengan fitur katalog produk, sistem pembayaran terintegrasi, manajemen inventory, dan dashboard analytics. Dilengkapi dengan mobile app untuk customer dan admin panel untuk penjual.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        problems: [
            'Penjualan offline terbatas jangkauan geografis',
            'Kesulitan mengelola inventory multi-cabang',
            'Proses checkout manual menyebabkan kehilangan penjualan',
            'Kurangnya data analytics untuk keputusan bisnis',
            'Biaya operasional toko fisik yang tinggi'
        ],
        results: [
            'Jangkauan pasar meluas ke seluruh Indonesia',
            'Sistem inventory real-time untuk 50+ cabang',
            'Konversi penjualan meningkat 120%',
            'Dashboard analytics untuk business intelligence',
            'ROI positif dalam 6 bulan pertama',
            'Penjualan online mencapai 60% dari total revenue'
        ],
        images: [
            {
                url: ProjectExampleImg,
                alt: 'Homepage E-Commerce'
            },
            {
                url: ProjectExampleImg,
                alt: 'Product Catalog'
            }
        ],
        technologies: [
            {
                name: 'Next.js',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#000000" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"></path></svg>'
            },
            {
                name: 'React',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><g fill="#61DAFB"><circle cx="64" cy="64" r="11.4"></circle><path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21.1c-1.2-2-2.3-4.1-3.4-6.2-1.2-2.1-2.4-4.1-3.6-6-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2h7zm4.3 2.7c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2-2.2-4.1-3.4-6.1-1.2-2.1-2.4-4.1-3.6-6.1zm11.4-14.7c6.9 2.7 11.2 6.2 11.2 10.2 0 4-4.3 7.5-11.2 10.2-3.2 1.2-6.7 2.3-10.4 3.1-2.3-6.9-5.3-13.8-8.9-20.6 3.6-6.8 6.6-13.7 8.9-20.6 3.7.8 7.2 1.9 10.4 3.1zM64 11c7.4 0 14.9 5 22.2 13.5-3.6 3.8-7.2 8-10.8 12.4-5.7.5-11.2 1.3-16.4 2.5-.6-2.3-1.1-4.5-1.4-6.6-1.7-10.5-.3-17.9 3.8-20.3 1-.5 2.2-.9 3.6-.9zM46.1 14.7c1 .6 1.8 1.5 2.5 2.6 1.3 2.2 2 5.6 2 9.7 0 2.1-.2 4.3-.5 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3.6 0 1.2.1 1.9.2zM35.5 97.3c-6.9-2.7-11.2-6.2-11.2-10.2 0-4 4.3-7.5 11.2-10.2 3.2-1.2 6.7-2.3 10.4-3.1 2.3 6.9 5.3 13.8 8.9 20.6-3.6 6.8-6.6 13.7-8.9 20.6-3.7-.8-7.2-1.9-10.4-3.1zm28.5 16.3c-7.4 0-14.9-5-22.2-13.5 3.6-3.8 7.2-8 10.8-12.4 5.7-.5 11.2-1.3 16.4-2.5.6 2.3 1.1 4.5 1.4 6.6 1.7 10.5.3 17.9-3.8 20.3-1 .5-2.2.9-3.6.9zm18.2-.2c-1-.6-1.8-1.5-2.5-2.6-1.3-2.2-2-5.6-2-9.7 0-2.1.2-4.3.5-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-.6 0-1.2-.1-1.9-.2z"></path></g></svg>'
            },
            {
                name: 'PostgreSQL',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#336791" d="M105.15 102.31c-2.37.28-3.13-1.41-3.13-1.41s21.54-28.59 16.13-64.35c0 0-3.59-25.77-38.23-20.69-34.64 5.08-31.92 11.28-31.92 11.28s3.28-9.73 18.46-15.15c15.18-5.42 41.64-3.46 49.74 18.22 8.1 21.68-11.05 72.1-11.05 72.1z"></path><path fill="#336791" d="M96.09 104.63s-1.65 1.79-3.39.98c-1.74-.81-32.77-35.11-32.77-35.11l-3.9 3.42s27.38 30.08 28.62 32.05c1.24 1.97.84 3.77-1.27 4.15-2.11.38-6.57.45-10.23-4.97-3.66-5.42-26.64-32.05-26.64-32.05l-4.27 4.27s20.37 25.87 21.46 29.03c1.09 3.16 1.33 6.32-2.82 7.13-4.15.81-8.92-.3-13.69-7.92-4.77-7.62-18.83-29.7-18.83-29.7l-3.42 3.59s13.69 20.37 14.93 24.13c1.24 3.76.92 6.46-3.59 7.35-4.51.89-7.54-.38-11.28-7.48-3.74-7.1-11.28-23.32-11.28-23.32s-1.79-4.43 4.27-11.13c6.06-6.7 18.46-18.83 18.46-18.83s-10.85-1.01-15.48 3.16c-4.63 4.17-23.17 23.17-25.87 30.73-2.7 7.56-.98 11.46 3.59 15.05 4.57 3.59 14.36 4.27 23.32-3.9 8.96-8.17 15.62-16.01 15.62-16.01s8.92 10.08 15.62 20.37c6.7 10.29 12.69 15.9 21.69 17.01 9 1.11 16.01-2.82 18.07-7.62 2.06-4.8 1.33-9.8-1.58-13.84-2.91-4.04-9.89-11.77-9.89-11.77z"></path></svg>'
            }
        ],
        client: 'Fashion Retailer XYZ',
        year: 2023
    },
    {
        id: 4,
        title: 'Sistem Informasi Akademik',
        description: 'Sistem informasi akademik terintegrasi untuk perguruan tinggi yang mencakup manajemen mahasiswa, dosen, mata kuliah, jadwal, nilai, dan keuangan. Dilengkapi dengan portal mahasiswa dan dosen.',
        category: 'akademik',
        image: ProjectExampleImg,
        link: '#',
        problems: [
            'Proses administrasi akademik masih manual dan berbelit-belit',
            'Data mahasiswa dan dosen tersebar di berbagai sistem',
            'Kesulitan dalam penjadwalan mata kuliah dan ruangan',
            'Proses input nilai memakan waktu lama',
            'Kurangnya transparansi informasi akademik untuk mahasiswa'
        ],
        results: [
            'Sistem terintegrasi untuk seluruh proses akademik',
            'Efisiensi waktu administrasi meningkat 70%',
            'Penjadwalan otomatis dengan deteksi konflik',
            'Portal self-service untuk mahasiswa dan dosen',
            'Pelaporan akademik real-time',
            'Kepuasan pengguna meningkat 85%'
        ],
        images: [
            {
                url: ProjectExampleImg,
                alt: 'Dashboard SIAKAD'
            },
            {
                url: ProjectExampleImg,
                alt: 'Portal Mahasiswa'
            }
        ],
        technologies: [
            {
                name: 'Angular',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#DD0031" d="M63.81 1.026L4.553 21.88l9.363 77.637 49.957 27.457 50.214-27.828 9.36-77.635L63.81 1.026z"></path><path fill="#C3002F" d="M63.81 1.026v125.954l50.214-27.828 9.36-77.635L63.81 1.026z"></path><path fill="#FFFFFF" d="M63.81 21.458L38.967 82.83h9.378l5.084-12.695h20.768l5.086 12.695h9.378L63.81 21.458zM63.812 38.67l7.616 18.773h-15.23l7.614-18.773z"></path></svg>'
            },
            {
                name: 'Spring Boot',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#6DB33F" d="M116.452 6.643a59.104 59.104 0 01-6.837 12.136A64.249 64.249 0 0064.205 128C28.984 128 0 99.017 0 63.795a63.876 63.876 0 0163.795-63.8 64.32 64.32 0 0145.46 18.776 59.104 59.104 0 016.837 12.136 63.876 63.876 0 01-63.8 63.8c35.221 0 63.8-28.984 63.8-63.8a63.876 63.876 0 00-63.8-63.8 64.32 64.32 0 00-45.46 18.776z"></path></svg>'
            },
            {
                name: 'Oracle',
                icon: '<svg viewBox="0 0 128 128" class="w-full h-full"><path fill="#EA1B22" d="M81.8 49.2c-8.6 0-15.6 7-15.6 15.6s7 15.6 15.6 15.6 15.6-7 15.6-15.6-7-15.6-15.6-15.6zm0 26.5c-6 0-10.9-4.9-10.9-10.9s4.9-10.9 10.9-10.9 10.9 4.9 10.9 10.9-4.9 10.9-10.9 10.9z"></path></svg>'
            }
        ],
        client: 'Institut Teknologi DEF',
        year: 2023
    },
    {
        id: 5,
        title: 'Smart City Dashboard',
        description: 'Dashboard monitoring kota pintar yang mengintegrasikan data dari berbagai sensor IoT, sistem transportasi, manajemen energi, dan layanan publik. Dilengkapi dengan analytics dan reporting real-time.',
        category: 'pemerintah',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['React', 'Python', 'InfluxDB'],
        client: 'Pemerintah Kota Bandung',
        year: 2024
    },
    {
        id: 6,
        title: 'HR Management System',
        description: 'Sistem manajemen SDM komprehensif yang mencakup rekrutmen, manajemen karyawan, payroll, performance management, dan learning management system. Dilengkapi dengan mobile app untuk karyawan.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['React', 'Node.js', 'MongoDB'],
        client: 'PT. Teknologi Maju',
        year: 2023
    },
    {
        id: 7,
        title: 'E-Learning Platform',
        description: 'Platform pembelajaran online untuk sekolah dan universitas dengan fitur virtual classroom, assignment management, quiz system, dan video conferencing. Dilengkapi dengan mobile app untuk siswa dan guru.',
        category: 'akademik',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Vue.js', 'Django', 'PostgreSQL'],
        client: 'Sekolah Negeri 1 Jakarta',
        year: 2024
    },
    {
        id: 8,
        title: 'Telemedicine App',
        description: 'Aplikasi telemedicine yang menghubungkan pasien dengan dokter untuk konsultasi online, appointment booking, electronic medical records, dan sistem pembayaran terintegrasi.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['React Native', 'Express.js', 'MongoDB'],
        client: 'Rumah Sakit Digital',
        year: 2024
    },
    {
        id: 9,
        title: 'Sistem Pajak Online',
        description: 'Platform perpajakan online untuk memudahkan wajib pajak dalam melaporkan dan membayar pajak. Dilengkapi dengan kalkulator pajak, reminder, dan sistem verifikasi dokumen otomatis.',
        category: 'pemerintah',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Angular', '.NET Core', 'SQL Server'],
        client: 'Direktorat Jenderal Pajak',
        year: 2023
    },
    {
        id: 10,
        title: 'Library Management System',
        description: 'Sistem manajemen perpustakaan digital dengan fitur katalog buku, peminjaman online, reservasi, denda otomatis, dan digital library. Dilengkapi dengan barcode scanner dan RFID integration.',
        category: 'akademik',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Laravel', 'Vue.js', 'MySQL'],
        client: 'Perpustakaan Nasional',
        year: 2023
    },
    {
        id: 11,
        title: 'FinTech Payment Gateway',
        description: 'Gateway pembayaran digital untuk mendukung transaksi e-commerce, transfer antar bank, payment QR code, dan wallet digital. Dilengkapi dengan fraud detection dan security monitoring.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Java Spring', 'Kafka', 'Redis'],
        client: 'Bank Digital Indonesia',
        year: 2024
    },
    {
        id: 12,
        title: 'Sistem Perizinan Online',
        description: 'Platform perizinan online terpadu untuk berbagai jenis izin usaha dan non-usaha. Dilengkapi dengan tracking status, notifikasi, payment gateway, dan integrasi dengan instansi terkait.',
        category: 'pemerintah',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['React', 'FastAPI', 'PostgreSQL'],
        client: 'Badan Koordinasi Penanaman Modal',
        year: 2024
    },
    {
        id: 13,
        title: 'Mobile Banking App',
        description: 'Aplikasi mobile banking dengan fitur transfer, pembayaran, investasi, dan wealth management. Dilengkapi dengan biometric authentication dan real-time notifications.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['React Native', 'Node.js', 'PostgreSQL'],
        client: 'Bank Mandiri',
        year: 2024
    },
    {
        id: 14,
        title: 'Student Information System',
        description: 'Sistem informasi mahasiswa terintegrasi dengan fitur registrasi online, tracking akademik, scholarship management, dan career services. Portal untuk mahasiswa, dosen, dan orang tua.',
        category: 'akademik',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Laravel', 'Vue.js', 'MySQL'],
        client: 'Universitas Gadjah Mada',
        year: 2023
    },
    {
        id: 15,
        title: 'Healthcare Management System',
        description: 'Sistem manajemen rumah sakit komprehensif dengan fitur EMR, appointment scheduling, billing, pharmacy management, dan analytics dashboard untuk management.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Angular', 'Spring Boot', 'Oracle'],
        client: 'RS. Siloam Hospitals',
        year: 2024
    },
    {
        id: 16,
        title: 'E-Government Portal',
        description: 'Portal pemerintahan elektronik terpadu untuk layanan publik, informasi kebijakan, participatory budgeting, dan citizen engagement. Terintegrasi dengan berbagai instansi.',
        category: 'pemerintah',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['React', 'Django', 'PostgreSQL'],
        client: 'Pemerintah Provinsi Jawa Barat',
        year: 2024
    },
    {
        id: 17,
        title: 'Food Delivery Platform',
        description: 'Platform delivery makanan dengan fitur real-time tracking, multiple payment options, loyalty program, dan analytics dashboard. Dilengkapi dengan driver app dan merchant portal.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io'],
        client: 'GoFood Indonesia',
        year: 2024
    },
    {
        id: 18,
        title: 'Real Estate Management System',
        description: 'Sistem manajemen properti dengan fitur listing management, virtual tour, CRM terintegrasi, financial tracking, dan automated marketing. Platform untuk agent dan customer.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Vue.js', 'Laravel', 'MySQL', 'AWS S3'],
        client: 'Century 21 Indonesia',
        year: 2023
    },
    {
        id: 19,
        title: 'Logistics Management System',
        description: 'Sistem manajemen logistik end-to-end dengan fitur shipment tracking, warehouse management, route optimization, dan fleet management. Dashboard analytics untuk operational insights.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Angular', 'Spring Boot', 'PostgreSQL', 'Redis'],
        client: 'JNE Express',
        year: 2024
    },
    {
        id: 20,
        title: 'Digital Marketing Platform',
        description: 'Platform marketing digital all-in-one dengan fitur social media management, email marketing, analytics, lead generation, dan automation tools. Terintegrasi dengan major platforms.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
        client: 'HubSpot Indonesia',
        year: 2023
    },
    {
        id: 21,
        title: 'Online Learning Marketplace',
        description: 'Marketplace kursus online dengan fitur video streaming, interactive assignments, live sessions, certification system, dan payment gateway. Platform untuk instructor dan student.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Next.js', 'Express.js', 'PostgreSQL', 'AWS'],
        client: 'Skillshare Indonesia',
        year: 2024
    },
    {
        id: 22,
        title: 'Event Management Platform',
        description: 'Platform manajemen event dengan fitur ticketing, venue booking, attendee management, live streaming integration, dan analytics. Mendukung virtual dan hybrid events.',
        category: 'swasta',
        image: ProjectExampleImg,
        link: '#',
        technologies: ['Vue.js', 'Django', 'PostgreSQL', 'WebRTC'],
        client: 'Eventbrite Indonesia',
        year: 2024
    }
];

// Helper functions untuk filtering dan searching
export const getProjectsByCategory = (category) => {
    return projects.filter(project => project.category === category);
};

export const getProjectById = (id) => {
    return projects.find(project => project.id === id);
};

export const getProjectsByYear = (year) => {
    return projects.filter(project => project.year === year);
};

export const searchProjects = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    return projects.filter(project => 
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.client.toLowerCase().includes(term) ||
        project.technologies.some(tech => tech.toLowerCase().includes(term))
    );
};

// Export categories untuk dropdown/filter
export const categories = [
    { value: 'akademik', label: 'Akademik' },
    { value: 'pemerintah', label: 'Pemerintah' },
    { value: 'swasta', label: 'Swasta' }
];

// Export technologies untuk filter/tags
export const allTechnologies = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'React Native',
    'Node.js', 'Express.js', 'Laravel', 'Django', 'Spring Boot', '.NET Core', 'FastAPI',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'Redis', 'InfluxDB',
    'Kafka', 'Strapi'
];
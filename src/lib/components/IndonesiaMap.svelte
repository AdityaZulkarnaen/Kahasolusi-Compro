<script>
    import { onMount, onDestroy } from 'svelte';
    import 'leaflet/dist/leaflet.css';
    
    export let portfolioStats = [];
    
    let mapContainer;
    let map;
    let loading = true;
    let error = false;
    let markers = [];
    
    onMount(async () => {
        try {
            // Import Leaflet hanya di client-side
            const L = await import('leaflet');
            
            // Inisialisasi peta
            map = L.map(mapContainer, {
                center: [-2.5, 118.0], // Center of Indonesia
                zoom: 5,
                minZoom: 4,
                maxZoom: 8,
                zoomControl: true,
                scrollWheelZoom: false,
                dragging: true,
                touchZoom: true,
                doubleClickZoom: false,
                attributionControl: false
            });
            
            // Fetch GeoJSON data Indonesia dari GitHub
            const response = await fetch('https://raw.githubusercontent.com/ans-4175/peta-indonesia-geojson/master/indonesia-prov.geojson');
            
            if (!response.ok) {
                throw new Error('Failed to load GeoJSON data');
            }
            
            const geojsonData = await response.json();
            
            // Style untuk setiap provinsi
            const defaultStyle = {
                fillColor: '#176684',
                weight: 1.5,
                opacity: 1,
                color: '#0D4E6D',
                fillOpacity: 0.62
            };
            
            const hoverStyle = {
                fillColor: '#9ACFDD',
                fillOpacity: 0.7,
                weight: 2.5,
                color: '#0D4E6D'
            };
            
            const selectedStyle = {
                fillColor: '#9ACFDD', 
                fillOpacity: 0.8,
                weight: 3,
                color: '#0D4E6D'
            };
            
            // Track selected province
            let selectedLayer = null;
            
            // Tambahkan GeoJSON layer dengan interaksi
            const geojsonLayer = L.geoJSON(geojsonData, {
                style: defaultStyle,
                onEachFeature: (feature, layer) => {
                    // Hover effect
                    layer.on({
                        mouseover: (e) => {
                            const targetLayer = e.target;
                            // Don't change style if this is the selected layer
                            if (selectedLayer !== targetLayer) {
                                targetLayer.setStyle(hoverStyle);
                                targetLayer.bringToFront();
                            }
                        },
                        mouseout: (e) => {
                            const targetLayer = e.target;
                            // Don't reset style if this is the selected layer
                            if (selectedLayer !== targetLayer) {
                                geojsonLayer.resetStyle(targetLayer);
                            }
                        },
                        click: (e) => {
                            const targetLayer = e.target;
                            
                            // If clicking the same province, deselect it
                            if (selectedLayer === targetLayer) {
                                geojsonLayer.resetStyle(targetLayer);
                                selectedLayer = null;
                            } else {
                                // Reset previous selected province
                                if (selectedLayer) {
                                    geojsonLayer.resetStyle(selectedLayer);
                                }
                                
                                // Highlight the new selected province
                                targetLayer.setStyle(selectedStyle);
                                targetLayer.bringToFront();
                                selectedLayer = targetLayer;
                            }
                        }
                    });
                    
                    // Tooltip dengan nama provinsi
                    if (feature.properties && feature.properties.Propinsi) {
                        layer.bindTooltip(feature.properties.Propinsi, {
                            permanent: false,
                            direction: 'center',
                            className: 'province-tooltip',
                            offset: [0, 0]
                        });
                    }
                }
            }).addTo(map);
            
            // Fit bounds ke Indonesia dengan padding
            map.fitBounds(geojsonLayer.getBounds(), {
                padding: [20, 20]
            });
            
            // Add markers for portfolios
            if (portfolioStats && portfolioStats.length > 0) {

                
                // Create custom icon (smaller size)
                const customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div class="marker-pin"></div>`,
                    iconSize: [20, 28],
                    iconAnchor: [10, 28],
                    popupAnchor: [0, -28]
                });
                
                portfolioStats.forEach(stat => {
                    // Find province in GeoJSON (exact match)
                    const provinceFeature = geojsonData.features.find(f => 
                        f.properties.Propinsi === stat.province
                    );
                    
                    if (!provinceFeature) {
                        console.warn(`⚠️ Province not found in GeoJSON: "${stat.province}"`);
                        console.warn(`Available provinces:`, geojsonData.features.map(f => f.properties.Propinsi));
                        return;
                    }
                    
                    if (provinceFeature && provinceFeature.geometry) {
                        // Get center of province (simplified centroid)
                        let lat, lng;
                        
                        if (provinceFeature.geometry.type === 'Polygon') {
                            const coords = provinceFeature.geometry.coordinates[0];
                            lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
                            lng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
                        } else if (provinceFeature.geometry.type === 'MultiPolygon') {
                            const coords = provinceFeature.geometry.coordinates[0][0];
                            lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
                            lng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
                        }
                        
                        if (lat && lng) {
                            console.log(`✅ Adding marker for ${stat.province} at [${lat}, ${lng}]`);
                            const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
                            
                            // Create popup content
                            const popupContent = `
                                <div class="marker-popup">
                                    <h3 class="marker-popup-title">${stat.province}</h3>
                                    <p class="marker-popup-count">
                                        <strong>${stat.total_projects}</strong> Proyek
                                    </p>
                                </div>
                            `;
                            
                            marker.bindPopup(popupContent, {
                                className: 'custom-popup',
                                closeButton: true,
                                offset: [0, -10]
                            });
                            
                            markers.push(marker);
                        }
                    }
                });
            } else {
                console.log('ℹ️ No portfolio stats available');
            }
            
            loading = false;
            
        } catch (err) {
            console.error('Error loading map:', err);
            error = true;
            loading = false;
        }
    });
    
    onDestroy(() => {
        if (map) {
            map.remove();
            map = null;
        }
    });
</script>

<div class="map-wrapper">
    {#if loading}
        <div class="loading-overlay">
            <div class="loading-spinner"></div>
            <p class="loading-text">Memuat peta Indonesia...</p>
        </div>
    {/if}
    
    {#if error}
        <div class="error-overlay">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="error-text">Gagal memuat peta. Silakan refresh halaman.</p>
        </div>
    {/if}
    
    <div bind:this={mapContainer} class="map-container" class:hidden={error}></div>
</div>

<style>
    .map-wrapper {
        position: relative;
        width: 100%;
        height: 500px;
        z-index: 1;
    }
    
    .map-container {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        overflow: hidden;
        background: #ffffff;
        position: relative;
        z-index: 1;
    }
    
    .map-container.hidden {
        display: none;
    }
    
    .loading-overlay,
    .error-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        z-index: 1000;
    }
    
    .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(23, 102, 132, 0.1);
        border-top-color: #176684;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .loading-text {
        margin-top: 16px;
        color: #176684;
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;
    }
    
    .error-overlay {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    }
    
    .error-icon {
        width: 48px;
        height: 48px;
        color: #dc2626;
    }
    
    .error-text {
        margin-top: 16px;
        color: #991b1b;
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;
    }
    
    :global(.province-tooltip) {
        background-color: rgba(13, 78, 109, 0.95) !important;
        border: none !important;
        border-radius: 6px;
        color: white;
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        padding: 6px 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    :global(.province-tooltip::before) {
        display: none !important;
    }
    
    :global(.leaflet-container) {
        background: #f8fafc;
        font-family: inherit;
        z-index: 1 !important;
        position: relative !important;
    }
    
    /* Force all Leaflet elements to stay below navbar (z-50) */
    :global(.map-wrapper *) {
        z-index: auto !important;
    }
    
    :global(.leaflet-pane),
    :global(.leaflet-map-pane),
    :global(.leaflet-tile-pane),
    :global(.leaflet-overlay-pane),
    :global(.leaflet-shadow-pane),
    :global(.leaflet-marker-pane),
    :global(.leaflet-tooltip-pane),
    :global(.leaflet-popup-pane) {
        z-index: auto !important;
    }
    
    :global(.leaflet-control-container),
    :global(.leaflet-top),
    :global(.leaflet-bottom),
    :global(.leaflet-left),
    :global(.leaflet-right) {
        z-index: 2 !important;
    }
    
    :global(.leaflet-control-zoom) {
        z-index: 2 !important;
        border: none !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }
    
    :global(.leaflet-control-zoom a) {
        background-color: white !important;
        color: #176684 !important;
        border: none !important;
        border-bottom: 1px solid #e2e8f0 !important;
        font-size: 18px !important;
        font-weight: 600;
        transition: all 0.2s ease;
    }
    
    :global(.leaflet-control-zoom a:hover) {
        background-color: #176684 !important;
        color: white !important;
    }
    
    :global(.leaflet-control-zoom a:last-child) {
        border-bottom: none !important;
    }
    
    /* Make provinces clickable with pointer cursor */
    :global(.leaflet-interactive) {
        cursor: pointer !important;
    }
    
    :global(.leaflet-interactive:hover) {
        cursor: pointer !important;
    }
    
    /* Custom marker styles */
    :global(.custom-marker) {
        background: none !important;
        border: none !important;
    }
    
    :global(.marker-pin) {
        width: 20px;
        height: 20px;
        border-radius: 50% 50% 50% 0;
        background: #F97316;
        position: absolute;
        transform: rotate(-45deg);
        left: 50%;
        top: 50%;
        margin: -10px 0 0 -10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        animation: bounce 0.5s ease-out;
    }
    
    :global(.marker-pin::after) {
        content: '';
        width: 10px;
        height: 10px;
        margin: 5px 0 0 -5px;
        background: #fff;
        position: absolute;
        border-radius: 50%;
    }
    
    @keyframes bounce {
        0% {
            opacity: 0;
            transform: translateY(-2000px) rotate(-45deg);
        }
        60% {
            opacity: 1;
            transform: translateY(30px) rotate(-45deg);
        }
        80% {
            transform: translateY(-10px) rotate(-45deg);
        }
        100% {
            transform: translateY(0) rotate(-45deg);
        }
    }
    
    :global(.custom-popup .leaflet-popup-content-wrapper) {
        background: white;
        border-radius: 8px;
        box-shadow: 0 3px 14px rgba(0, 0, 0, 0.2);
        padding: 0;
    }
    
    :global(.custom-popup .leaflet-popup-content) {
        margin: 0;
        min-width: 180px;
    }
    
    :global(.custom-popup .leaflet-popup-tip) {
        background: white;
    }
    
    :global(.marker-popup) {
        padding: 12px 16px;
    }
    
    :global(.marker-popup-title) {
        font-size: 16px;
        font-weight: 600;
        color: #0D4E6D;
        margin: 0 0 8px 0;
        font-family: inherit;
    }
    
    :global(.marker-popup-count) {
        font-size: 14px;
        color: #374151;
        margin: 0;
        font-family: inherit;
    }
    
    :global(.marker-popup-count strong) {
        color: #F97316;
        font-size: 18px;
    }
    
    @media (max-width: 768px) {
        .map-wrapper {
            height: 400px;
        }
    }
    
    @media (max-width: 640px) {
        .map-wrapper {
            height: 350px;
        }
    }
</style>

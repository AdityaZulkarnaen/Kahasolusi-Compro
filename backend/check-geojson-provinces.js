// Fetch GeoJSON and print province names
const response = await fetch('https://raw.githubusercontent.com/ans-4175/peta-indonesia-geojson/master/indonesia-prov.geojson');
const geojsonData = await response.json();

console.log('🗺️  Province names in GeoJSON:\n');
geojsonData.features.forEach((f, idx) => {
    console.log(`${idx + 1}. ${f.properties.Propinsi}`);
});

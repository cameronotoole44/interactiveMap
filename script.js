const mainMap = {
    coordinates: [],
    businesses: [],
    map: null,
    markers: [],

    initMap() {
        this.buildMap();
        this.addMarkers();
    },
    buildMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 10,
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 18,
        }).addTo(this.map);
    },
    addMarkers() {
        for (let i = 0; i < this.businesses.length; i++) {
            const { lat, lon, name } = this.businesses[i];
            const marker = L.marker([lat, lon]).bindPopup(`<p1>${name}</p1>`).addTo(this.map);
            this.markers.push(marker);
        }
    },
};
async function getCoordinates() {
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [position.coords.latitude, position.coords.longitude]
};
async function getFoursquare(business) {
    try {
        const accessToken = 'fsq3BevgdtBtsndDQQhjKnmFQ19eYaU6W7Im+m8nHI/4vBs=';
        const { coordinates } = mainMap;
        const [lat, lon] = coordinates;
        const limit = 5;

        const url = `https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat},${lon}&oauth_token=${accessToken}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('failed to fetch data');
        }
        const data = await response.json();
        return processBusinesses(data.results);
    } catch (error) {
        console.error('error fetching data:', error);
        return [];
    }
};
function processBusinesses(results) {
    return results.map(element => ({
        name: element.name,
        lat: element.main.lat,
        long: element.main.lng
    }));
};
window.onload = async () => {
    const coordinates = await getCoordinates()
    mainMap.coordinates = coordinates
    mainMap.buildMap()
};
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()

    try {
        let business = document.getElementById('business').value;
        let data = await getFoursquare(business);
        data && data.length > 0
            ? (mainMap.businesses = processBusinesses(data), mainMap.addMarkers()) // checks if data is truthy and if it contains items if true the markers are added
            : console.error('no data received or empty response');
    } catch (error) {
        console.error('error fetching data:', error); // if falsy returns error message
    }
});
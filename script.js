// create map 
const mainMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: {},
    // now build map out 
    buildMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 10,
        });
        //tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: '18',
        }).addTo(this.map)
        // creates/ adds marker to map
        const marker = L.marker(this.coordinates)
        marker.addTo(this.map).bindPopup('<p1><b>you are here</b></p1>').openPopup();
    },

    addMarkers() {
        this.markers = []; // initializes empty array first to store markers

        for (let i = 0; i < this.businesses.length; i++) {
            const marker = L.marker([
                this.businesses[i].lat,
                this.businesses[i].lon,
            ])
            bindPopup(`<p1>${this.businesses[i].name}</p1>`).addTo(this.map);
            this.markers.push(marker); // adds marker to array
        }
    },
}
//get coordinates geolocation 
async function getCoordinates() {
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [position.coords.latitude, position.coords.longitude]
}


async function getFoursquare(business) {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'my_api_key'
        }
    };

    const limit = 5;
    const { coordinates } = mainMap;
    const lat = coordinates[0];
    const lon = coordinates[1];

    try {
        const response = await fetch(`https:api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat},${lon}`, options);
        const data = await response.json();
        const businesses = processBusinesses(data.results);
        return businesses;
    } catch (error) {
        console.error('error fetching data:', error);
        return []; // returns empty array if theres an error 
    }
} // come back and refactor this mess 


function processBusinesses(results) {
    return results.map(element => ({
        name: element.name,
        lat: element.geocodes.main.latitude,
        long: element.geocodes.main.longitude
    }));
}

//event listeners 
window.onload = async () => {
    const coordinates = await getCoordinates()
    // console.log(coordinates) // passed 
    mainMap.coordinates = coordinates
    mainMap.buildMap()
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.getElementById('business').value
    console.log(business)
})

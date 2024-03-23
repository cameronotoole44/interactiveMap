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
// foursquare data
// async function getFoursquare(business) {
//     const accessToken = 'my_api_key'; //add api
//     const { coordinates } = mainMap;
//     const [lat, lon] = coordinates;

//     const url = `https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat},${lon}&oauth_token=${accessToken}`; //add api

//     try {
//         const response = await fetch(url);

//         if (!response.ok) {
//             throw new Error('failed to fetch data');
//         }
//         const data = await response.json();
//         const businesses = processBusinesses(data.results);
//         return businesses;
//     } catch (error) {
//         console.error('error fetching data:', error);
//         return []; // returns empty array if theres an error
//     }
// } // try refactoring this function
async function getFoursquare(business) {
    try {
        const accessToken = 'my_api_key';
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
}

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

    // try {
    //     let business = document.getElementById('business').value;
    //     let data = await getFoursquareData(business);

    //     if (data && data.length > 0) {
    //         mainMap.businesses = processBusinesses(data);
    //         mainMap.addMarkers();
    //     } else {
    //         console.error('no data received or empty response');
    //     }
    // } catch (error) {
    //     console.error('error fetching data:', error);
    // }

    // ternary operator instead of if/else 
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

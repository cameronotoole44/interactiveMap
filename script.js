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
        //tiles for different viewpoints
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: '18',
        }).addTo(this.map)

        // creates/ adds marker to map
        const marker = L.marker(this.coordinates)
        marker.addTo(this.map).bindPopup('<p1><b>you are here</b></p1>').openPopup();

    },

}

//get coordinates geolocation 
async function getCoordinates() {
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [position.coords.latitude, position.coords.longitude]
}
window.onload = async () => {
    const coordinates = await getCoordinates()
    console.log(coordinates)
    mainMap.coordinates = coordinates
    mainMap.buildMap()
}


// get business type from user
// create/add geolocation pin
//event listeners for getting business type from user 
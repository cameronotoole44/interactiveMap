// create map as an object
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
        // create/add geolocation pin
    }
}

//get coordinates geolocation 
async function getCoordinates() {
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [position.coords.latitude, position.coords.longitude]
} // gets user coordinates


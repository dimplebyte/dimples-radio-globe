/* =========================================
   RADIO GLOBE
========================================= */

let globe;

const markerElements = [];

let loadedStations = [];


/* =========================================
   INITIALIZE GLOBE
========================================= */

function initializeGlobe(stationData = []) {

    /*
     * Store the real station data locally.
     */

    loadedStations = Array.isArray(stationData)
        ? stationData
        : [];


    /*
     * Remove old markers if the globe
     * is initialized again.
     */

    markerElements.forEach(item => {

        item.marker.remove();

    });

    markerElements.length = 0;


    /*
     * Create MapLibre globe.
     */

    globe = new maplibregl.Map({

        container: "globe",

        style:
            "https://demotiles.maplibre.org/globe.json",

        center: [20, 20],

        zoom: 1.2,

        minZoom: 0.8,

        maxZoom: 8,

        attributionControl: false

    });


    /*
     * When the map style is ready,
     * create the real station markers.
     */

    globe.on("style.load", () => {

        globe.setProjection({
            type: "globe"
        });


        createStationMarkers();


        hideLoadingScreen();


        console.log(
            `Globe displayed ${loadedStations.length} real stations.`
        );

    });


    /*
     * Navigation controls.
     */

    globe.addControl(
        new maplibregl.NavigationControl(),
        "bottom-right"
    );

}


/* =========================================
   CREATE REAL STATION MARKERS
========================================= */

function createStationMarkers() {

    if (!globe) {
        return;
    }


    /*
     * Use the real stations loaded from
     * Radio Browser API.
     */

    loadedStations.forEach(station => {

        /*
         * Make sure coordinates are valid.
         */

        if (
            !Number.isFinite(station.latitude) ||
            !Number.isFinite(station.longitude)
        ) {

            return;

        }


        /*
         * Create marker button.
         */

        const element =
            document.createElement("button");


        element.className =
            "station-marker";


        element.type =
            "button";


        element.title =
            `${station.name} — ${station.city}, ${station.country}`;


        /*
         * Accessibility.
         */

        element.setAttribute(
            "aria-label",
            `Play ${station.name}`
        );


        /*
         * Clicking a marker:
         *
         * 1. Focus globe
         * 2. Select station
         */

        element.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                focusStation(station);


                selectStation(station);

            }
        );


        /*
         * Create MapLibre marker.
         */

        const marker =
            new maplibregl.Marker({
                element: element
            })
            .setLngLat([
                station.longitude,
                station.latitude
            ])
            .addTo(globe);


        /*
         * Keep reference to marker.
         */

        markerElements.push({
            station: station,
            marker: marker,
            element: element
        });

    });

}


/* =========================================
   FOCUS STATION
========================================= */

function focusStation(station) {

    if (!globe || !station) {
        return;
    }


    if (
        !Number.isFinite(station.latitude) ||
        !Number.isFinite(station.longitude)
    ) {

        return;

    }


    globe.flyTo({

        center: [
            station.longitude,
            station.latitude
        ],

        zoom: 4,

        speed: 0.8,

        curve: 1.2,

        essential: true

    });

}


/* =========================================
   FIND STATION
========================================= */

function findStation(query) {

    const search =
        String(query || "")
            .trim()
            .toLowerCase();


    if (!search) {
        return null;
    }


    return loadedStations.find(station => {

        return (

            String(station.name || "")
                .toLowerCase()
                .includes(search)

            ||

            String(station.city || "")
                .toLowerCase()
                .includes(search)

            ||

            String(station.country || "")
                .toLowerCase()
                .includes(search)

        );

    });

}


/* =========================================
   GET LOADED STATIONS
========================================= */

function getLoadedStations() {

    return loadedStations;

}


/* =========================================
   LOADING SCREEN
========================================= */

function hideLoadingScreen() {

    const loading =
        document.getElementById(
            "loadingScreen"
        );


    if (!loading) {
        return;
    }


    setTimeout(() => {

        loading.classList.add("hide");

    }, 500);

                }

let globe;

const markerElements = [];

function initializeGlobe() {

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


    globe.on("style.load", () => {

        globe.setProjection({
            type: "globe"
        });

        createStationMarkers();

        hideLoadingScreen();

    });


    globe.addControl(
        new maplibregl.NavigationControl(),
        "bottom-right"
    );
}


/* =========================================
   CREATE STATION MARKERS
========================================= */

function createStationMarkers() {

    stations.forEach(station => {

        const element =
            document.createElement("button");

        element.className =
            "station-marker";

        element.type = "button";

        element.title =
            `${station.name} — ${station.city}`;


        element.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                focusStation(station);

                selectStation(station);

            }
        );


        const marker =
            new maplibregl.Marker({
                element: element
            })
            .setLngLat([
                station.longitude,
                station.latitude
            ])
            .addTo(globe);


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
        query
            .trim()
            .toLowerCase();


    if (!search) {
        return null;
    }


    return stations.find(station => {

        return (

            station.name
                .toLowerCase()
                .includes(search)

            ||

            station.city
                .toLowerCase()
                .includes(search)

            ||

            station.country
                .toLowerCase()
                .includes(search)

        );

    });
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

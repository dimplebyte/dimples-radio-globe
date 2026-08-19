// ==========================================
// RADIO GLOBE - GLOBE & STATION MARKERS
// ==========================================

let globe = null;

const markerElements = [];


// ==========================================
// INITIALIZE GLOBE
// ==========================================

function initializeGlobe() {

    console.log("Initializing globe...");


    globe = new maplibregl.Map({

        container: "globe",

        style:
            "https://demotiles.maplibre.org/globe.json",

        center: [
            20,
            20
        ],

        zoom: 1.2,

        minZoom: 0.8,

        maxZoom: 8,

        attributionControl: false

    });


    // ======================================
    // MAP STYLE LOADED
    // ======================================

    globe.on(
        "style.load",
        () => {

            console.log(
                "Globe style loaded."
            );


            globe.setProjection({

                type: "globe"

            });


            /*
             * Stations may not have loaded yet.
             *
             * If stations are already available,
             * create markers immediately.
             */

            if (
                Array.isArray(stations) &&
                stations.length > 0
            ) {

                createStationMarkers();

            }


            hideLoadingScreen();

        }
    );


    // ======================================
    // NAVIGATION CONTROL
    // ======================================

    globe.addControl(

        new maplibregl.NavigationControl(),

        "bottom-right"

    );

}


// ==========================================
// CREATE STATION MARKERS
// ==========================================

function createStationMarkers() {

    if (!globe) {

        console.log(
            "Globe is not ready."
        );

        return;

    }


    if (
        !Array.isArray(stations) ||
        stations.length === 0
    ) {

        console.log(
            "No stations available yet."
        );

        return;

    }


    /*
     * Remove old markers first.
     *
     * This prevents duplicate green dots
     * when stations load again.
     */

    markerElements.forEach(
        item => {

            if (item.marker) {

                item.marker.remove();

            }

        }
    );


    markerElements.length = 0;


    console.log(
        `Creating ${stations.length} station markers...`
    );


    // ======================================
    // CREATE NEW MARKERS
    // ======================================

    stations.forEach(
        station => {

            if (!station) {

                return;

            }


            const latitude =
                Number(
                    station.latitude
                );


            const longitude =
                Number(
                    station.longitude
                );


            /*
             * Ignore stations without
             * valid coordinates.
             */

            if (

                !Number.isFinite(
                    latitude
                )

                ||

                !Number.isFinite(
                    longitude
                )

            ) {

                return;

            }


            // =================================
            // MARKER BUTTON
            // =================================

            const element =
                document.createElement(
                    "button"
                );


            element.type =
                "button";


            element.className =
                "station-marker";


            element.title =
                `${station.name} — ${station.city}`;


            /*
             * Accessibility
             */

            element.setAttribute(
                "aria-label",
                `Play ${station.name}`
            );


            // =================================
            // MARKER CLICK
            // =================================

            element.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    console.log(
                        "Station selected:",
                        station.name
                    );


                    focusStation(
                        station
                    );


                    selectStation(
                        station
                    );


                    /*
                     * Start playback.
                     */

                    if (
                        typeof playStation ===
                        "function"
                    ) {

                        playStation(
                            station
                        );

                    }

                }
            );


            // =================================
            // CREATE MAP MARKER
            // =================================

            const marker =
                new maplibregl.Marker({

                    element:
                        element

                })

                .setLngLat([

                    longitude,

                    latitude

                ])

                .addTo(globe);


            // =================================
            // SAVE MARKER
            // =================================

            markerElements.push({

                station:
                    station,

                marker:
                    marker,

                element:
                    element

            });

        }
    );


    console.log(
        `Created ${markerElements.length} station markers.`
    );

}


// ==========================================
// STATIONS LOADED EVENT
// ==========================================
//
// IMPORTANT:
//
// stations.js loads data asynchronously.
// This event makes sure the globe gets
// the markers AFTER the API finishes.
//

document.addEventListener(
    "stationsLoaded",
    event => {

        console.log(
            "stationsLoaded event received."
        );


        /*
         * Small delay makes sure the map
         * and DOM are ready.
         */

        setTimeout(
            () => {

                if (!globe) {

                    console.log(
                        "Globe not ready yet."
                    );

                    return;

                }


                createStationMarkers();


                /*
                 * If stations were loaded,
                 * hide the loading screen.
                 */

                hideLoadingScreen();

            },
            100
        );

    }
);


// ==========================================
// STATIONS LOAD ERROR
// ==========================================

document.addEventListener(
    "stationsLoadError",
    event => {

        console.error(
            "Station loading failed:",
            event.detail
        );


        hideLoadingScreen();

    }
);


// ==========================================
// FOCUS STATION
// ==========================================

function focusStation(station) {

    if (
        !globe ||
        !station
    ) {

        return;

    }


    const latitude =
        Number(
            station.latitude
        );


    const longitude =
        Number(
            station.longitude
        );


    if (

        !Number.isFinite(
            latitude
        )

        ||

        !Number.isFinite(
            longitude
        )

    ) {

        return;

    }


    globe.flyTo({

        center: [

            longitude,

            latitude

        ],

        zoom: 4,

        speed: 0.8,

        curve: 1.2,

        essential: true

    });

}


// ==========================================
// FIND STATION
// ==========================================

function findStation(query) {

    if (
        !Array.isArray(stations)
    ) {

        return null;

    }


    const search =
        String(
            query || ""
        )
            .trim()
            .toLowerCase();


    if (!search) {

        return null;

    }


    return stations.find(
        station => {

            const name =
                String(
                    station.name || ""
                )
                .toLowerCase();


            const city =
                String(
                    station.city || ""
                )
                .toLowerCase();


            const state =
                String(
                    station.state || ""
                )
                .toLowerCase();


            const country =
                String(
                    station.country || ""
                )
                .toLowerCase();


            const tags =
                String(
                    station.tags || ""
                )
                .toLowerCase();


            return (

                name.includes(search)

                ||

                city.includes(search)

                ||

                state.includes(search)

                ||

                country.includes(search)

                ||

                tags.includes(search)

            );

        }
    );

}


// ==========================================
// FOCUS SEARCH RESULT
// ==========================================

function focusSearchResult(query) {

    const station =
        findStation(
            query
        );


    if (!station) {

        return null;

    }


    focusStation(
        station
    );


    selectStation(
        station
    );


    return station;

}


// ==========================================
// LOADING SCREEN
// ==========================================

function hideLoadingScreen() {

    const loading =
        document.getElementById(
            "loadingScreen"
        );


    if (!loading) {

        return;

    }


    setTimeout(
        () => {

            loading.classList.add(
                "hide"
            );

        },
        500
    );

       }

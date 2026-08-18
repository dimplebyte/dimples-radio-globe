/* =========================================
   RADIO GLOBE APPLICATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Radio Globe starting...");

    /*
     * Set initial volume.
     */
    audio.volume = 0.8;


    /*
     * Setup interface.
     */
    setupUI();


    /*
     * Wait for real radio stations.
     *
     * stations.js loads station data
     * from Radio Browser API.
     */

    const startGlobe = (loadedStations) => {

        console.log(
            `Starting globe with ${loadedStations.length} stations.`
        );

        initializeGlobe(loadedStations);

    };


    /*
     * Sometimes stations may already be loaded
     * before this code runs.
     */

    const existingStations = getStations();

    if (existingStations.length > 0) {

        startGlobe(existingStations);

    } else {

        /*
         * Otherwise wait for the API.
         */

        document.addEventListener(
            "stationsLoaded",
            (event) => {

                startGlobe(event.detail);

            },
            { once: true }
        );

    }


    /*
     * Handle station loading errors.
     */

    document.addEventListener(
        "stationsLoadError",
        (event) => {

            console.error(
                "Station loading failed:",
                event.detail
            );

            hideLoadingScreen();

        },
        { once: true }
    );


    console.log("Radio Globe ready.");

});

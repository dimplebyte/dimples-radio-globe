/* =========================================
   RADIO GLOBE APPLICATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Radio Globe starting..."
        );


        /*
         * Set initial volume.
         */

        audio.volume = 0.8;


        /*
         * Setup interface.
         */

        setupUI();


        /*
         * Create globe.
         */

        initializeGlobe();


        console.log(
            "Radio Globe ready."
        );

    }
);

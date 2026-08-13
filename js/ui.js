/* =========================================
   SELECT STATION
========================================= */

function selectStation(station) {

    if (!station) {
        return;
    }


    currentStation =
        station;


    currentStationIndex =
        stations.findIndex(
            item => item.id === station.id
        );


    document.getElementById(
        "stationPanel"
    ).classList.remove("hidden");


    document.getElementById(
        "stationCountry"
    ).textContent =
        station.country;


    document.getElementById(
        "stationName"
    ).textContent =
        station.name;


    document.getElementById(
        "stationCity"
    ).textContent =
        station.city;


    document.getElementById(
        "currentStation"
    ).textContent =
        `${station.name} — ${station.city}`;

}


/* =========================================
   CLOSE PANEL
========================================= */

function closeStationPanel() {

    document.getElementById(
        "stationPanel"
    ).classList.add("hidden");

}


/* =========================================
   SEARCH
========================================= */

function performSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const query =
        input.value;


    const station =
        findStation(query);


    if (!station) {

        document.getElementById(
            "playerStatus"
        ).textContent =
            "No station found";

        return;

    }


    focusStation(station);

    selectStation(station);

}


/* =========================================
   KEYBOARD SEARCH
========================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const button =
        document.getElementById(
            "searchButton"
        );


    button.addEventListener(
        "click",
        performSearch
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                performSearch();

            }

        }
    );

}


/* =========================================
   UI BUTTONS
========================================= */

function setupUI() {

    document
        .getElementById(
            "closePanel"
        )
        .addEventListener(
            "click",
            closeStationPanel
        );


    document
        .getElementById(
            "mainPlayButton"
        )
        .addEventListener(
            "click",
            togglePlayback
        );


    document
        .getElementById(
            "panelPlayButton"
        )
        .addEventListener(
            "click",
            () => {

                if (currentStation) {

                    playStation(
                        currentStation
                    );

                }

            }
        );


    document
        .getElementById(
            "nextButton"
        )
        .addEventListener(
            "click",
            nextStation
        );


    document
        .getElementById(
            "previousButton"
        )
        .addEventListener(
            "click",
            previousStation
        );


    document
        .getElementById(
            "volume"
        )
        .addEventListener(
            "input",
            event => {

                setVolume(
                    event.target.value
                );

            }
        );


    setupSearch();

      }

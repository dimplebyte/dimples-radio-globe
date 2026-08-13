const audio =
    document.getElementById(
        "radioAudio"
    );


let currentStation = null;

let currentStationIndex = -1;


/* =========================================
   PLAY STATION
========================================= */

function playStation(station) {

    if (!station) {
        return;
    }


    currentStation = station;


    currentStationIndex =
        stations.findIndex(
            item => item.id === station.id
        );


    document.getElementById(
        "currentStation"
    ).textContent =
        `${station.name} — ${station.city}`;


    document.getElementById(
        "playerStatus"
    ).textContent =
        "Connecting...";


    /*
     * Empty stream means that the station
     * is only being demonstrated.
     */

    if (!station.stream) {

        document.getElementById(
            "playerStatus"
        ).textContent =
            "Demo station — no stream added";

        updatePlayButton(false);

        return;
    }


    audio.src =
        station.stream;


    audio.load();


    audio.play()
        .then(() => {

            document.getElementById(
                "playerStatus"
            ).textContent =
                "Playing";

            updatePlayButton(true);

        })
        .catch(error => {

            console.error(
                "Radio playback error:",
                error
            );


            document.getElementById(
                "playerStatus"
            ).textContent =
                "Unable to play stream";

            updatePlayButton(false);

        });

}


/* =========================================
   PAUSE
========================================= */

function pauseStation() {

    audio.pause();

    document.getElementById(
        "playerStatus"
    ).textContent =
        "Paused";

    updatePlayButton(false);
}


/* =========================================
   TOGGLE
========================================= */

function togglePlayback() {

    if (!currentStation) {

        return;

    }


    if (!currentStation.stream) {

        document.getElementById(
            "playerStatus"
        ).textContent =
            "Add a radio stream first";

        return;

    }


    if (audio.paused) {

        audio.play();

    } else {

        pauseStation();

    }

}


/* =========================================
   NEXT
========================================= */

function nextStation() {

    if (stations.length === 0) {
        return;
    }


    currentStationIndex++;

    if (
        currentStationIndex >=
        stations.length
    ) {

        currentStationIndex = 0;

    }


    const station =
        stations[currentStationIndex];


    selectStation(station);

    focusStation(station);

    playStation(station);

}


/* =========================================
   PREVIOUS
========================================= */

function previousStation() {

    if (stations.length === 0) {
        return;
    }


    currentStationIndex--;

    if (currentStationIndex < 0) {

        currentStationIndex =
            stations.length - 1;

    }


    const station =
        stations[currentStationIndex];


    selectStation(station);

    focusStation(station);

    playStation(station);

}


/* =========================================
   VOLUME
========================================= */

function setVolume(value) {

    audio.volume =
        Number(value);

}


/* =========================================
   BUTTON UI
========================================= */

function updatePlayButton(isPlaying) {

    const button =
        document.getElementById(
            "mainPlayButton"
        );


    if (!button) {
        return;
    }


    button.textContent =
        isPlaying ? "❚❚" : "▶";

}


/* =========================================
   AUDIO EVENTS
========================================= */

audio.addEventListener(
    "play",
    () => {

        updatePlayButton(true);

    }
);


audio.addEventListener(
    "pause",
    () => {

        updatePlayButton(false);

    }
);


audio.addEventListener(
    "error",
    () => {

        document.getElementById(
            "playerStatus"
        ).textContent =
            "Stream unavailable";

        updatePlayButton(false);

    }
);

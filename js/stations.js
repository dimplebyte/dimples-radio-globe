// ==========================================
// RADIO GLOBE - REAL RADIO STATIONS
// Data source: Radio Browser API
// ==========================================

const RADIO_BROWSER_SERVERS = [
    "https://de1.api.radio-browser.info",
    "https://at1.api.radio-browser.info",
    "https://nl1.api.radio-browser.info"
];

let stations = [];
let stationsLoading = false;

// ------------------------------------------
// Get one available Radio Browser server
// ------------------------------------------

async function getRadioBrowserServer() {
    for (const server of RADIO_BROWSER_SERVERS) {
        try {
            const response = await fetch(
                `${server}/json/config`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (response.ok) {
                return server;
            }
        } catch (error) {
            console.log(`Server unavailable: ${server}`);
        }
    }

    throw new Error("No Radio Browser server is available.");
}

// ------------------------------------------
// Load real stations
// ------------------------------------------

async function loadStations() {

    if (stationsLoading) {
        return stations;
    }

    stationsLoading = true;

    try {

        const server = await getRadioBrowserServer();

        const params = new URLSearchParams({
            hidebroken: "true",
            has_geo_info: "true",
            order: "clickcount",
            reverse: "true",
            limit: "500"
        });

        const response = await fetch(
            `${server}/json/stations/search?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Station request failed: ${response.status}`
            );
        }

        const data = await response.json();

        stations = data
            .filter(station =>
                station.geo_lat !== null &&
                station.geo_long !== null &&
                station.url_resolved
            )
            .map(station => ({
                id: station.stationuuid,

                name: station.name || "Unknown Station",

                city: station.state || station.country || "Unknown",

                country: station.country || "Unknown",

                countryCode: station.countrycode || "",

                latitude: Number(station.geo_lat),

                longitude: Number(station.geo_long),

                stream: station.url_resolved,

                homepage: station.homepage || "",

                favicon: station.favicon || "",

                codec: station.codec || "",

                bitrate: Number(station.bitrate) || 0,

                tags: station.tags || "",

                language: station.language || "",

                votes: Number(station.votes) || 0
            }));

        console.log(
            `Radio Globe loaded ${stations.length} real stations.`
        );

        // Tell the rest of the application
        // that the stations are ready.
        document.dispatchEvent(
            new CustomEvent("stationsLoaded", {
                detail: stations
            })
        );

        return stations;

    } catch (error) {

        console.error(
            "Could not load radio stations:",
            error
        );

        stations = [];

        document.dispatchEvent(
            new CustomEvent("stationsLoadError", {
                detail: error
            })
        );

        return stations;

    } finally {

        stationsLoading = false;

    }
}

// ------------------------------------------
// Get current stations
// ------------------------------------------

function getStations() {
    return stations;
}

// ------------------------------------------
// Find station by ID
// ------------------------------------------

function getStationById(id) {
    return stations.find(
        station => station.id === id
    );
}

// ------------------------------------------
// Register a station click/play
// ------------------------------------------

async function registerStationClick(stationId) {

    if (!stationId) {
        return;
    }

    try {

        const server = await getRadioBrowserServer();

        await fetch(
            `${server}/json/url/${encodeURIComponent(stationId)}`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

    } catch (error) {

        console.log(
            "Could not register station click.",
            error
        );

    }
}

// ------------------------------------------
// Start loading stations automatically
// ------------------------------------------

loadStations();

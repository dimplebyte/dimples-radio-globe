/* =========================================
   RADIO GLOBE - STATION DATA
   Radio Browser API
========================================= */

const RADIO_BROWSER_SERVERS = [
    "https://de1.api.radio-browser.info",
    "https://at1.api.radio-browser.info",
    "https://nl1.api.radio-browser.info"
];

let stations = [];
let stationsLoading = false;


/* =========================================
   GET AVAILABLE API SERVER
========================================= */

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

            console.log(
                `Radio Browser server unavailable: ${server}`
            );

        }

    }

    throw new Error(
        "No Radio Browser server is available."
    );
}


/* =========================================
   CONVERT API STATION
========================================= */

function convertStation(station) {

    return {

        id: station.stationuuid,

        name:
            station.name ||
            "Unknown Station",

        city:
            station.state ||
            station.country ||
            "Unknown",

        country:
            station.country ||
            "Unknown",

        countryCode:
            station.countrycode ||
            "",

        latitude:
            Number(station.geo_lat),

        longitude:
            Number(station.geo_long),

        stream:
            station.url_resolved ||
            station.url ||
            "",

        homepage:
            station.homepage ||
            "",

        favicon:
            station.favicon ||
            "",

        codec:
            station.codec ||
            "",

        bitrate:
            Number(station.bitrate) ||
            0,

        tags:
            station.tags ||
            "",

        language:
            station.language ||
            "",

        votes:
            Number(station.votes) ||
            0

    };

}


/* =========================================
   REMOVE INVALID STATIONS
========================================= */

function cleanStations(data) {

    return data
        .filter(station => {

            return (

                station.geo_lat !== null &&
                station.geo_long !== null &&

                station.url_resolved

            );

        })
        .map(convertStation);

}


/* =========================================
   LOAD INITIAL WORLD STATIONS
========================================= */

async function loadStations() {

    if (stationsLoading) {
        return stations;
    }

    stationsLoading = true;

    try {

        const server =
            await getRadioBrowserServer();


        const params =
            new URLSearchParams({

                hidebroken: "true",

                has_geo_info: "true",

                order: "clickcount",

                reverse: "true",

                limit: "1000"

            });


        const response =
            await fetch(
                `${server}/json/stations/search?${params}`,
                {
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Station request failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        stations =
            cleanStations(data);


        console.log(
            `Loaded ${stations.length} world stations.`
        );


        document.dispatchEvent(
            new CustomEvent(
                "stationsLoaded",
                {
                    detail: stations
                }
            )
        );


        return stations;


    } catch (error) {

        console.error(
            "Could not load radio stations:",
            error
        );


        stations = [];


        document.dispatchEvent(
            new CustomEvent(
                "stationsLoadError",
                {
                    detail: error
                }
            )
        );


        return [];


    } finally {

        stationsLoading = false;

    }

}


/* =========================================
   SEARCH REAL STATIONS
========================================= */

async function searchStations(query) {

    const search =
        String(query || "")
            .trim();


    if (!search) {

        return stations;

    }


    try {

        const server =
            await getRadioBrowserServer();


        /*
         * Search station name, state,
         * country and city-related text.
         */

        const params =
            new URLSearchParams({

                name: search,

                hidebroken: "true",

                has_geo_info: "true",

                order: "votes",

                reverse: "true",

                limit: "100"

            });


        const response =
            await fetch(
                `${server}/json/stations/search?${params}`,
                {
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Search failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        return cleanStations(data);


    } catch (error) {

        console.error(
            "Station search failed:",
            error
        );


        return [];

    }

}


/* =========================================
   SEARCH BY STATE / REGION
========================================= */

async function searchStationsByState(state) {

    const search =
        String(state || "")
            .trim();


    if (!search) {
        return [];
    }


    try {

        const server =
            await getRadioBrowserServer();


        const params =
            new URLSearchParams({

                state: search,

                hidebroken: "true",

                has_geo_info: "true",

                order: "votes",

                reverse: "true",

                limit: "100"

            });


        const response =
            await fetch(
                `${server}/json/stations/search?${params}`,
                {
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `State search failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        return cleanStations(data);


    } catch (error) {

        console.error(
            "State search failed:",
            error
        );


        return [];

    }

}


/* =========================================
   SEARCH BY COUNTRY
========================================= */

async function searchStationsByCountry(country) {

    const search =
        String(country || "")
            .trim();


    if (!search) {
        return [];
    }


    try {

        const server =
            await getRadioBrowserServer();


        const params =
            new URLSearchParams({

                country: search,

                hidebroken: "true",

                has_geo_info: "true",

                order: "votes",

                reverse: "true",

                limit: "150"

            });


        const response =
            await fetch(
                `${server}/json/stations/search?${params}`,
                {
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Country search failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        return cleanStations(data);


    } catch (error) {

        console.error(
            "Country search failed:",
            error
        );


        return [];

    }

}


/* =========================================
   GET CURRENT STATIONS
========================================= */

function getStations() {

    return stations;

}


/* =========================================
   FIND LOADED STATION
========================================= */

function getStationById(id) {

    return stations.find(
        station =>
            station.id === id
    );

}


/* =========================================
   REGISTER STATION CLICK
========================================= */

async function registerStationClick(stationId) {

    if (!stationId) {
        return;
    }


    try {

        const server =
            await getRadioBrowserServer();


        await fetch(
            `${server}/json/url/${encodeURIComponent(stationId)}`,
            {
                headers: {
                    "Accept":
                        "application/json"
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


/* =========================================
   START INITIAL LOAD
========================================= */

loadStations();

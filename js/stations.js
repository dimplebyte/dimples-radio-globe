// ==========================================
// RADIO GLOBE - REAL RADIO STATIONS
// Worldwide + Rajasthan
// Data source: Radio Browser API
// ==========================================

const RADIO_BROWSER_SERVERS = [
    "https://de1.api.radio-browser.info",
    "https://at1.api.radio-browser.info",
    "https://nl1.api.radio-browser.info"
];

let stations = [];
let stationsLoading = false;


// ==========================================
// RAJASTHAN CITIES
// ==========================================

const RAJASTHAN_CITIES = [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Ajmer",
    "Bikaner",
    "Alwar",
    "Bharatpur",
    "Kishangarh",
    "Bhilwara",
    "Sikar",
    "Sri Ganganagar",
    "Pali",
    "Beawar",
    "Chittorgarh",
    "Barmer",
    "Jaisalmer",
    "Jhalawar",
    "Tonk",
    "Bundi",
    "Nagaur",
    "Hanumangarh",
    "Dausa",
    "Jhunjhunu",
    "Churu",
    "Sawai Madhopur",
    "Suratgarh",
    "Banswara",
    "Mount Abu"
];


// ==========================================
// GET AVAILABLE RADIO BROWSER SERVER
// ==========================================

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

                console.log(
                    `Radio Browser server: ${server}`
                );

                return server;
            }

        } catch (error) {

            console.log(
                `Server unavailable: ${server}`
            );

        }
    }

    throw new Error(
        "No Radio Browser server is available."
    );
}


// ==========================================
// FORMAT STATION
// ==========================================

function formatStation(station) {

    return {

        id:
            station.stationuuid,

        name:
            station.name ||
            "Unknown Station",

        city:
            station.city ||
            station.state ||
            station.country ||
            "Unknown",

        state:
            station.state ||
            "",

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
            Number(station.bitrate) || 0,

        tags:
            station.tags ||
            "",

        language:
            station.language ||
            "",

        votes:
            Number(station.votes) || 0

    };
}


// ==========================================
// CHECK STATION
// ==========================================

function isValidStation(station) {

    return (

        station &&

        station.stationuuid &&

        station.geo_lat !== null &&

        station.geo_lat !== undefined &&

        station.geo_long !== null &&

        station.geo_long !== undefined &&

        (
            station.url_resolved ||
            station.url
        )

    );
}


// ==========================================
// CLEAN API RESULTS
// ==========================================

function cleanStations(data) {

    if (!Array.isArray(data)) {

        return [];

    }

    return data

        .filter(isValidStation)

        .map(formatStation);

}


// ==========================================
// WORLDWIDE STATIONS
// ==========================================

async function getWorldwideStations(server) {

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
            `Worldwide request failed: ${response.status}`
        );

    }


    const data =
        await response.json();


    return cleanStations(data);

}


// ==========================================
// RAJASTHAN STATE STATIONS
// ==========================================

async function getRajasthanStateStations(server) {

    const params = new URLSearchParams({

        countrycode: "IN",

        state: "Rajasthan",

        stateExact: "false",

        hidebroken: "true",

        has_geo_info: "true",

        order: "clickcount",

        reverse: "true",

        limit: "100"

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

        console.log(
            `Rajasthan state request failed: ${response.status}`
        );

        return [];

    }


    const data =
        await response.json();


    return cleanStations(data);

}


// ==========================================
// RAJASTHAN CITY STATIONS
// ==========================================

async function getRajasthanCityStations(server) {

    const results = [];


    for (const city of RAJASTHAN_CITIES) {

        try {

            const params = new URLSearchParams({

                countrycode: "IN",

                name: city,

                hidebroken: "true",

                has_geo_info: "true",

                order: "clickcount",

                reverse: "true",

                limit: "25"

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

                console.log(
                    `${city}: request failed`
                );

                continue;

            }


            const data =
                await response.json();


            const cityStations =
                cleanStations(data);


            /*
             * Keep only stations that are
             * actually related to Rajasthan.
             */

            const rajasthanStations =
                cityStations.filter(station => {

                    const cityText =
                        (
                            station.city +
                            " " +
                            station.state +
                            " " +
                            station.name +
                            " " +
                            station.tags
                        )
                            .toLowerCase();


                    return (

                        cityText.includes(
                            city.toLowerCase()
                        )

                        ||

                        (
                            station.countryCode ===
                            "IN"
                        )

                    );

                });


            results.push(
                ...rajasthanStations
            );


            console.log(
                `${city}: ${rajasthanStations.length} station(s)`
            );


        } catch (error) {

            console.log(
                `Could not search ${city}:`,
                error
            );

        }

    }


    return results;

}


// ==========================================
// REMOVE DUPLICATES
// ==========================================

function removeDuplicates(stationList) {

    const unique =
        new Map();


    stationList.forEach(station => {

        if (
            station &&
            station.id &&
            !unique.has(station.id)
        ) {

            unique.set(
                station.id,
                station
            );

        }

    });


    return Array.from(
        unique.values()
    );

}


// ==========================================
// LOAD ALL STATIONS
// ==========================================

async function loadStations() {

    if (stationsLoading) {

        return stations;

    }


    stationsLoading = true;


    try {

        const server =
            await getRadioBrowserServer();


        // ----------------------------------
        // WORLDWIDE
        // ----------------------------------

        console.log(
            "Loading worldwide stations..."
        );


        const worldwideStations =
            await getWorldwideStations(
                server
            );


        console.log(
            `Worldwide: ${worldwideStations.length}`
        );


        // ----------------------------------
        // RAJASTHAN STATE
        // ----------------------------------

        console.log(
            "Loading Rajasthan state stations..."
        );


        const rajasthanStateStations =
            await getRajasthanStateStations(
                server
            );


        console.log(
            `Rajasthan state: ${rajasthanStateStations.length}`
        );


        // ----------------------------------
        // RAJASTHAN CITIES
        // ----------------------------------

        console.log(
            "Searching Rajasthan cities..."
        );


        const rajasthanCityStations =
            await getRajasthanCityStations(
                server
            );


        console.log(
            `Rajasthan cities: ${rajasthanCityStations.length}`
        );


        // ----------------------------------
        // COMBINE
        // ----------------------------------

        const combinedStations = [

            ...worldwideStations,

            ...rajasthanStateStations,

            ...rajasthanCityStations

        ];


        // ----------------------------------
        // REMOVE DUPLICATES
        // ----------------------------------

        stations =
            removeDuplicates(
                combinedStations
            );


        console.log(
            `Radio Globe loaded ${stations.length} total stations.`
        );


        // ----------------------------------
        // SHOW RESULTS TO APPLICATION
        // ----------------------------------

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


// ==========================================
// GET CURRENT STATIONS
// ==========================================

function getStations() {

    return stations;

}


// ==========================================
// GET STATION BY ID
// ==========================================

function getStationById(id) {

    return stations.find(

        station =>
            station.id === id

    );

}


// ==========================================
// REGISTER STATION CLICK
// ==========================================

async function registerStationClick(
    stationId
) {

    if (!stationId) {

        return;

    }


    try {

        const server =
            await getRadioBrowserServer();


        await fetch(

            `${server}/json/url/${encodeURIComponent(
                stationId
            )}`,

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


// ==========================================
// START
// ==========================================

loadStations();

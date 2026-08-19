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
// GET AVAILABLE SERVER
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
                    "Radio Browser server:",
                    server
                );

                return server;

            }

        } catch (error) {

            console.log(
                "Server unavailable:",
                server
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
// VALID STATION
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

        limit: "200"

    });


    try {

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
                "Rajasthan state request failed:",
                response.status
            );

            return [];

        }


        const data =
            await response.json();


        return cleanStations(data);

    } catch (error) {

        console.log(
            "Rajasthan state search failed:",
            error
        );

        return [];

    }

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

                state: "Rajasthan",

                hidebroken: "true",

                has_geo_info: "true",

                order: "clickcount",

                reverse: "true",

                limit: "50"

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
             * Only keep stations whose
             * information actually relates
             * to the requested Rajasthan city.
             */

            const rajasthanStations =
                cityStations.filter(station => {

                    const cityText = (

                        `${station.city} ` +

                        `${station.state} ` +

                        `${station.name} ` +

                        `${station.tags} ` +

                        `${station.homepage}`

                    ).toLowerCase();


                    const searchCity =
                        city.toLowerCase();


                    return cityText.includes(
                        searchCity
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
                `${city}: search failed`,
                error
            );

        }

    }


    return results;

}


// ==========================================
// EXTRA INDIA STATIONS
// ==========================================
//
// This catches stations whose database
// city/state metadata is incomplete but
// whose station name contains Rajasthan
// city names.
//

async function getRajasthanNameStations(server) {

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

                limit: "50"

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

                continue;

            }


            const data =
                await response.json();


            const cityStations =
                cleanStations(data);


            results.push(
                ...cityStations
            );


        } catch (error) {

            console.log(
                `Extra search failed for ${city}`
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
            "Worldwide stations:",
            worldwideStations.length
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
            "Rajasthan state stations:",
            rajasthanStateStations.length
        );


        // ----------------------------------
        // RAJASTHAN CITY SEARCH
        // ----------------------------------

        console.log(
            "Searching Rajasthan cities..."
        );


        const rajasthanCityStations =
            await getRajasthanCityStations(
                server
            );


        console.log(
            "Rajasthan city stations:",
            rajasthanCityStations.length
        );


        // ----------------------------------
        // EXTRA CITY NAME SEARCH
        // ----------------------------------

        console.log(
            "Running extra Rajasthan searches..."
        );


        const rajasthanNameStations =
            await getRajasthanNameStations(
                server
            );


        console.log(
            "Extra Rajasthan stations:",
            rajasthanNameStations.length
        );


        // ----------------------------------
        // COMBINE EVERYTHING
        // ----------------------------------

        const combinedStations = [

            ...worldwideStations,

            ...rajasthanStateStations,

            ...rajasthanCityStations,

            ...rajasthanNameStations

        ];


        // ----------------------------------
        // REMOVE DUPLICATES
        // ----------------------------------

        stations =
            removeDuplicates(
                combinedStations
            );


        console.log(
            "Radio Globe total stations:",
            stations.length
        );


        // ----------------------------------
        // SEND TO APPLICATION
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
// START APPLICATION
// ==========================================

loadStations();

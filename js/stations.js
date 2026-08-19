// ==========================================
// RADIO GLOBE - REAL RADIO STATIONS
// Worldwide + Rajasthan + Rajasthan Cities
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


// ==========================================
// CLEAN STATIONS
// ==========================================

function cleanStations(data) {

    return data

        .filter(station => {

            return (

                station.geo_lat !== null &&

                station.geo_long !== null &&

                (
                    station.url_resolved ||
                    station.url
                )

            );

        })

        .map(formatStation);

}


// ==========================================
// WORLDWIDE STATIONS
// ==========================================

async function getWorldwideStations(server) {

    const params =
        new URLSearchParams({

            hidebroken: "true",

            has_geo_info: "true",

            order: "clickcount",

            reverse: "true",

            limit: "500"

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
            `Worldwide request failed: ${response.status}`
        );

    }


    const data =
        await response.json();


    return cleanStations(data);

}


// ==========================================
// RAJASTHAN STATE SEARCH
// ==========================================

async function getRajasthanStateStations(server) {

    const params =
        new URLSearchParams({

            countrycode: "IN",

            state: "Rajasthan",

            stateExact: "false",

            hidebroken: "true",

            has_geo_info: "true",

            order: "clickcount",

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
            `Rajasthan state request failed: ${response.status}`
        );

    }


    const data =
        await response.json();


    return cleanStations(data);

}


// ==========================================
// RAJASTHAN CITY SEARCH
// ==========================================

async function getRajasthanCityStations(server) {

    const cities = [

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
        "Tonk",
        "Bundi",
        "Nagaur",
        "Hanumangarh",
        "Dausa",
        "Jhunjhunu",
        "Churu"
    ];


    const results = [];


    for (const city of cities) {

        try {

            const params =
                new URLSearchParams({

                    countrycode: "IN",

                    state: "Rajasthan",

                    name: city,

                    hidebroken: "true",

                    has_geo_info: "true",

                    order: "clickcount",

                    reverse: "true",

                    limit: "25"

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

                console.log(
                    `${city} request failed`
                );

                continue;

            }


            const data =
                await response.json();


            const cityStations =
                cleanStations(data);


            results.push(
                ...cityStations
            );


            console.log(
                `${city}: ${cityStations.length} stations`
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
            `Worldwide stations: ${worldwideStations.length}`
        );


        // ----------------------------------
        // RAJASTHAN STATE
        // ----------------------------------

        console.log(
            "Loading Rajasthan stations..."
        );


        const rajasthanStateStations =
            await getRajasthanStateStations(
                server
            );


        console.log(
            `Rajasthan state stations: ${rajasthanStateStations.length}`
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
            `Rajasthan city stations: ${rajasthanCityStations.length}`
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

        const uniqueStations =
            new Map();


        combinedStations.forEach(
            station => {

                if (
                    station.id &&
                    !uniqueStations.has(
                        station.id
                    )
                ) {

                    uniqueStations.set(
                        station.id,
                        station
                    );

                }

            }
        );


        stations =
            Array.from(
                uniqueStations.values()
            );


        console.log(
            `Radio Globe loaded ${stations.length} total stations.`
        );


        // ----------------------------------
        // TELL APPLICATION
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


        return stations;


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


// ==========================================
// START LOADING
// ==========================================
// ==========================================
// VERIFIED RAJASTHAN ONLINE STATION
// ==========================================

const RAJASTHAN_STATIONS = [

    {
        id: "air-jaipur",
        name: "Akashvani Jaipur",
        city: "Jaipur",
        state: "Rajasthan",
        country: "India",
        countryCode: "IN",

        latitude: 26.9124,
        longitude: 75.7873,

        /*
         * Online stream source
         */
        stream:
            "https://stream.zeno.fm/0r0t9d0h5p8uv",

        homepage:
            "https://akashvani.gov.in/",

        favicon: "",

        codec: "MP3",

        bitrate: 51,

        tags:
            "Rajasthan, Hindi, Rajasthani, News, Music",

        language:
            "Hindi, Rajasthani",

        votes: 0
    }

];
loadStations();

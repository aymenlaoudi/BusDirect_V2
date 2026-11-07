export function fetchData(url) {
    return fetch(url)
        .then(read => read.json())
        .then(data => {
            return data
        })
}

export function loadTrips() {
    const saved = localStorage.getItem("trips");
    if (saved) {
        return Promise.resolve(JSON.parse(saved));
    }
    return fetchData('./data/trips.json');
}

export function saveTrips(trips) {
    localStorage.setItem("trips", JSON.stringify(trips));
}

// LOCAL STORAGE
// FONCTION KATJIB RESERVATIONS MN LOCAL STORAGE
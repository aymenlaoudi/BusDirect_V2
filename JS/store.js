export function fetchData(url) {
    return fetch(url)
        .then(read => read.json())
        .then(data => {
            return data
        })
}


// LOCAL STORAGE
// FONCTION KATJIB RESERVATIONS MN LOCAL STORAGE
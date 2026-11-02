export function fetchData(url) {
    return fetch(url)
        .then(read => read.json())
        .then(data => {
            return data
        })
}
import { fetchData } from "./store.js";

fetchData('./data/trips.json')
    .then(data => {

        const trajets = document.getElementById('trajets');
        const numTrips = document.createElement('span');
        const len = Object.keys(data).length;
        trajets.append(numTrips)
        numTrips.textContent = len;

        numTrips.className = "text-xl font-semibold"

        const num_passagers = document.getElementById('num_passagers');
        const passagers = document.createElement('span');
        let seatsReserved = 0;
        for (let i = 0; i < data.length; i++) {
            seatsReserved += data[i].reservations.length
        }
        num_passagers.append(passagers);
        passagers.textContent = seatsReserved
        passagers.className = "text-xl font-semibold"

        const recette = document.getElementById('recette');
        const totalPrice = document.createElement('span');
        let totalMontant = 0;

        for (let i = 0; i < data.length; i++) {
            const trip = data[i];
        for (let j = 0; j < trip.reservations.length; j++) {
            const seat = trip.reservations[j].seat;
                if (seat <= 4) {
                    totalMontant += Math.round(trip.price * 1.1);
                } else {
                    totalMontant += trip.price;
                }
            }
        }
        
        recette.append(totalPrice);
        totalPrice.textContent = `${totalMontant} MAD`;
        totalPrice.className = "text-xl font-semibold"


        const trajets_complete = document.getElementById('trajets_complete')
        const trips_complete = document.createElement('span');
        let n = 0;
        for (let i = 0; i < data.length; i++) {
            let complet = data[i].reservations.length
            if (complet == data[i].capacity) {
                n += 1
            }
        }
        trips_complete.textContent = n
        trajets_complete.append(trips_complete)
        trips_complete.className = "text-xl font-semibold"

        // const card = document.getElementById('card');
        const allcards = document.getElementById('AllCards');
        const search = document.getElementById('search');

        let currentPage = 1;
        let cardsPerPage = 6;
        let currentdata = data

        let currentSearch = ""
        let currentStatus = "Tout"

        function renderCards(data) {
            allcards.innerHTML = ""

            let startIndex = (currentPage - 1) * cardsPerPage
            let endIndex = startIndex + cardsPerPage

            const pageTrips = data.slice(startIndex, endIndex);

            if (pageTrips.length === 0) {
                allcards.innerHTML = "<div style='grid-column: 1 / -1' class='bg-white rounded-xl shadow-xl p-8 text-center text-3xl font-bold text-gray-500'>Trajet introuvable</div>";
                 return;
            }

            for (let i = 0; i < pageTrips.length; i++) {
                let departure = pageTrips[i].departure
                let destination = pageTrips[i].destination
                let departTime = pageTrips[i].departureTime
                let arrivalTime = pageTrips[i].arrivalTime
                let price = pageTrips[i].price
                let id = pageTrips[i].id

                let reservations = pageTrips[i].reservations.length

                const disponible = document.createElement('div')

                if (reservations < 20) {
                    disponible.textContent = "Disponible"
                    disponible.className = "p-2 flex bg-green-200 rounded-2xl"
                } else {
                    disponible.textContent = "complet"
                    disponible.className = "p-2 flex bg-red-200 rounded-2xl text-gray-500"
                }

                let carte = document.createElement('div')
                carte.append(disponible)
                allcards.append(carte)
                carte.innerHTML = `<div class="h-[400px] shadow-xl w-full rounded-xl p-4 bg-white shadow-sm pb-7 flex flex-col" id="card">
                    <div class="flex justify-end">
                    <span class="${disponible.className}">${disponible.textContent}</span>
                    </div>
                    <div class="flex justify-between mt-6">
                        <div><span class="text-lg text-gray-500">${departure} </span> </div>
                        <div><span class="text-lg text-gray-500"> ${destination} </span> </div>
                    </div>
                    <div class="flex justify-between">
                        <div><span class="text-2xl font-bold"> ${departTime} </span> </div>
                        <div><span class="text-2xl font-bold"> ${arrivalTime} </span> </div>
                    </div>
                    <div class="flex mt-4">
                        <span class="text-xl font-bold text-gray-600">Prix :</span>
                        <span class="text-xl font-bold text-gray-600">${price} MAD</span>
                    </div>
                    <div class="flex flex-row mt-4">
                    <a href="./cabine.html?id=${id}" class="flex bg-blue-700 justify-center items-center w-full h-12 text-white rounded-lg cursor-pointer hover:bg-blue-600">Reserve un ticket</a>
                    </div>
            </div>`


            }
        }
        renderCards(data);
        
        // const saved = localStorage.getItem("citySearch")
        // if(saved){
        //     search.value = saved
        // }

        search.addEventListener('input', function () {
            let citySearch = search.value.toLowerCase().trim();
            // localStorage.setItem("citySearch",search.value)
            currentdata = data.filter(function (trip) {
                return trip.departure.toLowerCase().includes(citySearch) || trip.destination.toLowerCase().includes(citySearch)

            })
            currentPage = 1;
            renderCards(currentdata)
        })
        const btns = document.querySelectorAll('#pagination button')
        btns.forEach(function (btn, index) {
            btn.addEventListener('click', function () {
                currentPage = index + 1
                renderCards(currentdata)
            })
        })

        // const tries = document.getElementById('tries')
        // tries.addEventListener('change', function () {
        // currentStatus = tries.value
        // currentPage = 1
        // console.log(currentStatus)
        // if (currentStatus == 'Tout') {
        //     renderCards(data.slice(0, 20))
        // }
        // else if (currentStatus == 'Disponible'){
        //     renderCards()
        // }
        // })


        for(let i=0 ; i < data.length ; i++){
            console.log(data[i].id)
            console.log(data[i].reservations)
        }

    })

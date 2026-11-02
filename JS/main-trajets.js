import { fetchData } from "./store.js";


fetchData('./data/trips.json')
.then(data => {

    console.log(data)
    const trajets = document.getElementById('trajets');
    const numTrips = document.createElement('span');
    const len = Object.keys(data).length;
    trajets.append(numTrips)
    numTrips.textContent = len;

    const num_passagers = document.getElementById('num_passagers');
    const passagers = document.createElement('span');
    let seatsReserved = 0 ; 
    for (let i=0 ; i < data.length ; i++){
        seatsReserved += data[i].reservations.length
    }
    num_passagers.append(passagers);
    passagers.textContent = seatsReserved

    const recette = document.getElementById('recette');
    const totalPrice = document.createElement('span');
    let totalMontant = 0;

    for(let i = 0 ; i < data.length ; i++){
        let montant = data[i].price
        totalMontant += montant * data[i].reservations.length;
    }
    recette.append(totalPrice);
    totalPrice.textContent = `${totalMontant} MAD`;

    const card = document.getElementById('card');
    const allcards = document.getElementById('AllCards');

    for(let i = 0 ; i < data.length ; i++){
        let departure = data[i].departure
        let destination = data[i].destination
        let departTime = data[i].departureTime
        let arrivalTime = data[i].arrivalTime
        let price = data[i].price

        let reservations = data[i].reservations.length
        console.log(reservations)

        const disponible = document.createElement('div')
        let dispo ;
        

        if(reservations < 20){
            disponible.textContent = "Disponible"
            disponible.className = "p-2 flex bg-green-200 rounded-2xl"
        }else{
            disponible.textContent = "complet"
            disponible.className = "p-2 flex bg-red-200 rounded-2xl"
        }
        console.log(disponible.classList)
    
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
                <div class="flex mt-4">
                <button type="button" class="bg-blue-400 w-full h-12 rounded-lg hover:bg-blue-500">Reserve un ticket</button>
                </div>
        </div>`
        
        // const search = document.getElementById('search');
        // let citySearch = search.value.toLowerCase()
        // search.addEventListener("input",function(){
        //     if(citySearch === departure || citySearch === destination){
        //         console.log(carte)
        //     }
        // })
    }
})

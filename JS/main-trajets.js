fetch('./data/trips.json')
.then(read => read.json())
.then(data =>{
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
        
    }


    for(let i = 0 ; i < data.length ; i++){
        let departure = data[i].departure
        let destination = data[i].destination
        let departTime = data[i].departureTime
        let arrivalTime = data[i].arrivalTime

        let reservations = data[i].reservations.length
        console.log(reservations)

        const disponible = document.createElement('div')
        let isDispo ;
        for (let i=0 ; i < reservations ; i++){
            console.log(reservations[i]);
            
            if(reservations <= 20){
                isDispo = disponible.textContent = "Disponible"
            }
        }
        
        let carte = document.createElement('div')
        carte.append(disponible)
        allcards.append(carte)
        carte.innerHTML = `<div class="shadow-xl w-full rounded-xl gap-3 p-4 bg-white shadow-sm pb-7" id="card">
                <span class="p-1 bg-red-200">${isDispo}</span>
                <div class="flex justify-between">
                    <div><span>${departure} </span> </div>  
                    <div><span> ${destination} </span> </div>
                </div>
                <div class="flex justify-between">
                    <div><span> ${departTime} </span> </div>
                    <div><span> ${arrivalTime} </span> </div>
                </div>
        </div>`

        
        if (i == 5) {
            return
        }
        }
})

import { fetchData } from "./store.js";
import { numValid } from "./validators.js";
fetchData('./data/trips.json')
    .then(data => {

const totalSeats = 20;
const seatGrid = document.getElementById("seatGrid");
const nameInput = document.getElementById("nameInput");
const seatInput = document.getElementById("seatInput");
const reserveButton = document.getElementById("reserveButton");
const message = document.getElementById("message");

const places = document.getElementById("places");
const prix = document.getElementById("prix");

let reservations = {};

const modifySelect = document.getElementById("changeSelect");
const modifyNameInput = document.getElementById("modifyNameInput");
const newSeatInput = document.getElementById("newSeat");
const modifyButton = document.getElementById("modifyBtn");
const modifyMessage = document.getElementById("modifyMessage");
const modifyNum = document.getElementById('modify_num');

const supSelect = document.getElementById("supSelect");
const supBtn = document.getElementById("supBtn");
const supMessage = document.getElementById("supMessage");

const phoneInput = document.getElementById('num_tel');

const freeSeatStyle =
    "flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 py-4 cursor-pointer hover:border-green-500";
const reservedSeatStyle =
    "flex flex-col items-center justify-center rounded-xl border border-green-700 bg-green-500 text-white py-4 cursor-pointer";

function createSeats() {
    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement("div");
        seat.id = "seat-" + i;
        seat.className = freeSeatStyle;

        const number = document.createElement("span");
        number.className = "text-lg font-bold";
        number.textContent = i;

        const label = document.createElement("span");
        label.id = "label-" + i;
        label.className = "text-xs mt-1";
        label.textContent = "Free";


        if(i <= 4){
            seat.style.borderColor = "orange"
            label.textContent = "VIP"
        }

        seatGrid.append(seat);
        seat.append(number);
        seat.append(label);



        seat.addEventListener("click", function () {
            seatInput.value = i;
        });
        if (i % 4 === 2) {
            const aisle = document.createElement("div");
            seatGrid.appendChild(aisle);
        }
    }
}


const params = new URLSearchParams(window.location.search)
const tripId =Number(params.get("id"))
const trip = data.find(t => t.id === tripId)

document.getElementById("tripTitle").textContent = trip.departure + " → " + trip.destination;
document.getElementById("tripPrice").textContent = trip.price + " DH / place";

function showMessage(element, text, isError) {
    element.textContent = text;
    if (isError) {
        element.className = "mt-4 text-sm font-medium text-red-600";
    } else {
        element.className = "mt-4 text-sm font-medium text-green-700";
    }
    // clearTimeout(element.timer);
    // element.timer = setTimeout(function () {
    //     element.textContent = "";
    // }, 3000);
}

function markSeatAsReserved(seatNumber, name) {
    reservations[seatNumber] = name;


    const seat = document.getElementById("seat-" + seatNumber);
    const label = document.getElementById("label-" + seatNumber);

    seat.className = reservedSeatStyle;
    label.textContent = name;
    updateModifySelect();
}
function fillNameBox() {
    if (modifySelect.value === "") {
        modifyNameInput.value = "";
    } else {
        modifyNameInput.value = reservations[modifySelect.value];
    }
}

function reserveSeat() {
    if (Object.keys(reservations).length === totalSeats) {
    const waitName = nameInput.value.trim();
    if (waitName === "") {
        showMessage(message, "Please enter your name.", true);
        return;
    }
    if (!numValid(phoneInput.value)) {
        showMessage(message, "Numero invalid (ex: 06 12 34 56 78)", true);
        return;
    }
    trip.waitingList.push({ name: waitName, phone: phoneInput.value });
    renderWaitingList();
    showMessage(message, waitName + " est en position " + trip.waitingList.length + ".", false);
    nameInput.value = "";
    phoneInput.value = "";
    return;
    }
    const name = nameInput.value.trim();
    let seatNumber = Number(seatInput.value);
    const names = Object.values(reservations).includes(name);

    if (name === "") {
        showMessage(message, "Please enter your name.", true);
        return;
    }

    if (names){
        showMessage(message, "This name "+name+" already exist.",true)
        return;
    }

    if(seatInput.value === ""){
        seatNumber = findFreeSeat();
    }

    // if(seatNumber === null){
    //     showMessage(message, "Aucun siège libre",true)
    //     return;
    // }

    if (!Number.isInteger(seatNumber) || seatNumber < 1 || seatNumber > totalSeats) {
        showMessage(message, "Please enter a seat number between 1 and " + totalSeats + ".", true);
        return;
    }

    if (reservations[seatNumber] !== undefined) {
        showMessage(message, "Seat " + seatNumber + " is already reserved by " + reservations[seatNumber] + ".", true);
        return;
    }

    if (!numValid(phoneInput.value)){
    showMessage(message, "Numero invalid (ex: 06 12 34 56 78)",true)
    return;
    }

    markSeatAsReserved(seatNumber, name);
    showMessage(message, "Seat " + seatNumber + " is reserved for " + name + ".", false);
    seatCounter();
    prixCounter()
    nameInput.value = "";
    seatInput.value = "";

    save();
}

createSeats();


function markSeatAsFree(seatNumber) {
    delete reservations[seatNumber];

    const seat = document.getElementById("seat-" + seatNumber);
    const label = document.getElementById("label-" + seatNumber);

    seat.className = freeSeatStyle;
    label.textContent = "Free";

    updateModifySelect();
}
function modifyReservation() {
    const oldSeat = Number(modifySelect.value);
    const newName = modifyNameInput.value.trim();
    const newSeat = Number(newSeatInput.value);
    const names = Object.values(reservations).includes(newName);

    if (modifySelect.value === "") {
        showMessage(modifyMessage, "Please choose a passenger.", true);
        return;
    }

    if (newName === "") {
        showMessage(modifyMessage, "Please enter a name.", true);
        return;
    }

    if (names){
        showMessage(modifyMessage, "This name "+newName+" already exist.",true)
        return;
    }

    if (newSeatInput.value === "" || !Number.isInteger(newSeat) || newSeat < 1 || newSeat > totalSeats) {
        showMessage(modifyMessage, "Please enter a seat number between 1 and " + totalSeats + ".", true);
        return;
    }

    if (newSeat !== oldSeat && reservations[newSeat] !== undefined) {
        showMessage(modifyMessage, "Seat " + newSeat + " is already reserved by " + reservations[newSeat] + ".", true);
        return;
    }

    if (newSeat === oldSeat && newName === reservations[oldSeat]) {
        showMessage(modifyMessage, "Nothing to change: same name and same seat.", true);
        return;
    }

    if (!numValid(modifyNum.value)){
        showMessage(modifyMessage, "Numero invalid (ex: 06 12 34 56 78)",true)
        return;
    }

    markSeatAsFree(oldSeat);
    markSeatAsReserved(newSeat, newName);
    seatCounter();
    prixCounter();

    showMessage(modifyMessage, newName + " is now in seat " + newSeat + ".", false);

    modifyNameInput.value = "";
    newSeatInput.value = "";

    save();
}


reserveButton.addEventListener("click", reserveSeat);
modifySelect.addEventListener("change", fillNameBox);
modifyButton.addEventListener("click", modifyReservation);


function fillSelect(select) {
    select.innerHTML = "";
    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = "Choose a passenger";
    select.appendChild(firstOption);
    for (let seatNumber in reservations) {
        const option = document.createElement("option");
        option.value = seatNumber;
        option.textContent = reservations[seatNumber] + " (seat " + seatNumber + ")";
        select.appendChild(option);
    }
}

function updateModifySelect() {
    fillSelect(modifySelect);
    fillSelect(supSelect);
}

function deleteReservation() {
    if (supSelect.value === "") {
        showMessage(supMessage, "Please choose a passenger.", true);
        return;
    }

    const seatNumber = supSelect.value;
    const name = reservations[seatNumber];

    markSeatAsFree(seatNumber);
    if (trip.waitingList.length > 0 && Number(seatNumber) > 4) {
    const first = trip.waitingList[0];
    trip.waitingList.splice(0, 1);
    markSeatAsReserved(seatNumber, first.name);
    renderWaitingList();
    }
    showMessage(supMessage, name + " (seat " + seatNumber + ") has been deleted.", false);
    seatCounter();
    prixCounter();
    save();
}

supBtn.addEventListener("click", deleteReservation);

places.textContent = totalSeats - Object.keys(reservations).length + "/" + totalSeats;
function seatCounter() {
    const disp_seats = totalSeats - Object.keys(reservations).length;
    places.textContent = disp_seats + "/20";
    if (disp_seats === 0) {
        reserveButton.textContent = "Ajouter à la liste d'attente";
    } else {
        reserveButton.textContent = "Confirmer";
    }
}


function prixCounter() {
    let total = 0;
    for (let seat in reservations) {
        total += getSeatPrice(Number(seat));
    }
    prix.textContent = total + " DH";
}

function getSeatPrice(seatNumber) {
    if (seatNumber <= 4) {
        return Math.round(trip.price * 1.1);
    }
    return trip.price;
}


// reservations = JSON.parse(localStorage.getItem('reservations')||'{}');
function save() {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

// const passager_attente = document.getElementById('passager_attente')
// const numero_tel = document.getElementById('numero_tel')

// const show_passager_name = document.createElement('span')
// const show_passager = document.getElementById('show_passager')
// show_passager.append(show_passager_name)

// passager_attente.addEventListener('input',function(){
//     show_passager_name.textContent = passager_attente.value
// })

// numero_tel.addEventListener('input',function() {
//     console.log(numero_tel.value)
// })
const waitBody = document.getElementById("waitBody");

function renderWaitingList() {
    waitBody.innerHTML = "";

    for (let i = 0; i < trip.waitingList.length; i++) {
        const person = trip.waitingList[i];

        const tr = document.createElement("tr");
        tr.innerHTML =
            "<td class='p-2'>" + (i + 1) + "</td>" +
            "<td class='p-2'>" + person.name + "</td>" +
            "<td class='p-2'>" + person.phone + "</td>";

        waitBody.appendChild(tr);
    }
}
for (let i = 0; i < trip.reservations.length; i++) {
    const r = trip.reservations[i];
    markSeatAsReserved(r.seat , r.name)
}
seatCounter();
prixCounter();    
renderWaitingList();

function findFreeSeat() {
    for (let i = 5; i <= totalSeats ; i++) {
        if (reservations[i] === undefined){
            return i ;
        }
    }
    return null
}


})
const totalSeats = 20;
const seatGrid = document.getElementById("seatGrid");
const nameInput = document.getElementById("nameInput");
const seatInput = document.getElementById("seatInput");
const reserveButton = document.getElementById("reserveButton");
const message = document.getElementById("message");

const places = document.getElementById("places");
const prix = document.getElementById("prix");

const reservations = {};

const modifySelect = document.getElementById("changeSelect");
const modifyNameInput = document.getElementById("modifyNameInput");
const newSeatInput = document.getElementById("newSeat");
const modifyButton = document.getElementById("modifyBtn");
const modifyMessage = document.getElementById("modifyMessage");

const supSelect = document.getElementById("supSelect");
const supBtn = document.getElementById("supBtn");
const supMessage = document.getElementById("supMessage");

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

        seatGrid.appendChild(seat);
        seat.appendChild(number);
        seat.appendChild(label);

        seat.addEventListener("click", function () {
            seatInput.value = i;
        });
        if (i % 4 === 2) {
            const aisle = document.createElement("div");
            seatGrid.appendChild(aisle);
        }
    }
}


function showMessage(element, text, isError) {
    element.textContent = text;
    if (isError) {
        element.className = "mt-4 text-sm font-medium text-red-600";
    } else {
        element.className = "mt-4 text-sm font-medium text-green-700";
    }
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
    const name = nameInput.value.trim();
    const seatNumber = Number(seatInput.value);
    const names = Object.values(reservations).includes(name);

    if (name === "") {
        showMessage(message, "Please enter your name.", true);
        return;
    }

    if (names){
        showMessage(message, "This name "+name+" already exist.",true)
        return;
    }

    if (seatInput.value === "" || !Number.isInteger(seatNumber) || seatNumber < 1 || seatNumber > totalSeats) {
        showMessage(message, "Please enter a seat number between 1 and " + totalSeats + ".", true);
        return;
    }

    if (reservations[seatNumber] !== undefined) {
        showMessage(message, "Seat " + seatNumber + " is already reserved by " + reservations[seatNumber] + ".", true);
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

    markSeatAsFree(oldSeat);
    markSeatAsReserved(newSeat, newName);
    showMessage(modifyMessage, newName + " is now in seat " + newSeat + ".", false);

    modifyNameInput.value = "";
    newSeatInput.value = "";

    save();
}

markSeatAsReserved(3, "Salah");
markSeatAsReserved(4, "Marc");
markSeatAsReserved(14, "Zakaria");

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
}

prix.textContent = Object.keys(reservations).length * 80 + " DH";
function prixCounter() {
    const price = Object.keys(reservations).length * 80;
    console.log(price);
    prix.textContent = price + " DH";
}
reservations = JSON.parse(localStorage.getItem('reservations')||[]);
function save() {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}



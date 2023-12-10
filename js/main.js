// Función asincrónica para llenar el campo de selección de servicios
const populateServicesSelect = async () => {
    // Obtiene la referencia al elemento de selección (dropdown) por su ID
    const selectElement = document.getElementById('service');
    try {
        // Realiza una solicitud para obtener datos de un archivo JSON local
        const response = await fetch('./json/service.json');
        // Convierte la respuesta a formato JSON
        const services = await response.json();

        // Itera sobre cada servicio y crea una opción para cada uno en el dropdown
        services.forEach((service) => {
            const optionElement = document.createElement('option');
            optionElement.value = service.value;
            optionElement.textContent = service.name;
            selectElement.appendChild(optionElement);
        });
    } catch (error) {
        // Maneja errores, muestra una alerta usando la biblioteca SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Error 404',
            text: 'Error al cargar los servicios',
            footer: '<a href="https://support.google.com/webmasters/answer/2445990?hl=es">¿Por qué tengo este problema?</a>'
        });
    }
};

// Llama a la función para poblar el dropdown con servicios al cargar la página
populateServicesSelect();

// Función para obtener datos del formulario
const getFormData = () => {
    // Obtiene los valores de varios campos del formulario por sus ID
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const service = document.getElementById('service').value;
    return { name, phone, date, time, service };
};

// Función para guardar una reserva
const saveReservation = () => {
    // Obtiene datos del formulario y las reservas existentes
    const reservationData = getFormData();
    const reservations = getReservations();

    
    // Verifica si la fecha introducida es anterior a la fecha actual
    const inputDate = new Date(reservationData.date);
    const currentDate = new Date();

    if (inputDate < currentDate) {
        // Muestra una alerta si la fecha es anterior a la actual
        Swal.fire({
            title: 'Error de fecha',
            icon: 'error',
            text: 'La fecha introducida no puede ser anterior a la fecha actual.'
        });
        return;
    }

    // Verifica si el campo de teléfono contiene solo números
    if (!/^\d+$/.test(reservationData.phone)) {
        // Muestra una alerta si el teléfono contiene letras u otros caracteres
        Swal.fire({
            title: 'Error de teléfono',
            icon: 'error',
            text: 'El campo de teléfono solo debe contener números.'
        });
        return;
    }

    // Verifica si el horario de la reserva está entre las 9:00 y las 19:00
    const reservationTime = new Date(`2000-01-01T${reservationData.time}`);
    const openingTime = new Date(`2000-01-01T09:00:00`);
    const closingTime = new Date(`2000-01-01T19:00:00`);

    if (reservationTime < openingTime || reservationTime > closingTime) {
        // Muestra una alerta si el horario no está dentro del rango permitido
        Swal.fire({
            title: 'Error de horario',
            icon: 'error',
            text: 'El horario de la reserva debe estar entre las 9:00 y las 19:00.'
        });
        return;
    }

    // Verifica si ya existe una reserva para la misma fecha y hora
    const isDuplicateReservation = reservations.some((reservation) => {
        return reservation.date === reservationData.date && reservation.time === reservationData.time;
    });

    // Si es una reserva duplicada, muestra una alerta de error
    if (isDuplicateReservation) {
        Swal.fire({
            title: 'Ya existe una reserva para esa fecha y hora',
            icon: 'error',
            confirmButtonColor: '#ff8f9a'
        });
    } else {
        // Si no es duplicada, agrega la reserva, guarda en localStorage y muestra una alerta de éxito
        reservations.push(reservationData);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        Swal.fire({
            title: 'Reserva realizada exitosamente',
            icon: 'success',
            confirmButtonColor: '#ff7987'
        });
        // Muestra las reservas actualizadas
        displayReservations();
    }
};

// Función para obtener las reservas almacenadas en localStorage
const getReservations = () => {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    return reservations;
};

// Función para mostrar las reservas en la interfaz de usuario
const displayReservations = () => {
    // Obtiene las reservas y el elemento de la lista de reservas por su ID
    const reservations = getReservations();
    const reservationsList = document.getElementById('reservations');
    reservationsList.innerHTML = '';

    // Comprueba si hay reservas para mostrar
    if (reservations.length === 0) {
        reservationsList.innerHTML = '<li>No se han realizado reservas.</li>';
    } else {
        // Itera sobre cada reserva y crea elementos de lista para mostrar la información
        reservations.forEach((reservation, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>Nombre: ${reservation.name}</span>
                <span>Fecha: ${reservation.date}</span>
                <button class="button" onclick="cancelReservation(${index})" ${reservation.canceled ? 'disabled' : ''}>
                    ${reservation.canceled ? 'Cancelado' : 'Cancelar'}
                </button>
            `;
            // Agrega una clase si la reserva está cancelada
            if (reservation.canceled) {
                listItem.classList.add('canceled');
            }
            reservationsList.appendChild(listItem);
        });
    }
};

// Función para cancelar una reserva
const cancelReservation = (index) => {
    const reservations = getReservations();
    const reservationToCancel = reservations[index];

    // Muestra un cuadro de diálogo de confirmación usando SweetAlert2
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: '¿Desea eliminar su reserva?',
        text: `Usted va a cancelar su reserva para el día: ${reservationToCancel.date}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cancelar reserva!',
        cancelButtonText: 'volver',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Elimina la reserva, guarda en localStorage y muestra las reservas actualizadas
            reservations.splice(index, 1);
            localStorage.setItem('reservations', JSON.stringify(reservations));
            displayReservations();

            // Muestra una alerta de éxito
            swalWithBootstrapButtons.fire(
                'Reserva cancelada!',
                'Usted ha eliminado su reserva',
                'success',
            );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Muestra una alerta si se cancela la cancelación :)
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'Usted ha cancelado su cancelación  :)',
                'error'
            );
        }
    });
};

// Función para mostrar un mensaje de estado en la interfaz de usuario
const displayStatusMessage = (message, type) => {
    const statusMessageDiv = document.getElementById('statusMessage');
    statusMessageDiv.innerText = message;
    statusMessageDiv.style.color = type === 'success' ? 'green' : 'red';
};

// Agrega un event listener al formulario para llamar a saveReservation al enviar el formulario
document.getElementById('reservationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    saveReservation();
    // Restablece el formulario después de guardar la reserva
    event.target.reset();
});

// Muestra las reservas al cargar la página
displayReservations();

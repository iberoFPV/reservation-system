window.onload = () => {
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

    const saveReservation = () => {
        const reservationData = getFormData();
        const reservations = getReservations();

        const inputDate = new Date(reservationData.date);
        const currentDate = new Date();

        if (inputDate < currentDate) {
            Swal.fire({
                title: 'Error de fecha',
                icon: 'error',
                text: 'La fecha introducida no puede ser anterior a la fecha actual.'
            });
            return;
        }

        if (!/^\d+$/.test(reservationData.phone)) {
            Swal.fire({
                title: 'Error de teléfono',
                icon: 'error',
                text: 'El campo de teléfono solo debe contener números.'
            });
            return;
        }

        const reservationTime = new Date(`2000-01-01T${reservationData.time}`);
        const openingTime = new Date(`2000-01-01T09:00:00`);
        const closingTime = new Date(`2000-01-01T19:00:00`);

        if (reservationTime < openingTime || reservationTime > closingTime) {
            Swal.fire({
                title: 'Error de horario',
                icon: 'error',
                text: 'El horario de la reserva debe estar entre las 9:00 y las 19:00.'
            });
            return;
        }

        const isDuplicateReservation = reservations.some((reservation) => {
            return reservation.date === reservationData.date && reservation.time === reservationData.time;
        });

        if (isDuplicateReservation) {
            Swal.fire({
                title: 'Ya existe una reserva para esa fecha y hora',
                icon: 'error',
                confirmButtonColor: '#ff8f9a'
            });
        } else {
            reservations.push(reservationData);
            localStorage.setItem('reservations', JSON.stringify(reservations));
            Swal.fire({
                title: 'Reserva realizada exitosamente',
                icon: 'success',
                confirmButtonColor: '#ff7987'
            });
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
                    <button class="button cancelButton" data-index="${index}" ${reservation.canceled ? 'disabled' : ''}>
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

    // Cambia la forma en que se asigna el evento onclick para los botones de cancelación
    const reservationsList = document.getElementById('reservations');
    reservationsList.addEventListener('click', (event) => {
        const target = event.target;

        // Verifica si se hizo clic en un botón de cancelación
        if (target.classList.contains('cancelButton')) {
            const index = target.dataset.index;
            cancelReservation(index);
        }
    });

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
};

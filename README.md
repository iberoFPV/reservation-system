# Proyecto Javascript - Simulador de Reservas

- **Enlace a netlify:** https://reservation-system-js.netlify.app/

- **Prueba del proyecto:** Para experimentar con todas las funcionalidades del proyecto, se recomienda realizar una copia local o descargar el repositorio. Esto permitirá una prueba completa y personalizada de las características implementadas

- **Carga de Servicios:** La función `populateServicesSelect` carga la lista de servicios disponibles desde un archivo JSON y los muestra como opciones en un elemento de selección HTML.

- **Formulario de Reserva:** El formulario de reserva permite a los usuarios ingresar su nombre, número de teléfono, fecha, hora y seleccionar un servicio.

- **Almacenamiento de Reservas:** La función `saveReservation` toma los datos del formulario, verifica si hay conflictos con reservas existentes o datos mal introducidos y, si no hay conflictos, guarda la reserva en el almacenamiento local del navegador.

- **Visualización de Reservas:** La función `displayReservations` muestra las reservas almacenadas en una lista en la página web.

- **Cancelación de Reservas:** Los usuarios tienen la opción de cancelar sus reservas. Al hacerlo, se muestra un cuadro de diálogo de confirmación y, si se confirma, se elimina la reserva correspondiente del almacenamiento local y se actualiza la lista de reservas.

- **Mensajes de Estado:** La función `displayStatusMessage` permite mostrar mensajes de éxito o error en la página.

## Tecnologías Utilizadas

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="40" alt="html5 logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="css3 logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo" />
  <img width="12" />
</div>

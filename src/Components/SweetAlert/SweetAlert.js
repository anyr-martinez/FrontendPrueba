import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(swal);
const swalWithBootstrapButtons = MySwal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
});

export function mostrarAlerta(mensaje, icono = "info", foco = "") {
    MySwal.fire({
        title: mensaje,
        icon: icono,
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn-primary',
        },
    });
    enfocarCampo(foco);
}

export function mostrarAlertaOK(mensaje, icono = "success", foco = "") {
    MySwal.fire({
        title: mensaje,
        icon: icono,
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 1400,
    });
    enfocarCampo(foco);
}

export function mostrarAlertaPregunta(accion, mensaje, foco = "") {
    MySwal.fire({
        title: mensaje,
        icon: 'question',
        confirmButtonText: 'Sí',
        showConfirmButton: true,
        cancelButtonText: 'No',
        showCancelButton: true,
    }).then((result) => {
        accion(result.isConfirmed);
    });
    enfocarCampo(foco);
}

export function mostrarAlertaError(mensaje, foco = "") {
    MySwal.fire({
        title: mensaje,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 1500
    });
    enfocarCampo(foco);
}

export function mostrarAlertaWarning(mensaje, foco = "") {
    MySwal.fire({
        title: mensaje,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 1400
    });
    enfocarCampo(foco);
}

export function mostrarAlertaModificar(titulo, mensaje, peticion) {
    swalWithBootstrapButtons.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Modificar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            peticion();
            swalWithBootstrapButtons.fire('Modificado', 'Registro Modificado', 'success');
        } else {
            swalWithBootstrapButtons.fire('Cancelado', 'No se realizaron cambios', 'error');
        }
    });
}

function enfocarCampo(foco) {
    if (foco) {
        const element = document.getElementById(foco);
        if (element) {
            element.focus();
        }
    }
}

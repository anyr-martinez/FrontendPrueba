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

export function mostraAlerta(mensaje, icono, foco) {
    MySwal.fire({
        title: mensaje,
        icon: icono,
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn-primary',
        },
    });
} 

export function mostraAlertaOK(mensaje, icono, foco) {
    MySwal.fire({
        title: mensaje,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 1500,
    });
}

export function mostrarAlertaPregunta(accion, mensaje, icono, foco) {
    MySwal.fire({
        title: mensaje,
        icon: 'question',
        confirmButtonText: 'Si',
        showConfirmButton: true,
        cancelButtonText: 'No',
        showCancelButton: true,
    }).then((re) => {
        if (re.isConfirmed) {
            accion(true);
        } else {
            accion(false);
        }
    });
}

export function mostraAlertaError(mensaje, icono, foco) {
    MySwal.fire({
        title: mensaje,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 3000
    });
}

export function mostraAlertaWarning(mensaje, icono, foco) {
    MySwal.fire({
        title: mensaje,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 3000
    });
}

export function mostraAlertaModificar(titulo, mensaje, peticion) {
    swalWithBootstrapButtons.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Modificar',
        cancelButtonText: 'Cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                'Modificado',
                'Registro Modificado',
                'success'
            );
        } else if (result.dismiss === swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            );
        }
    });
}

function onFocus(foco) {
    if (foco !== '') {
        document.getElementById(foco).focus();
    }
}
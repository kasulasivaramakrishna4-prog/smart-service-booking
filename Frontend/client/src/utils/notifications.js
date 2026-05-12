import Swal from "sweetalert2";
import "../styles/swal.css";

export const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  customClass: {
    popup: "app-toast",
  },
});

export const popup = Swal.mixin({
  buttonsStyling: false,
  customClass: {
    popup: "app-swal",
    title: "app-swal-title",
    htmlContainer: "app-swal-text",
    confirmButton: "app-swal-confirm",
    cancelButton: "app-swal-cancel",
    actions: "app-swal-actions",
  },
});

export function showLoading(title, text) {
  popup.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export default popup;

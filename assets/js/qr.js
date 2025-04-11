AOS.init();

window.addEventListener("DOMContentLoaded", async () => {
  const Id = sessionStorage.getItem("Id_Exp");
  const Empresa = sessionStorage.getItem("Empresa_Exp");

  if (Empresa) {
    document.getElementById("Empresa_Exp").innerText = Empresa;
  }

  await cargarContactos();
});

const btnEscanear = document.getElementById("btnEscanear");
const seccionEscaner = document.getElementById("seccionEscaner");
const qrReader = document.getElementById("qr-reader");
const qrResults = document.getElementById("qr-reader-results");

const html5QrCode = new Html5Qrcode("qr-reader");

btnEscanear.addEventListener("click", () => {
  seccionEscaner.style.display = "block";
  qrReader.style.display = "block";
  qrResults.innerText = "";

  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    },
    (decodedText, decodedResult) => {
      //console.log("Código escaneado:", decodedText);
      // qrResults.innerText = ` Código detectado: ${decodedText}`;

      fetch("/registrar-intercambio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expositor_id: sessionStorage.getItem("Id_Exp"),
          usuario_id: decodedText.replace("ID:", "").trim(),
          evento_id: 1,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            cargarContactos();
        
            Swal.fire({
              title: "¡Escaneo exitoso!",
              text: "El código se escaneó correctamente y los datos fueron registrados.",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
          } else if (data.message.includes("ya fue escaneado")) {
            Swal.fire({
              title: "Usuario ya registrado",
              text: "Los datos de este usuario ya fueron escaneados anteriormente.",
              icon: "warning",
              showConfirmButton: false,
              timer: 2000,
            });
          } else if (data.message.includes("no existe")) {
            Swal.fire({
              title: "Usuario no encontrado",
              text: "Este código no pertenece a ningún usuario registrado.",
              icon: "error",
              confirmButtonColor: "#fa583f",
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              title: "Error de red",
              text: "Reivise su conexión a Internet.",
              icon: "error",
              showConfirmButton: false,
            timer: 2000,
            });
          }
        })
        
        .catch((err) => {
          console.error("Error al registrar intercambio:", err);

          Swal.fire({
            title: "Error de red",
            text: "Ocurrió un error al intentar registrar el intercambio, revise su conexion e intente de nuevo.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        });

      html5QrCode.stop().then(() => {
        console.log("Escaneo detenido");
        qrReader.style.display = "none";
      });
    },
    (errorMessage) => {
      console.warn(`Escaneo fallido: ${errorMessage}`);
    }
  );
});

async function cargarContactos() {
  const usuarioId = sessionStorage.getItem("Id_Exp");
  const tbody = document.getElementById("contactos-body");

  if (!usuarioId) return;

  try {
    const res = await fetch(`/mis-contactos/${usuarioId}`);
    const contactos = await res.json();

    if (Array.isArray(contactos)) {
      tbody.innerHTML = "";
      contactos.forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.NOMBRE}</td>
            <td>${c.APELLIDO}</td>
            <td>${c.EMPRESA}</td>
            <td>${c.CORREO}</td>
            <td>${c.TELEFONO}</td>
            <td>${c.ESTADO}</td>
            <td>${c.CIUDAD}</td>
          `;
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error("Error al cargar contactos:", err);
  }
}

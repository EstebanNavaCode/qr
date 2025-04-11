AOS.init();

async function cargarContactos() {
    const usuarioId = sessionStorage.getItem("Id_Exp");
    const tbody = document.getElementById("contactos-body");

    if (!usuarioId) return;

    try {
        const res = await fetch(`/contacs/${usuarioId}`);
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

window.addEventListener("DOMContentLoaded", cargarContactos);

document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const empresa = document.getElementById("empresa").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellidos, empresa, correo, contrasena }),
    });

    if (response.status === 409) {
      Swal.fire({
        title: "Correo duplicado",
        text: "Este correo ya fue registrado anteriormente, por favor use otro.",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.href = "/register";
      });
      return;
    }

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "¡Registro exitoso!",
        text: "Ahora puede iniciar sesión.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.href = "/";
      });
    } else {
      Swal.fire({
        title: "Error",
        text: data.message || "No se pudo registrar el expositor, espera un momento e intente de nuevo.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });

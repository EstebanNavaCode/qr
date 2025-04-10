AOS.init();

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (data.success) {
    const { ID_EXP, EMPRESA_EXP } = data.user;
    sessionStorage.setItem('Id_Exp', ID_EXP);
    sessionStorage.setItem('Empresa_Exp', EMPRESA_EXP);


    window.location.href = '/dashboard';
  } else {
    alert(data.message);
  }
});


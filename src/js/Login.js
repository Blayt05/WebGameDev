document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que se recargue la página al hacer submit

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const termsAccepted = document.getElementById('terms').checked;

        if (!termsAccepted) {
            Swal.fire({
                icon: 'warning',
                title: 'Terms not accepted',
                text: 'You must accept the terms to login.'
            });
            return;
        }

        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing fields',
                text: 'Please enter both email and password.'
            });
            return;
        }

        fetch('https://localhost:7141/api/Login', {  // Asegúrate que sea tu puerto correcto
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                username: email, 
                password: password 
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            } else {
                throw new Error('Login failed. Please try again later.');
            }
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: data.message || 'Login successful!'
            }).then(() => {
                // Redirigir basado en el rol
                if (data.role === 'admin') {
                    window.location.href = "/homeAdmin.html"; // o donde tú quieras
                } else {
                    window.location.href = "/GamePage.html";
                }
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: error.message
            });
        });
    });
});

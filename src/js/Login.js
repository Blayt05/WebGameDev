function login() {
    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('https://localhost:7159/api/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    })

    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Login failed');
        }
    })
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        alert(error.message);
    });
    
}
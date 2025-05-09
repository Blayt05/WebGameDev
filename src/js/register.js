document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir que el formulario se envíe de manera tradicional

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const termsAccepted = document.getElementById("terms").checked;

    if (!termsAccepted) {
        alert("You must agree to the terms and conditions.");
        return;
    }

    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };

    fetch("https://localhost:7141/api/Register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Registration failed");
        }
    })
    .then(data => {
        alert("User registered successfully");
        window.location.href = "Login.html"; // Redirect to login page
    })
    .catch(error => {
        alert(error.message);
    });
});

//Comment
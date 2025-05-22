// Vista previa de la imagen de perfil y guardar base64
let profileImageBase64 = "";

document.getElementById('profile-pic-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Vista previa
        document.getElementById('profile-img').src = URL.createObjectURL(file);

        // Leer como base64
        const reader = new FileReader();
        reader.onload = function(evt) {
            profileImageBase64 = evt.target.result.split(',')[1]; // Solo la parte base64
        };
        reader.readAsDataURL(file);
    }
});

// Manejar el envío del formulario
document.querySelector('.profile-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const gamername = document.getElementById('gamername').value;
    const newPassword = document.getElementById('current-password') ? document.getElementById('current-password').value : "";

    const token = localStorage.getItem('token');

    try {
        const response = await fetch('https://localhost:5001/api/settingsUser/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                GamerName: gamername,
                Password: newPassword,
                Image: profileImageBase64 // envía la imagen en base64
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('¡Perfil actualizado correctamente!');
        } else {
            alert(data.message || 'Error al actualizar el perfil.');
        }
    } catch (error) {
        alert('Error de conexión con el servidor.');
        console.error(error);
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://localhost:7012/api/usuarios';
    const tableBody = document.querySelector('table tbody');
    const panel = document.createElement('div'); // Panel para mostrar información del usuario
    panel.classList.add('user-panel');
    document.body.appendChild(panel);
    document.querySelector('.create-button').addEventListener('click', crearUsuario);

    function fetchUsuarios() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }
                return response.json();
            })
            .then(data => {
                llenarTabla(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function llenarTabla(usuarios) {
        tableBody.innerHTML = '';
        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.gamerName}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.email}</td>
                <td>${usuario.rol}</td>
            `;
            row.addEventListener('click', () => abrirPanel(usuario)); // Agrega evento para abrir el panel
            tableBody.appendChild(row);
        });
    }

    function abrirPanel(usuario) {
        panel.innerHTML = `
            <div class="panel-header">
                <button class="close-panel">X</button>
            </div>
            <div class="panel-content">
                <label>GamerName:</label>
                <input type="text" id="gamerName" value="${usuario.gamerName}" disabled>
                <label>Nombre:</label>
                <input type="text" id="nombre" value="${usuario.nombre}" disabled>
                <label>Apellido:</label>
                <input type="text" id="apellido" value="${usuario.apellido}" disabled>
                <label>Email:</label>
                <input type="text" id="email" value="${usuario.email}" disabled>
                <label>Contraseña:</label>
                <input type="text" id="password" value="Not Available" disabled>
                <label>Rol:</label>
                <input type="text" id="rol" value="${usuario.rol}" disabled>
                <div class="panel-buttons">
                    <button class="edit-button">Editar</button>
                    <button class="delete-button">Eliminar</button>
                </div>
            </div>
        `;
        panel.style.display = 'block';

        // Botón para cerrar el panel
        panel.querySelector('.close-panel').addEventListener('click', cerrarPanel);

        // Botón para editar
        panel.querySelector('.edit-button').addEventListener('click', () => editarUsuario(usuario));

        // Botón para eliminar
        panel.querySelector('.delete-button').addEventListener('click', () => eliminarUsuario(usuario));
    }

    function cerrarPanel() {
        panel.style.display = 'none';
    }

    function crearUsuario(){
        abrirPanel({gamerName: '', nombre: '', apellido: '', email: '', rol:'' })
        const nombreInput = document.getElementById('nombre');
        const apellidoInput = document.getElementById('apellido');
        const gamerNameInput = document.getElementById('gamerName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rolInput = document.getElementById('rol');
        const deleteButton = panel.querySelector('.delete-button');
        const editButton = panel.querySelector('.edit-button');

        nombreInput.disabled = false;
        apellidoInput.disabled = false;
        gamerNameInput.disabled = false;
        emailInput.disabled = false;
        passwordInput.disabled = false;
        rolInput.disabled = false;
        editButton.textContent = 'Guardar';
        deleteButton.disabled = true;


        editButton.replaceWith(editButton.cloneNode(true)); // Reemplaza el botón para eliminar listeners
        const newEditButton = panel.querySelector('.edit-button');
        newEditButton.addEventListener('click', () => guardarNuevoUsuario({
            //idUsuario: "",
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            gamername: gamerNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            rol: rolInput.value
        }));
    }

    function guardarNuevoUsuario(nuevoUsuario) {
        fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al crear el usuario');
                }
                return response.json();
            })
            .then(() => {
                alert('Usuario creado con éxito');
                cerrarPanel();
                fetchUsuarios();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function editarUsuario(usuario) {
        const nombreInput = document.getElementById('nombre');
        const apellidoInput = document.getElementById('apellido');
        const gamerNameInput = document.getElementById('gamerName');
        const emailInput = document.getElementById('email');
        const rolInput = document.getElementById('rol');
        const editButton = panel.querySelector('.edit-button');

        if (editButton.textContent === 'Editar') {
            // Habilitar edición
            nombreInput.disabled = false;
            apellidoInput.disabled = false;
            gamerNameInput.disabled = false;
            emailInput.disabled = false;
            rolInput.disabled = false;
            editButton.textContent = 'Guardar';
        } else {
            // Guardar cambios
            const updatedUsuario = {
                ...usuario,
                nombre: nombreInput.value,
                apellido: apellidoInput.value,
                gamername: gamerNameInput.value,
                email: emailInput.value,
                rol: rolInput.value
            };

            editButton.replaceWith(editButton.cloneNode(true)); // Reemplaza el botón para eliminar listeners
            const newEditButton = panel.querySelector('.edit-button');

            newEditButton.addEventListener('click', () => {
                fetch(`${apiUrl}/${usuario.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedUsuario)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al actualizar el usuario');
                        }
                        return response.ok;
                    })
                    .then(() => {
                        alert('Usuario actualizado con éxito');
                        cerrarPanel();
                        fetchUsuarios(); // Actualiza la tabla
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        }
    }

    function eliminarUsuario(usuario) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            fetch(`${apiUrl}/${usuario.id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el usuario');
                    }
                    alert('Usuario eliminado con éxito');
                    cerrarPanel();
                    fetchUsuarios(); // Actualiza la tabla
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    const usuarios = [
        { id: 1, usuario: 'user1', nombre: 'Juan', apellido: 'Pérez', correo: 'd@gmail', rol:'admin' },
        { id: 2, usuario: 'user2', nombre: 'Ana', apellido: 'García', correo: 'dvewdgmail', rol:'usuario' },
        { id: 3, usuario: 'user3', nombre: 'Luis', apellido: 'Martínez', correo: 'drewrg@gmail', rol:'usuario' },
        { id: 4, usuario: 'user4', nombre: 'María', apellido: 'López', correo: 'bgfbgfd@gmail', rol:'usuario' }
    ];
    fetchUsuarios();
    //llenarTabla(usuarios);
});
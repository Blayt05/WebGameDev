document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://localhost:7141/api/Usuarios';
    const tableBody = document.querySelector('table tbody');
    const panel = document.createElement('div'); // Panel para mostrar información del usuario
    panel.classList.add('user-panel');
    document.body.appendChild(panel);

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
                <td>${usuario.usuario}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
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
                <label>Usuario:</label>
                <input type="text" id="usuario" value="${usuario.usuario}" disabled>
                <label>Nombre:</label>
                <input type="text" id="nombre" value="${usuario.nombre}" disabled>
                <label>Apellido:</label>
                <input type="text" id="apellido" value="${usuario.apellido}" disabled>
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

    function editarUsuario(usuario) {
        const nombreInput = document.getElementById('nombre');
        const apellidoInput = document.getElementById('apellido');
        const editButton = panel.querySelector('.edit-button');

        if (editButton.textContent === 'Editar') {
            // Habilitar edición
            nombreInput.disabled = false;
            apellidoInput.disabled = false;
            editButton.textContent = 'Guardar';
        } else {
            // Guardar cambios
            const updatedUsuario = {
                ...usuario,
                nombre: nombreInput.value,
                apellido: apellidoInput.value
            };

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
                    return response.json();
                })
                .then(() => {
                    alert('Usuario actualizado con éxito');
                    cerrarPanel();
                    fetchUsuarios(); // Actualiza la tabla
                })
                .catch(error => {
                    console.error('Error:', error);
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
        { id: 1, usuario: 'user1', nombre: 'Juan', apellido: 'Pérez' },
        { id: 2, usuario: 'user2', nombre: 'Ana', apellido: 'García' },
        { id: 3, usuario: 'user3', nombre: 'Luis', apellido: 'Martínez' },
        { id: 4, usuario: 'user4', nombre: 'María', apellido: 'López' }
    ];
    //fetchUsuarios();
    llenarTabla(usuarios);
});
async function cargarScoreboard() {
    try {
        const response = await fetch('https://localhost:5001/api/scoreboard');
        const data = await response.json();

        // Generar la tabla
        let html = `
            <table class="scoreboard-table">
                <thead>
                    <tr>
                        <th>Top</th>
                        <th>Nombre</th>
                        <th>Puntos</th>
                        <th>Nivel Máximo</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(item => {
            html += `
                <tr>
                    <td>${item.top}</td>
                    <td>${item.nombre}</td>
                    <td>${item.puntos}</td>
                    <td>${item.nivelMaximo}</td>
                    <td>${item.fecha}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        document.getElementById('scoreboard').innerHTML = html;
    } catch (error) {
        document.getElementById('scoreboard').innerHTML = 'Error al cargar el scoreboard.';
        console.error(error);
    }
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', cargarScoreboard);
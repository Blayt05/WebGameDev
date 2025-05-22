document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".profile-form");
  const profilePicInput = document.getElementById("profile-pic-input");
  const profileImg = document.getElementById("profile-img");

  let base64Image = "";

  // Convertir imagen a base64 cuando se selecciona
  profilePicInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      base64Image = await toBase64(file);
      profileImg.src = URL.createObjectURL(file); // Mostrar imagen cargada
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gamerName = document.getElementById("gamername").value;
    const password = document.getElementById("current-password").value;
    const token = localStorage.getItem("token"); // JWT guardado

    const data = {
      GamerName: gamerName || null,
      Password: password || null,
      Image: base64Image || null
    };
    console.log(JSON.stringify(data));
    try {
      const response = await fetch("https://localhost:5001/api/settingsUser/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Error al actualizar el perfil");

      const result = await response.text();
      alert(result); // Mostrar mensaje del backend
    } catch (error) {
      alert(error.message);
    }
  });
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
}

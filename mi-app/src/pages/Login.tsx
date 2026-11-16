<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Entrar</title>
</head>
<body>
  <div id="login">
    <h1>Iniciar sesión</h1>
    <form id="form-login">
      <label for="usuario">Nombre de usuario:</label><br>
      <input type="text" id="usuario" required><br><br>
      <label for="contrasena">Contraseña:</label><br>
      <input type="password" id="contrasena" required><br><br>
      <button type="submit">Entrar</button>
    </form>
  </div>
  <div id="bienvenida" hidden>
    <h1>Bienvenido</h1>
    <p id="texto"></p>
  </div>
  <script>
    document.getElementById("form-login").addEventListener("submit", function (e) {
      e.preventDefault();
      var usuario = document.getElementById("usuario").value;
      document.getElementById("login").hidden = true;
      document.getElementById("bienvenida").hidden = false;
      document.getElementById("texto").textContent = "Has entrado como " + usuario + ".";
    });
  </script>
</body>
</html>
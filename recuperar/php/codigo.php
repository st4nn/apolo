<?php
   include("variables.php");
   

	include($rutaClaseConexionMySQL); 
   include($rutaClaseSMTP); 

   date_default_timezone_set('America/Bogota');
   $link = Conectar();

   $correo = addslashes($_POST['c']);
   $fecha = date("Y-m-d H:i:s");
 
   $sql = str_replace('_Correo', $correo, $rSQL);
   $result = $link->query($sql);

   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   $idUsuario = 0;

   if ($result->num_rows > 0)
   {
      $idUsuario = $fila['idLogin'];
      $nombre = $fila['Nombre'];
      $codigo = md5($idUsuario . date("Ymd"));
   
      $mensaje = "Buen Día, $nombre
      <br><br>Se ha generado una solicitud para cambio de clave,
      <br>
      <br>Ingresa al sistema <a href='$url'>$nomApp</a> y ahí click en la opción >>Olvidó la Contraseña<< e Ingresar Codigo de Recuperación, 
      <br>en el formulario que se despliega, ingresa el siguiente código: 
      <br><br><strong>$codigo</strong><br>Este código solo será válido durante el día en curso.<br>";

      $msg = EnviarCorreo($correo, "Codigo para cambio de Clave de $nombre", $mensaje) ;

      $sql = "INSERT INTO restaurarClave (idLogin, codigo, fecha) VALUES ($idUsuario, '$codigo', '$fecha') ON DUPLICATE KEY UPDATE codigo = VALUES(codigo), fecha = VALUES(fecha);";
      $link->query($sql);
      if ($msg == "1")
      {
         echo "Se ha enviado el código de restauración al correo $correo";
      } else
      {
         echo "msg";
      }
   } else
   {
      echo "No se encontró la cuenta $correo";
   }
?>
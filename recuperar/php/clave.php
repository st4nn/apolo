<?php
	include("variables.php");
   

   include($rutaClaseConexionMySQL); 
   include($rutaClaseSMTP); 

   date_default_timezone_set('America/Bogota');
   $link = Conectar();

   $Codigo = addslashes($_POST['c1']);
   $Clave = md5(md5(md5(addslashes($_POST['c2']))));
   $Clave2 = md5(md5(md5(addslashes($_POST['c3']))));

   if (strlen($Clave) < 8)
   {
      echo "La clave no cumple los requerimientos de longitud (debe tener por lo menos 8 caracteres)";
   } else
   {
      if ($Clave <> $Clave2)
      {
         echo "Las claves ingresadas no coinciden";
      } else
      {
         $fecha = date("Y-m-d H:i:s");
       
         $sql = "SELECT restaurarClave.idLogin, DatosUsuarios.Nombre, DatosUsuarios.Correo, Login.Usuario
                  FROM 
                     restaurarClave 
                     INNER JOIN DatosUsuarios ON restaurarClave.idLogin = DatosUsuarios.idLogin
                     INNER JOIN Login ON restaurarClave.idLogin = Login.idLogin
                  WHERE restaurarClave.codigo = '$Codigo';";
         $result = $link->query($sql);

         $fila =  $result->fetch_array(MYSQLI_ASSOC);

         $idUsuario = 0;

         if ($result->num_rows > 0)
         {
            $idUsuario = $fila['idLogin'];
            $nombre = $fila['Nombre'];
            $correo = $fila['Correo'];
            $usuario = $fila['Usuario'];
            $codigo = md5($idUsuario . date("Ymd"));
         
            $mensaje = "Buen Día, $nombre
            <br><br>El cambio de clave ha sido exitoso,
            <br>
            <br>Ingresa al sistema <a href='$url'>$nomApp</a> y ahí ingresas tu usuario: <strong>$usuario</strong>, 
            <br>y la clave que acabas de ingresar en el formulario de restauración.
            <br>";

            EnviarCorreo($correo, "Notificación cambio de Clave de $nombre", $mensaje) ;

            $sql = "UPDATE Login SET Clave = '$Clave' WHERE idLogin = '$idUsuario';";
            $link->query($sql);
            echo "La clave de acceso ha sido cambiada, Gracias $nombre";
         } else
         {
            echo "El código no es válido";
         }
      }
   }
?>
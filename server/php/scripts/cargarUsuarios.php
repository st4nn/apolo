<?php
	include("../conectar.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['usuario']);
   $Parametro = addslashes($_POST['Parametro']);
   $idPerfil = 0; 
   if ($idUsuario != 0)
   {
      include("datosUsuario.php"); 
      $Usuario = datosUsuario($idUsuario);
   }
   
   $sql = "SELECT 
            DatosUsuarios.idLogin, 
            DatosUsuarios.Nombre,
            DatosUsuarios.Correo,
            DatosUsuarios.Cargo,
            Perfiles.Nombre AS Perfil,
            Login.Estado AS Estado
         FROM
            DatosUsuarios
            INNER JOIN Perfiles ON DatosUsuarios.idPerfil = Perfiles.idPerfil
            INNER JOIN Login ON DatosUsuarios.idLogin = Login.idLogin
         WHERE
         (
            DatosUsuarios.idLogin LIKE '%$Parametro%'
            OR DatosUsuarios.Nombre LIKE '%$Parametro%'
            OR DatosUsuarios.Correo LIKE '%$Parametro%'
            OR DatosUsuarios.Cargo LIKE '%$Parametro%'
            OR Perfiles.Nombre LIKE '%$Parametro%'
         )";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado[$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>
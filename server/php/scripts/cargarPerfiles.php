<?php
	include("../conectar.php"); 
   
   $idUsuario = addslashes($_POST['usuario']);
   $idPerfil = 0; 
   if ($idUsuario != 0)
   {
      include("datosUsuario.php"); 
      $Usuario = datosUsuario($idUsuario);
      $idPerfil = $Usuario->idPerfil;
   }

   $link = Conectar();

   $sql = "SELECT idPerfil as id, Nombre FROM Perfiles WHERE idPerfil >= " . $idPerfil . ";";
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
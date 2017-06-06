<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];

   include("datosUsuario.php"); 
   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT 
               *
            FROM
               perfiles_nothas_funciones
               INNER JOIN funciones ON funciones.idFuncion = perfiles_nothas_funciones.idFunciones
            WHERE idPerfil = '" . $Usuario->idPerfil . "';";            

   $result = $link->query($sql);
   $idx=0;
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
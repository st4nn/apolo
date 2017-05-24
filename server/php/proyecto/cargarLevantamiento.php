<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idProyecto = $_POST['idProyecto'];
   $sql = "SELECT    
                Levantamiento.Prefijo AS CodInterno,
                Levantamiento.Datos,
                Levantamiento.coordenadas,
                Levantamiento.fecha,
               datosUsuarios.Nombre AS NomCreador
            FROM 
               Levantamiento
               INNER JOIN DatosUsuarios AS datosUsuarios ON datosUsuarios.idLogin = Levantamiento.Usuario
            WHERE Levantamiento.idProyecto = '$idProyecto'
            ORDER BY codPoste;";

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
            $Resultado[$idx][$key] = utf8_encode(str_replace("\n", " ", str_replace("\r"," ",$value)));
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
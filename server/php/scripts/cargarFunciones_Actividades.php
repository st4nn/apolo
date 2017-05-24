<?php
	include("../conectar.php"); 
   $link = Conectar();

   $sql = "SELECT 
            confFunciones.id AS 'idFuncion', 
            confFunciones.Nombre AS nombreFuncion, 
            confActividades.id AS idActividad, 
            confActividades.Nombre AS nombreActividad, 
            confActividades.Unidad AS unidadActividad
         FROM 
            confFunciones 
              INNER JOIN funciones_has_actividades on confFunciones.id = funciones_has_actividades.idFuncion
              INNER JOIN confActividades ON funciones_has_actividades.idActividad = confActividades.id";

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
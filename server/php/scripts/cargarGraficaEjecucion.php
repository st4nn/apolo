<?php
	include("../conectar.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['usuario']);
   $idPerfil = 0; 
   if ($idUsuario != 0)
   {
      include("datosUsuario.php"); 
      $Usuario = datosUsuario($idUsuario);
   }
   if (count($Usuario->Zonas) > 0)
   {
      $Zonas = implode(", ", $Usuario->Zonas);
   } else
   {
      $Zonas = "0";
   }
   
   $sql = "SELECT 
               confZonas.Nombre AS Zona,
               confEstados.Nombre AS Estado,
               COUNT(OT.id) AS Cantidad
            FROM 
               confZonas
               INNER JOIN OT  ON confZonas.id = OT.idZona
               INNER JOIN confEstados ON confEstados.id = OT.idEstado
            WHERE 
               confZonas.id IN ($Zonas) 
               AND OT.idEstado NOT IN (8)
            GROUP BY
               confZonas.Nombre,
               confEstados.Nombre";

   $result = $link->query($sql);

   $idx = 0;
   $resultado = array();
   $zonas = array();
   $estados = array();

   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         /*
         foreach ($row as $key => $value) 
         {
            $Resultado[$idx][$key] = utf8_encode($value);
         }
         $idx++;
         */
         $resultado[utf8_encode($row['Zona'])][utf8_encode($row['Estado'])] = $row['Cantidad'];
         $zonas[utf8_encode($row['Zona'])] = utf8_encode($row['Zona']);
         $estados[utf8_encode($row['Estado'])] = utf8_encode($row['Estado']);;
      }

         $Resultado['Zonas'] = $zonas;
         $Resultado['Estados'] = $estados;
         $Resultado['Resultados'] = $resultado;

         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>
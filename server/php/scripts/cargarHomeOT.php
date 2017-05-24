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
               confZonas.Nombre
            FROM 
               confZonas
            WHERE confZonas.id IN ($Zonas);";

   $result = $link->query($sql);

   $Resultado = array();

   while ($row = mysqli_fetch_assoc($result))
   {
      $Resultado[utf8_encode($row['Nombre'])] = array();
      $Resultado[utf8_encode($row['Nombre'])]['v0']['Cantidad'] = 0;
      $Resultado[utf8_encode($row['Nombre'])]['v0']['id'] = array();
      $Resultado[utf8_encode($row['Nombre'])]['v1']['Cantidad'] = 0;
      $Resultado[utf8_encode($row['Nombre'])]['v1']['id'] = array();
      $Resultado[utf8_encode($row['Nombre'])]['v2']['Cantidad'] = 0;
      $Resultado[utf8_encode($row['Nombre'])]['v2']['id'] = array();
      $Resultado[utf8_encode($row['Nombre'])]['v3']['Cantidad'] = 0;
      $Resultado[utf8_encode($row['Nombre'])]['v3']['id'] = array();
      $Resultado[utf8_encode($row['Nombre'])]['v4']['Cantidad'] = 0;
      $Resultado[utf8_encode($row['Nombre'])]['v4']['id'] = array();
      $Resultado[utf8_encode($row['Nombre'])]['v5']['Cantidad'] = 0;
      $Resultado[utf8_encode($row['Nombre'])]['v5']['id'] = array();
   }

   $sql = "SELECT
               confZonas.Nombre,
               OT.fechaOcen,
               OT_Cronograma.entrega AS fechaVencimiento,
               OT.id
            FROM 
               confZonas
               LEFT JOIN OT ON confZonas.id = OT.idZona
               LEFT JOIN OT_Cronograma ON OT_Cronograma.id = OT.id
            WHERE 
                OT.idZona IN ($Zonas) 
               AND OT.idEstado IN (1, 3, 4);";
               //(OT_Cronograma.entrega IS NULL OR OT_Cronograma.entrega > NOW()) 

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)   
   {
      while ($row = mysqli_fetch_assoc($result))
      {
         if ($row['id'] <> NULL)
         {
            $fecha = $row['fechaVencimiento'];
            $segundos = strtotime($fecha) - strtotime('now');
            $diferencia_horas = intval($segundos/60/60);

            if ($diferencia_horas >= 0 AND $diferencia_horas < 9)
            {
               $Resultado[utf8_encode($row['Nombre'])]['v0']['Cantidad'] = $Resultado[utf8_encode($row['Nombre'])]['v0']['Cantidad'] + 1;
               array_push($Resultado[utf8_encode($row['Nombre'])]['v0']['id'], $row['id']);
            }

            if ($diferencia_horas >= 9 AND $diferencia_horas < 27)
            {
               $Resultado[utf8_encode($row['Nombre'])]['v1']['Cantidad'] = $Resultado[utf8_encode($row['Nombre'])]['v1']['Cantidad'] + 1;
               array_push($Resultado[utf8_encode($row['Nombre'])]['v1']['id'], $row['id']);
            }

            if ($diferencia_horas >= 27)
            {
               $Resultado[utf8_encode($row['Nombre'])]['v2']['Cantidad'] = $Resultado[utf8_encode($row['Nombre'])]['v2']['Cantidad'] + 1;
               array_push($Resultado[utf8_encode($row['Nombre'])]['v2']['id'], $row['id']);
            }


            if ($diferencia_horas < 0 AND $diferencia_horas >= -1)
            {
               $Resultado[utf8_encode($row['Nombre'])]['v3']['Cantidad'] = $Resultado[utf8_encode($row['Nombre'])]['v3']['Cantidad'] + 1;
               array_push($Resultado[utf8_encode($row['Nombre'])]['v3']['id'], $row['id']);
            }

            if ($diferencia_horas < -1 AND $diferencia_horas >= -3)
            {
               $Resultado[utf8_encode($row['Nombre'])]['v4']['Cantidad'] = $Resultado[utf8_encode($row['Nombre'])]['v4']['Cantidad'] + 1;
               array_push($Resultado[utf8_encode($row['Nombre'])]['v4']['id'], $row['id']);
            }

            if ($diferencia_horas < -3)
            {
               $Resultado[utf8_encode($row['Nombre'])]['v5']['Cantidad'] = $Resultado[utf8_encode($row['Nombre'])]['v5']['Cantidad'] + 1;
               array_push($Resultado[utf8_encode($row['Nombre'])]['v5']['id'], $row['id']);
            }
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
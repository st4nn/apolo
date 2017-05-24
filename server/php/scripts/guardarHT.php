<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/correo.php");   

   $link = Conectar();

   $datos = json_decode($_POST['datos']);
   $idLogin = $_POST['usuario'];

   $idOT = "";

   $ids = "";

   foreach ($datos->actividades as $key => $value) 
   {
      $idRelacion = addslashes($value->idRelacion);
      $ids .= $idRelacion . ", ";

      $observaciones = addslashes($value->observaciones);
      $tiempoEstimado = addslashes($value->tiempoEstimado);
      $idResponsable = addslashes($value->idResponsable);
    
      $sql = "UPDATE OT_has_Actividades
                  SET 
                     idResponsable = '$idResponsable',
                     observaciones = '$observaciones',
                     tiempoEstimado = '$tiempoEstimado',
                     idEstado = '2'
                  WHERE
                     id = '$idRelacion'; ";

      
      $link->query(utf8_decode($sql));
      
   }

   if ($ids <> "")
   {
      $ids = substr($ids, 0, -2);

      $sql = "SELECT 
                  OT.id,
                  OT.Codigo,
                  OT.Nombre,
                  confFunciones.Nombre AS Funcion,
                  confActividades.Nombre AS Actividad,
                  DatosUsuarios.Nombre AS Usuario,
                  DatosUsuarios.Correo,
                  OT_has_Actividades.observaciones,
                  OT_has_Actividades.tiempoEstimado
               FROM 
                  OT_has_Actividades
                  INNER JOIN OT ON OT_has_Actividades.idOT = OT.id
                  INNER JOIN confFunciones ON OT_has_Actividades.idFuncion = confFunciones.id
                  INNER JOIN confActividades ON OT_has_Actividades.idActividad = confActividades.id
                  INNER JOIN DatosUsuarios ON OT_has_Actividades.idResponsable = DatosUsuarios.idLogin
               WHERE 
                  OT_has_Actividades.id IN ($ids)
               ORDER BY 
                  DatosUsuarios.Correo;";


      $result = $link->query(utf8_decode($sql));

      $tabla = "";
      $tmpCorreo = "";
      while ($row = mysqli_fetch_assoc($result))
      {
         $idOT = $row['id'];
         if ($tmpCorreo <> $row['Correo'])
         {
            if ($tabla <> "")
            {
               $tabla .= "</tbody></table>";
               $mensaje = "Buen Día, $nombre
                              <br><br>Le han asignado las siguientes actividades dentro de la OT: <strong>" . $otCod . " " . $otNom . "</strong>,
                              <br><br>
                              $tabla";

               EnviarCorreo($tmpCorreo, "HT " . $otCod  , $mensaje);
            }
            $tabla = "<table border='1'><thead><th>Funcion</th><th>Actividad</th><th>Observaciones</th><th>Tiempo Estimado</th></thead><tbody>";
            
            $arrNombre = explode(" ", utf8_encode($row['Usuario']));
            $nombre = $arrNombre[0];
            $tmpCorreo = $row['Correo'];
         }
         
         $tabla .= "<tr>";
         $tabla .= "<td>" . utf8_encode($row['Funcion']) . "</td>";
         $tabla .= "<td>" . utf8_encode($row['Actividad']) . "</td>";
         $tabla .= "<td>" . utf8_encode($row['observaciones']) . "</td>";
         $tabla .= "<td>" . utf8_encode($row['tiempoEstimado']) . "</td>";
         $tabla .= "</tr>";

         $otCod = utf8_encode($row['Codigo']);
         $otNom = utf8_encode($row['Nombre']);
      }
      if ($tabla <> "")
      {
         $tabla .= "</tbody></table>";
         $mensaje = "Buen Día, $nombre
                        <br><br>Le han asignado las siguientes actividades dentro de la OT: <strong>" . $otCod . " " . $otNom . "</strong>,
                        <br><br>
                        $tabla";

         EnviarCorreo($tmpCorreo, "HT " . $otCod  , $mensaje);
      }
      
   }

   if ($idOT <> "")
   {
      $sql = "UPDATE OT SET idEstado = '3' WHERE id = '$idOT'";
      $result = $link->query(utf8_decode($sql));
      
      $obj = json_decode($datos->cronograma);

      $sql = "INSERT INTO OT_Cronograma (
                  id,
                  iniLevantamiento,
                  finLevantamiento,
                  iniDiseno,
                  finDiseno,
                  iniDibujo,
                  finDibujo,
                  iniRevision,
                  finRevision,
                  entrega) 
               VALUES (
               '" . $idOT . "',
                '" . $obj->chkLevantamiento_FechaIni . "',
                '" . $obj->chkLevantamiento_FechaFin . "',
                '" . $obj->chkDiseno_FechaIni . "',
                '" . $obj->chkDiseno_FechaFin . "',
                '" . $obj->chkDibujo_FechaIni . "',
                '" . $obj->chkDibujo_FechaFin . "',
                '" . $obj->chkConsolidacion_FechaIni . "',
                '" . $obj->chkConsolidacion_FechaFin . "',
                '" . $obj->chkEntrega_FechaFin . "')
               ON DUPLICATE KEY UPDATE
                  iniLevantamiento = VALUES(iniLevantamiento),
                  finLevantamiento = VALUES(finLevantamiento),
                  iniDiseno = VALUES(iniDiseno),
                  finDiseno = VALUES(finDiseno),
                  iniDibujo = VALUES(iniDibujo),
                  finDibujo = VALUES(finDibujo),
                  iniRevision = VALUES(iniRevision),
                  finRevision = VALUES(finRevision),
                  entrega = VALUES(entrega);";

      $result = $link->query(utf8_decode($sql));      
   }

   echo 1;
?>
<?php
   include("../conectar.php"); 
   
   $link = Conectar();

   $idActividad = addslashes($_POST['idActividad']);
   $idEstado = addslashes($_POST['idEstado']);
   $usuario = addslashes($_POST['usuario']);

   $Accion = "";

   switch ($idEstado) 
   {
   	case 3:
         $Accion = "Rechazada";
   		break;
   	case 4:
   		$Accion = "Enviada para Aprobación";   		
   		break;
   	case 5:
   		$Accion = "Aprobada";
         break;
   	case 6:
   		$Accion = "Devuelta";
   		break;
   	default:
         $Accion = "";
   		break;
   }
   
   $sql = "SELECT * FROM OT_has_Actividades WHERE id = '$idActividad'";
   $result = $link->query(utf8_decode($sql));
   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   if ( $result->num_rows == 1)
   {
      $idOT = $fila['idOT'];
      $nomActividad = $fila['idActividad'];
      $observacion = "La actividad ha sido " . $Accion;
      
      $sql = "INSERT INTO OT_Notas (idOT, idActividad, idUsuario, Observacion) VALUES ('$idOT', '$nomActividad', '$usuario', '$observacion');";
      $link->query(utf8_decode($sql));


      $sql = "UPDATE OT_has_Actividades SET idEstado = $idEstado WHERE id = '$idActividad'";

      $link->query(utf8_decode($sql));


      $sql = "UPDATE OT SET idEstado = 4 WHERE id IN (
               SELECT 
                  idOT 
               FROM 
                  OT_has_Actividades 
               WHERE 
                  OT_has_Actividades.idEstado IN (2, 3, 4, 5) 
               GROUP BY OT_has_Actividades.idOT) 
                  AND OT.idEstado IN (1, 3)";

      $link->query(utf8_decode($sql));

      $sql = "UPDATE OT SET idEstado = 7 WHERE id IN (
               SELECT 
                  idOT 
               FROM 
                  OT_has_Actividades 
               WHERE 
                  OT_has_Actividades.idEstado <> 3 
               GROUP BY 
                  OT_has_Actividades.idOT 
               HAVING 
                  ((SUM(OT_has_Actividades.idEstado)/5)/COUNT(OT_has_Actividades.id)) = 1) 
            AND OT.idEstado IN (1, 3, 4) ";

      $link->query(utf8_decode($sql));

      echo 1;
   } else
   {
      echo "No se pudo enviar la solicitud, intente nuevamente por favor";
   }
?>
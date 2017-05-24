<?php
   include("../conectar.php"); 
   
   $link = Conectar();

   $idOT = addslashes($_POST['idOT']);
   $idEstado = addslashes($_POST['idEstado']);
   $idLogin = addslashes($_POST['usuario']);

   $Accion = "";
   $AccionVerbo = "";

   switch ($idEstado) 
   {
   	case 8:
		$Accion = "Borrada";
   		$AccionVerbo = "Borrar";   		
   		break;
   	case 2:
		$Accion = "Anulada";
   		$AccionVerbo = "Anular";   		
   		break;
   	case 5:
		$Accion = "Rechazada";
   		$AccionVerbo = "Rechazar";
   	case 5:
		$Accion = "Rechazada";
   		$AccionVerbo = "Rechazar";
   		break;
   	default:
   		break;
   }

   $sql = "UPDATE OT SET idEstado = $idEstado, Codigo = CONCAT('$Accion_', Codigo) WHERE id = '$idOT'";

   $link->query(utf8_decode($sql));

   $sql = "INSERT INTO logOT (idOT, idResponsable, Accion) VALUES ('$idOT', '$idLogin', '$AccionVerbo OT');";
   $link->query(utf8_decode($sql));
   echo 1;
?>
<?php
   include("../conectar.php"); 
   $link = Conectar();

   $usuario = addslashes($_POST['usuario']);
   $idOT = addslashes($_POST['idOT']);
   $idActividad = addslashes($_POST['idActividad']);
   $observacion = addslashes($_POST['observacion']);


   $sql = "INSERT INTO OT_Notas (idOT, idActividad, idUsuario, Observacion) VALUES ('$idOT', '$idActividad', '$usuario', '$observacion');";
   $result = $link->query($sql);
   
   echo 1;
?>
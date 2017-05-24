<?php
	include("../conectar.php"); 
   $link = Conectar();

   
   $idUsuario = addslashes($_POST['usuario']);
   $idOT = addslashes($_POST['idOT']);

   $idPerfil = 0; 
   if ($idUsuario != 0)
   {
      include("datosUsuario.php"); 
      $Usuario = datosUsuario($idUsuario);
   }

   $sql = "SELECT
            OT.*,
            confEstados.Nombre AS Estado
         FROM
            OT
            LEFT JOIN confEstados ON confEstados.id = OT.idEstado
         WHERE
            OT.id = '$idOT';";
            
   
   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array('oT' => array(), 'actividades' => array());
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado['oT'] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado['oT'][$key] = utf8_encode($value);
         }
      }

      $sql = "SELECT OT_has_Actividades.* FROM OT_has_Actividades WHERE idOT = '$idOT';";
         
      $result = $link->query($sql);
      $idx = 0;
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado['actividades'][$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado['actividades'][$idx][$key] = utf8_encode($value);
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
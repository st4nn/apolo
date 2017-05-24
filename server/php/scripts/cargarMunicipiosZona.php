<?php
	include("../conectar.php"); 
   $link = Conectar();

   //if (isset($_POST['datos']))
   //{
      $datos = $_POST['datos'];
      $datos = json_decode($datos['datos']);
   /*
   } else
   {
      $datos = "";
   }
   */

   $where = "";
   if ($datos <> "")
   {
      $where = " WHERE idZona = " . $datos->idZona;
   }

   $sql = "SELECT id, Nombre FROM confMunicipios $where ;" ;
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
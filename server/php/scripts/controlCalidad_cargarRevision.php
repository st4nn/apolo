<?php
	include("../conectar.php"); 
   $link = Conectar();

   $idControl =  addslashes($_POST['idRevision']);
   $idOT =  addslashes($_POST['idOT']);
   $idUsuario = addslashes($_POST['Usuario']);

   if ($idUsuario != 0)
   {
      include("datosUsuario.php"); 
      $Usuario = datosUsuario($idUsuario);
   }
  
      $Resultado = array('controlDeCalidad' => 0, 'controlDeCalidad_Levantamiento' => 0);

         $sql = "SELECT 
               confControlCalidad.*,
               OT_ControlDeCalidad_Items.Valor,
               OT_ControlDeCalidad_Items.Observaciones,
               OT_ControlDeCalidad_Items.Respuesta
            FROM 
               confControlCalidad
               LEFT JOIN OT_ControlDeCalidad_Items ON OT_ControlDeCalidad_Items.idItem = confControlCalidad.id
               LEFT JOIN OT_ControlDeCalidad ON OT_ControlDeCalidad.id = OT_ControlDeCalidad_Items.idControl
            WHERE
               OT_ControlDeCalidad.id = $idControl
            ORDER BY
               confControlCalidad.Tipo, confControlCalidad.id;";
      


         
         $result = $link->query($sql);

         $idx = 0;
         $controlDeCalidad = array();

         if ( $result->num_rows > 0)
         {
            while ($row = mysqli_fetch_assoc($result))
            {
               $controlDeCalidad[$idx] = array();
               foreach ($row as $key => $value) 
               {
                  $controlDeCalidad[$idx][$key] = utf8_encode($value);
               }
               $idx++;
            }
         } 
         
         $Resultado['controlDeCalidad'] = $controlDeCalidad;

         
            $sql = "SELECT 
                  Levantamiento.id,
                  Levantamiento.codPoste,
                  OT_ControlDeCalidad_Levantamiento.Observaciones
               FROM 
                  Levantamiento
                  INNER JOIN OT ON OT.Prefijo = Levantamiento.idProyecto
                  LEFT JOIN OT_ControlDeCalidad_Levantamiento ON OT_ControlDeCalidad_Levantamiento.idLevantamiento = Levantamiento.id
                  LEFT JOIN OT_ControlDeCalidad ON OT_ControlDeCalidad.id = OT_ControlDeCalidad_Levantamiento.idControl AND OT_ControlDeCalidad.id = $idControl
               WHERE 
                  OT.id = '$idOT'
               GROUP BY
                  Levantamiento.id;";

         
         $result = $link->query($sql);

         $idx = 0;
         $controlDeCalidad = array();

         if ( $result->num_rows > 0)
         {
            while ($row = mysqli_fetch_assoc($result))
            {
               $controlDeCalidad[$idx] = array();
               foreach ($row as $key => $value) 
               {
                  $controlDeCalidad[$idx][$key] = utf8_encode($value);
               }
               $idx++;
            }
         } 
         
         $Resultado['controlDeCalidad_Levantamiento'] = $controlDeCalidad;

      mysqli_free_result($result);  
      echo json_encode($Resultado);
   
?>
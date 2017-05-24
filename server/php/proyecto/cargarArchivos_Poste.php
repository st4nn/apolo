<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $codPoste = addslashes($_POST['codPoste']);
   $idProyecto = addslashes($_POST['idProyecto']);

   $Resultado = array('Imagenes' => 0, 'Datos' => 0);


   $sql = " SELECT    
              Levantamiento.Datos
            FROM 
              Levantamiento
            WHERE 
              Levantamiento.idProyecto = '$idProyecto'
              AND Levantamiento.codPoste = '$codPoste'
            ORDER BY Levantamiento.fechaCargue ASC;";

  $result = $link->query($sql);

  $idx = 0;

   if ( $result->num_rows > 0)
   {
      $Resultado['Datos'] = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         foreach ($row as $key => $value) 
         {
            $Resultado['Datos'][$key] = utf8_encode(str_replace("\n", " ", str_replace("\r"," ",$value)));
         }
         $idx++;
      }
      mysqli_free_result($result);
   } 

   $sql = " SELECT    
              levArchivos.Ruta
            FROM 
              levArchivos
            WHERE 
              levArchivos.IdProyecto = '$idProyecto'
              AND levArchivos.idRecurso = '$codPoste'
            ORDER BY levArchivos.fechaCargue ASC;";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado['Imagenes'] = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado['Imagenes'][$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado['Imagenes'][$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
      mysqli_free_result($result);  
   }
  
    echo json_encode($Resultado);
?>
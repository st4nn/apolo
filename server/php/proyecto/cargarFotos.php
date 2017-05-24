<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idProyecto = $_POST['idProyecto'];
   $codPoste = $_POST['codPoste'];
   if ($codPoste <> "")
   {
    $codPoste = " AND idRecurso = '$codPoste'";
   }

   $sql = "SELECT    
                levArchivos.*,
                datosUsuarios.Nombre AS nomUsuario
            FROM 
               levArchivos
               INNER JOIN DatosUsuarios AS datosUsuarios ON datosUsuarios.idLogin = levArchivos.Usuario
            WHERE
              (levArchivos.Ruta LIKE '%.png' OR levArchivos.Ruta LIKE '%.jpg' OR levArchivos.Ruta LIKE '%.jpeg')
              AND levArchivos.IdProyecto = '$idProyecto' $codPoste
            ORDER BY 
              levArchivos.idRecurso, 
              levArchivos.Usuario;";

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
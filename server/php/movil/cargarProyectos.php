<?php
  include("../conectar.php"); 
  //include("datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $fecha = $_POST['fecha'];

   $idPerfil = 0; 
   if ($idUsuario != 0)
   {
      include("../scripts/datosUsuario.php"); 
      $Usuario = datosUsuario($idUsuario);
   }

   if (count($Usuario->Zonas) > 0)
   {
      $Zonas = implode(", ", $Usuario->Zonas);
   } else
   {
      $Zonas = "0";
   }

   $where = "";
   if ($Zonas <> "")
   {
      $where .= " AND OT.idZona IN ($Zonas) ";
   }

   if ($fecha == 'undefined')
   {
    $fecha = '0000-00-00 00:00:00';
   }

   
   $sql = "SELECT    
                OT.id,
                OT.Prefijo AS IdProyecto,
                OT.Nombre,
                CONCAT(OT.Alcance, ' ', OT.Localidad, ' ',  OT.Direccion) AS Descripcion,
                CONCAT(OT.Localidad, ' ',  OT.Direccion) AS Direccion,
                OT.idZona AS idZona,
                1 AS Creador,
                OT.idEstado,
                OT.fechaOcen AS Fecha,
                OT.Codigo,
                1 AS idEmpresa
            FROM 
               OT
            WHERE
              fechaCreacion >= '$fecha'
              AND idEstado <= 3
              $where
            ORDER BY OT.id DESC;";

            $nom = date('YmdHis') .  "_" . $idUsuario . "_";
            $fp = fopen('err_' . $nom . '_data.txt', 'w');
          fwrite($fp, $sql);
          fclose($fp);

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
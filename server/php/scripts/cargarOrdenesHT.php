<?php
	include("../conectar.php"); 
   $link = Conectar();

   
   $idUsuario = addslashes($_POST['usuario']);
   $idPerfil = 0; 
   if ($idUsuario != 0)
   {
      include("datosUsuario.php"); 
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
      $where = " AND OT.idZona IN ($Zonas) ";
   }
   $sql = "SELECT
            OT.id, 
            OT.Codigo,
            OT.codigoRadicado,
            OT.Prioridad,
            confZonas.Nombre AS 'Zona',
            OT.Nombre,
            confMunicipios.Nombre AS 'Municipio',
            OT.Localidad,
            OT.fechaCreacion
         FROM
            OT
               INNER JOIN confMunicipios ON OT.idMunicipio = confMunicipios.id
               INNER JOIN confZonas ON OT.idZona = confZonas.id
         WHERE
            OT.idEstado = 1 
         $where 
         ORDER BY 
            Prioridad, 
            fechaCreacion,
            Municipio
            ";
   
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
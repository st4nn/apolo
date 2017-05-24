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

   $where = "";
   
   if ($Usuario->idPerfil == 5 OR $Usuario->idPerfil == 6 )
   {
      $where = " AND OT_has_Actividades.idResponsable = '$idUsuario' ";
   } else
   {
      $Zonas = implode(", ", $Usuario->Zonas);
      $where .= " AND OT.idZona IN ($Zonas) ";
   }
   
   $sql = "SELECT
            OT.id, 
            OT.Codigo,
            OT.codigoRadicado,
            OT.Nombre,
            OT.Localidad,
            OT.Direccion,
            confZonas.Nombre AS 'Zona',
            OT_Cronograma.entrega AS 'fechaEntrega',
            COUNT(OT_has_Actividades.id) AS Actividades
         FROM
            OT
            INNER JOIN OT_has_Actividades ON OT.id = OT_has_Actividades.idOT
            INNER JOIN confZonas ON OT.idZona = confZonas.id
            INNER JOIN OT_Cronograma ON OT_Cronograma.id = OT.id
         WHERE
            OT.idEstado IN (3, 4)
            $where
         GROUP BY
            OT.id, 
            OT.Codigo,
            OT.codigoRadicado,
            OT.Nombre,
            OT.Localidad,
            OT.Direccion,
            confZonas.Nombre,
            OT_Cronograma.entrega
         ORDER BY
            OT_Cronograma.entrega;";
            
   
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
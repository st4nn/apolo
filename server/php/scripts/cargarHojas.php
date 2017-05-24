<?php
	include("../conectar.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['usuario']);
   $Parametro = addslashes($_POST['Parametro']);
   $fechaFin = addslashes($_POST['fechaFin']);
   $fechaIni = addslashes($_POST['fechaIni']);
   $Estado = 0;

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
      $where .= " AND OT.idZona IN ($Zonas) ";
   }
   if ($Usuario->idPerfil == 5 || $Usuario->idPerfil == 6)
   {
      $where .= " AND OT_has_Actividades.idResponsable = '" . $idUsuario . "' ";
   }
   if ($fechaIni <> "")
   {
      $where .= " AND OT.fechaCreacion >= '$fechaIni 00:00:00' ";
   }
   if ($fechaFin <> "")
   {
      $where .= " AND OT.fechaCreacion <= '$fechaFin 23:59:59' ";
   }

   if ($Estado > 0)
   {
      $where .= " AND OT.idEstado = '$Estado' ";
   }
   $sql = "SELECT
            OT_has_Actividades.idOT,
            OT.Codigo,
            OT.codigoRadicado,
            OT.Nombre,
            confZonas.Nombre AS Zona,
            confMunicipios.Nombre AS Municipio,
            confEstados.Nombre AS Estado,
            DatosUsuarios.Nombre AS Usuario,
            COUNT(OT_has_Actividades.idActividad) AS Actividades,
            SUM(OT_has_Actividades.tiempoEstimado) AS tiempoEstimado,
            OT_Cronograma.entrega
         FROM
            OT_has_Actividades
            INNER JOIN OT ON OT_has_Actividades.idOT = OT.id
            INNER JOIN confEstados ON OT.idEstado = confEstados.id
            INNER JOIN confZonas ON OT.idZona = confZonas.id
            INNER JOIN confMunicipios ON OT.idMunicipio = confMunicipios.id
            LEFT JOIN DatosUsuarios ON OT_has_Actividades.idResponsable = DatosUsuarios.idLogin
            LEFT JOIN OT_Cronograma ON OT_Cronograma.id = OT_has_Actividades.idOT
         WHERE
            (OT.id LIKE '%$Parametro%'
            OR OT.Codigo LIKE '%$Parametro%'
            OR OT.Nombre LIKE '%$Parametro%'
            OR confZonas.Nombre LIKE '%$Parametro%'
            OR confMunicipios.Nombre LIKE '%$Parametro%'
            OR OT.Alcance LIKE '%$Parametro%'
            OR OT.fechaCreacion LIKE '%$Parametro%'
            OR OT.Prioridad LIKE '%$Parametro%'
            OR OT.Localidad LIKE '%$Parametro%'
            OR OT.codigoRadicado LIKE '%$Parametro%'
            OR OT.contactoNombre LIKE '%$Parametro%'
            OR OT.contactoTelefono LIKE '%$Parametro%'
            OR OT.Direccion LIKE '%$Parametro%')
            AND OT.idEstado <> 8 
            $where
         GROUP BY 
            idOT,
            idResponsable;";
            
   
   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         if (!isset($Resultado[$row['idOT']]))
         {
            $Resultado[$row['idOT']] = array();
         }
         if (!isset($Resultado[$row['idOT']]['Usuarios']))
         {
            $Resultado[$row['idOT']]['Usuarios'] = array();
         }

         $arrUsuario = array('Usuario' => utf8_encode($row['Usuario']), 'Actividad' => utf8_encode($row['Actividades']), 'tiempo' => utf8_encode($row['tiempoEstimado']));

         array_push($Resultado[$row['idOT']]['Usuarios'], $arrUsuario);

         foreach ($row as $key => $value) 
         {
            $Resultado[$row['idOT']][$key] = utf8_encode($value);
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
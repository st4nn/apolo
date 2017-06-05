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

   $tiposProyecto = $arrayName = array(
      '' => 'Sin Clasificar',
      'P1' => 'Proyecto Tipo 1',
      'P2' => 'Proyecto Tipo 2',
      'P3' => 'Proyecto Tipo 3',
      'P4' => 'Proyecto Tipo 4',
      'P5' => 'Proyecto Tipo 5',
      'P6' => 'Proyecto Combinado',
      'P7' => 'Sin Selección'
      );

   $tiposProyectoDesc = $arrayName = array(
      '' => 'Sin Clasificar',
      'P1_1' => 'Red BT nueva < 300m',
      'P1_2' => 'Cambio calibre red BT por TR',
      'P2_1' => 'Diseño TR tipo poste en poste existente',
      'P3_1' => 'Extensión de red aerea o subterranea MT y/o BT < 300 m con TR tipo Poste',
      'P4_1' => 'SE interior < 500 kVA con diseño SPT',
      'P4_2' => 'Extensión de red aerea o subterranea MT y/o BT < 300 m con TR tipo Poste',
      'P5_1' => 'Redes aereas o subterraneas MT y/o BT > 3 Km con TR tipo poste',
      'P5_2' => 'SE interior > 500 kVA con SPT y extensión de red MT y/o BT',
      'P5_3' => 'Instalaciones internas < 500 m2',
      'P5_4' => 'Proyecto de arquitectura de RED (IAR)',
      'P5_5' => 'Proyectos del plan de calidad y estabilización de circuitos',
      'P6_1' => 'Proyecto Combinado',
      'P7_1' => 'Sin Selección');
   
   $sql = "SELECT
            OT.id, 
            OT.Codigo,
            OT.codigoRadicado,
            OT.Nombre,
            confZonas.Nombre AS 'Zona',
            confMunicipios.Nombre AS 'Municipio',
            confEstados.Nombre AS 'Estado',
            OT.tipoProyecto,
            OT.Alcance,
            OT.fechaCreacion,
            OT.Prioridad,
            getFechaCumplimiento(OT.id) AS fechaCumplimiento
         FROM
            OT
            INNER JOIN OT_has_Actividades ON OT.id = OT_has_Actividades.idOT
            INNER JOIN confZonas ON OT.idZona = confZonas.id
            INNER JOIN OT_Cronograma ON OT_Cronograma.id = OT.id
            INNER JOIN confMunicipios ON OT.idMunicipio = confMunicipios.id
            INNER JOIN confEstados ON OT.idEstado = confEstados.id
         WHERE
            OT.idEstado IN (3, 4)
            $where
         GROUP BY
            OT.id
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
            if ($key == "tipoProyecto")
            {
               $arrTipoProyecto = explode("_", $value);
               if (count($arrTipoProyecto) > 1)
               {
                  $Resultado[$idx][$key] = $tiposProyecto[$arrTipoProyecto[0]];
                  $Resultado[$idx]['tipoProyectoDesc'] = $tiposProyectoDesc[$value];
               } else
               {
                  $Resultado[$idx][$key] = $tiposProyecto["P7"];
                  $Resultado[$idx]['tipoProyectoDesc'] = $tiposProyectoDesc["P7_1"];
               }

            }
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
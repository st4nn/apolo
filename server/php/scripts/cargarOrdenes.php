<?php
	include("../conectar.php"); 
   $link = Conectar();

   
   $idUsuario = addslashes($_POST['usuario']);
   $Parametro = addslashes($_POST['Parametro']);
   $fechaFin = addslashes($_POST['fechaFin']);
   $fechaIni = addslashes($_POST['fechaIni']);
   $fechaFinCump = addslashes($_POST['fechaFinCump']);
   $fechaIniCump = addslashes($_POST['fechaIniCump']);
   $Estado = addslashes($_POST['Estado']);

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
      $where .= " AND OT.idZona IN ($Zonas) ";
   }

   if ($fechaIni <> "")
   {
      $where .= " AND fechaCreacion >= '$fechaIni 00:00:00' ";
   }
   if ($fechaFin <> "")
   {
      $where .= " AND fechaCreacion <= '$fechaFin 23:59:59' ";
   }

   if ($Estado <> 0)
   {
      $where .= " AND OT.idEstado IN ($Estado) ";
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
            INNER JOIN confMunicipios ON OT.idMunicipio = confMunicipios.id
            INNER JOIN confZonas ON OT.idZona = confZonas.id
            INNER JOIN confEstados ON OT.idEstado = confEstados.id
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
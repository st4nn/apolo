<?php
	include("../conectar.php"); 
   $link = Conectar();

   $idOT =  addslashes($_POST['idOT']);
   $idUsuario = addslashes($_POST['usuario']);
   $propia  = isset($_POST['propia']) ? $_POST['propia'] : false;

   if ($idUsuario != 0)
   {
      include("datosUsuario.php"); 
      $Usuario = datosUsuario($idUsuario);
   }
   $where = "";

   /*
   if ($propia == "true")
   {
      $where = " AND OT_has_Actividades.idResponsable = '$idUsuario' ";
   }
   */

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
            OT.Prefijo,
            OT.Codigo,
            OT.codigoRadicado,
            OT.Nombre,
            OT.Alcance,
            confZonas.id AS idZona,
            confZonas.Nombre AS Zona,
            confMunicipios.Nombre AS Municipio,
            OT.Localidad,
            OT.tiempo AS TiempoDeEntrega,
            OT.Prioridad,
            OT.contactoNombre,
            OT.contactoTelefono,
            OT.Direccion
         FROM
            OT
               INNER JOIN confZonas ON confZonas.id = OT.idZona
               INNER JOIN confMunicipios ON confMunicipios.id = OT.idMunicipio
         WHERE 
            OT.id = $idOT;";

   $result = $link->query($sql);

   if ( $result->num_rows > 0)
   {
      $Resultado = array('actividades' => 0, 'oT' => 0, 'cronograma' => 0, 'notas' => 0, 'controlDeCalidad' => 0, 'controlDeCalidad_historico' => 0, 'controlDeCalidad_Levantamiento' => 0);

      $oT = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         foreach ($row as $key => $value) 
         {
            $oT[$key] = utf8_encode($value);
         }
      }

      $Resultado['oT'] = $oT;
      
      $sql = "SELECT 
               OT_has_Actividades.id,
               OT_has_Actividades.idFuncion,
               OT_has_Actividades.idActividad,
               OT_has_Actividades.idResponsable,
               OT_has_Actividades.observaciones,
               OT_has_Actividades.tiempoEstimado,
               OT_has_Actividades.fechaAsignacion,
               OT_has_Actividades.idEstado,
               confEstadosActividades.Nombre AS 'Estado',
               confFunciones.Nombre AS 'Funcion' ,
               confActividades.Nombre AS 'Actividad',
               DatosUsuarios.Nombre AS 'NomResponsable'
            FROM  
               OT_has_Actividades
                  INNER JOIN confFunciones ON confFunciones.id = OT_has_Actividades.idFuncion
                  INNER JOIN confActividades ON confActividades.id = OT_has_Actividades.idActividad
                  INNER JOIN confEstadosActividades ON confEstadosActividades.id = OT_has_Actividades.idEstado
                  INNER JOIN OT ON OT_has_Actividades.idOT = OT.id 
                  LEFT JOIN DatosUsuarios ON OT_has_Actividades.idResponsable = DatosUsuarios.idLogin
            WHERE idOt = '$idOT' $where
            ORDER BY OT_has_Actividades.idEstado DESC, OT_has_Actividades.fechaAsignacion;";
      
      $result = $link->query($sql);

      $idx = 0;
      $Actividades = array();

      if ( $result->num_rows > 0)
      {
         while ($row = mysqli_fetch_assoc($result))
         {
            $Actividades[$idx] = array();
            foreach ($row as $key => $value) 
            {
               $Actividades[$idx][$key] = utf8_encode($value);
            }
            $idx++;
         }
      } else
      {
         //echo 0;
      }
      
      $Resultado['actividades'] = $Actividades;

      $sql = "SELECT 
               DatosUsuarios.idLogin AS 'id' ,
               DatosUsuarios.Nombre AS 'Nombre' 
            FROM  
               DatosUsuarios
               INNER JOIN login_has_zonas ON login_has_zonas.idLogin = DatosUsuarios.idLogin
               INNER JOIN Perfiles ON Perfiles.idPerfil = DatosUsuarios.idPerfil
            WHERE 
               login_has_zonas.idZona = " . $oT['idZona'] . "
               AND Perfiles.Orden >= " . $Usuario->idPerfil_Orden . "
            ORDER BY DatosUsuarios.idPerfil DESC;";
      
      $result = $link->query($sql);

      $idx = 0;
      $Usuarios = array();

      if ( $result->num_rows > 0)
      {
         while ($row = mysqli_fetch_assoc($result))
         {
            $Usuarios[$idx] = array();
            foreach ($row as $key => $value) 
            {
               $Usuarios[$idx][$key] = utf8_encode($value);
            }
            $idx++;
         }
      } 
      
      $Resultado['Usuarios'] = $Usuarios;

      $sql = "SELECT * FROM OT_Cronograma WHERE id = '$idOT'";;
      $result = $link->query($sql);

      $cronograma = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         foreach ($row as $key => $value) 
         {
            $cronograma[$key] = utf8_encode($value);
         }
      }

      $Resultado['cronograma'] = $cronograma;

      $numRevision = 0;
      $idControl = 'NULL';

      $sql = "SELECT max(id) AS id, max(Revision) AS Revision FROM OT_ControlDeCalidad WHERE idProyecto = '$idOT'";
      $result = $link->query($sql);
      $fila =  $result->fetch_array(MYSQLI_ASSOC);

      if ($fila['Revision'] > 0)
      {
         $numRevision = $fila['Revision'];
         $idControl = $fila['id'];
      }

      $sql = "SELECT 
               confControlCalidad.*,
               'NA' AS Valor,
               '' AS Observaciones,
               '' AS Respuesta
            FROM 
               confControlCalidad
            ORDER BY
               confControlCalidad.Tipo, confControlCalidad.id;";

      if ($idControl <> 'NULL')
      {
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

      }


         
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
         } else
         {
            //echo 0;
         }
         
         $Resultado['controlDeCalidad'] = $controlDeCalidad;

         $sql = "SELECT 
               OT_ControlDeCalidad.*,
               DatosUsuarios.Nombre AS Usuario
            FROM 
               OT_ControlDeCalidad
               INNER JOIN DatosUsuarios ON OT_ControlDeCalidad.idUsuario = DatosUsuarios.idLogin
            WHERE
               OT_ControlDeCalidad.idProyecto = '$idOT'
            ORDER BY
               OT_ControlDeCalidad.fechaCargue DESC;";
         
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
         
         $Resultado['controlDeCalidad_historico'] = $controlDeCalidad;

         $sql = "SELECT 
                  Levantamiento.id,
                  Levantamiento.codPoste,
                  '' AS Observaciones
               FROM 
                  Levantamiento
                  INNER JOIN OT ON OT.Prefijo = Levantamiento.idProyecto
               WHERE 
                  OT.id = '$idOT'
               ORDER BY
                  Levantamiento.codPoste;";

         if ($idControl<> 'NULL')
         {
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
               ORDER BY
                  Levantamiento.codPoste;";
            
         }

         
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

      $sql = "SELECT 
                  OT_Notas.*,
                  DatosUsuarios.Nombre AS 'Usuario'
               FROM 
                  OT_Notas
                  INNER JOIN DatosUsuarios ON DatosUsuarios.idLogin = OT_Notas.idUsuario
               WHERE 
                  idOT = '$idOT'
               ORDER BY 
                  OT_Notas.fecha DESC;";

      $result = $link->query($sql);

      $notas = array();
      $idxNotas = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         foreach ($row as $key => $value) 
         {
            if (!isset($notas[$row['idActividad']]))
            {
               $notas[$row['idActividad']] = array();
               $idxNotas[$row['idActividad']] = 0;
            }
            $notas[$row['idActividad']][$idxNotas[$row['idActividad']]][$key] = utf8_encode($value);
         }
         $idxNotas[$row['idActividad']] = $idxNotas[$row['idActividad']] + 1;
      }

      $Resultado['notas'] = $notas;
      
      mysqli_free_result($result);  
      echo json_encode($Resultado);
   }
?>
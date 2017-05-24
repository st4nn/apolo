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
      $Resultado = array('actividades', 'oT', 'cronograma', 'notas');

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
            ORDER BY confFunciones.id;";
      
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
            WHERE 
               login_has_zonas.idZona = " . $oT['idZona'] . "
               AND DatosUsuarios.idPerfil >= " . $Usuario->idPerfil . "
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
      } else
      {
         //echo 0;
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
   } else
   {
      //echo 0;
   }

?>
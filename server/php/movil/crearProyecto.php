<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/correo.php");
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = $_POST['datos'];

  if (array_key_exists("Fecha", $datos))
  {
    $fecha = $datos['Fecha'];

    $totPostes = 0;
    $totFotos = 0;

    if (array_key_exists("Fotos", $datos))
    {
      $totFotos = $datos['Fotos'];
    }

    if (array_key_exists("Postes", $datos))
    {
      $totPostes = $datos['Postes']; 
    }

    if ($fecha == "")
    {
      $fecha = date('Y-m-d H:i:s');
    }

    $sql = "INSERT INTO OT(Prefijo, idZona, Direccion, Nombre, Alcance, idEstado, fechaCreacion)  
    VALUES (
    '" . addslashes($datos['idProyecto']) . "', 
    '7',
    '" . addslashes($datos['idZona']) . "', 
    '" . addslashes($datos['Nombre']) . "', 
    '" . addslashes($datos['Descripcion']) . "', 
    '" . addslashes($datos['idEstado']) . "', 
    '" . $fecha . "')
    ON DUPLICATE KEY UPDATE
    idEstado = VALUES(idEstado),
    fechaCreacion = VALUES(fechaCreacion);";

    $result = $link->query(utf8_decode($sql));

    if ( $result <> false)
    {
      echo 1;
      
      $sql = "SELECT 
                  OT.idZona,
                  OT.id,
                  OT.Prefijo,
                  OT.Nombre,
                  OT.Codigo,
                  OT.Alcance,
                  OT.Localidad,
                  OT.Direccion
                FROM 
                  OT
                WHERE 
                  OT.Prefijo = '" . $datos['idProyecto'] . "';";

      $result = $link->query($sql);
      $fila =  $result->fetch_array(MYSQLI_ASSOC);

      $idZona = $fila['idZona'];
      
      if ($datos['idEstado'] == 4)
      {
        $sql = "SELECT 
                  datosUsuarios.idLogin,
                  datosUsuarios.Nombre,
                  datosUsuarios.Correo
                FROM 
                  DatosUsuarios AS datosUsuarios 
                  INNER JOIN login_has_zonas ON login_has_zonas.idLogin = DatosUsuarios.idLogin
                WHERE 
                  datosUsuarios.idPerfil = 5
                  AND login_has_zonas.idZona = '" . $idZona . "';";

        $result = $link->query($sql);
        
        $Nombres = "";
        $Correos = "";
        $idLogin = 1;
        while ($row = mysqli_fetch_assoc($result))
        {
          $Correos .= $row['Correo']. ", ";
        }

        $Correos = substr($Correos, 0, -2);

        $Correos .= ', jhonathan.espinosa@wsp.com';

        $mensaje = "Buen Día 
               <br><br>Se ha terminado el Levantamiento en un Proyecto,
               <br>
               Los datos del proyecto son:
               <br><br>
               <table style='border:none;'>
                  <tr>
                     <small><strong>Codigo Interno: </strong></small></td><td>" . $fila['id'] . " o " . $fila['Prefijo'] . "</td>
                  </tr>
                  <tr>
                     <td><small><strong>Codigo de la Obra: </strong></small></td><td>" . $fila['Codigo'] . "</td>
                  </tr>
                  <tr>
                     <td><small><strong>Nombre: </strong></small></td><td>" . $fila['Nombre'] . "</td>
                  </tr>
                  <tr>
                     <td><small><strong>Descripción: </strong></small></td><td>" . $fila['Alcance'] . "</td>
                  </tr>
                  <tr>
                     <td><small><strong>Ubicación: </strong></small></td><td>" . $fila['Localidad'] . " " . $fila['Direccion'] . " </td>
                  </tr>
               </table>
               <br><br> Por favor <a href='https://apolo.wspcolombia.com/'>ingrese al Sistema</a> para ubicarlo con los datos anteriores</a>";

               $obj = EnviarCorreo($Correos, "Levantamiento Terminado", $mensaje);

        $sql = "UPDATE OT SET idEstado = '9' WHERE Prefijo = '" . $datos['idProyecto'] . "';";
        $result = $link->query($sql);

        /*$sql = "INSERT INTO Asignaciones (idProyecto, estadoAnterior, estadoNuevo, responsableAnterior, responsableNuevo) VALUES 
        ('" . $datos['idProyecto'] . "',
        '3',
        '4',
        '" . $idResponsable . "',
        '" . $idLogin . "');";
        $result = $link->query($sql);*/
      } else
      {
        /*$sql = "INSERT INTO Asignaciones (idProyecto, estadoAnterior, estadoNuevo, responsableAnterior, responsableNuevo) VALUES 
        ('" . $datos['idProyecto'] . "',
        '3',
        '" . $datos['idEstado'] . "',
        '" . $idResponsable . "',
        '" . $idLogin . "');";
        $result = $link->query($sql);
        */
      }
    } else
    {
      echo 0;
    }
  } else
  {
    echo 0;
  }


?>
<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/correo.php"); 
   
   $link = Conectar();

   $datos = json_decode($_POST['datos']);
   $idLogin = $_POST['idLogin'];

   $Nombre = addslashes($datos->Nombre);
   $Codigo = addslashes($datos->Codigo);
   $codigoRadicado = addslashes($datos->RadicadoCodigo);
   $fechaRadicado = addslashes($datos->RadicadoFecha);
   $horaRadicado = addslashes($datos->RadicadoHora);
   $Prefijo = addslashes($datos->Prefijo);
   $Alcance = addslashes($datos->Alcance);
   $Zona = addslashes($datos->Zona);
   $Municipio = addslashes($datos->Municipio);
   $Localidad = addslashes($datos->Localidad);
   $Prioridad = addslashes($datos->Prioridad);
   $Actividades = addslashes($datos->Funciones);
   $Tiempo = addslashes($datos->Tiempo);
   $tipoProyecto = addslashes($datos->tipoProyecto);
   $tipoProyecto = addslashes($datos->tipoProyecto);
   $Recibo = addslashes($datos->Recibo);
   $Emision = addslashes($datos->Emision);
   $fechaOcen = addslashes($datos->fechaOcen);
   $horaOcen = addslashes($datos->horaOcen);
   $requiereLevantamiento = addslashes($datos->requiereLevantamiento);

   $fechaOcen = $fechaOcen . " " . $horaOcen;

   $contactoNombre = addslashes($datos->ContactoNombre);
   $contactoDireccion = addslashes($datos->ContactoDireccion);
   $contactoTelefono = addslashes($datos->ContactoTelefono);

   $fechaRadicado = $fechaRadicado . " " . $horaRadicado;

   if ($Codigo == "")
   {
      $Codigo = $Prefijo;
   }

   if ($codigoRadicado == "")
   {
      $codigoRadicado = $Prefijo;
   }
   
   
 
   $sql = "INSERT INTO OT 
               (Nombre, Prefijo, Codigo, Alcance, Prioridad, idZona, idMunicipio, Localidad, tiempo, tipoProyecto, recibo, emision, fechaOcen, codigoRadicado, fechaRadicado, contactoNombre, contactoTelefono, Direccion, requiereLevantamiento) 
            VALUES 
               (
                  '$Nombre',
                  '$Prefijo',
                  '$Codigo',
                  '$Alcance',
                  '$Prioridad',
                  '$Zona',
                  '$Municipio',
                  '$Localidad',
                  '$Tiempo',
                  '$tipoProyecto',
                  '$Recibo',
                  '$Emision',
                  '$fechaOcen',
                  '$codigoRadicado',
                  '$fechaRadicado',
                  '$contactoNombre',
                  '$contactoTelefono',
                  '$contactoDireccion', 
                  'requiereLevantamiento');";

   $link->query(utf8_decode($sql));
   if ( $link->affected_rows > 0)
   {
      $nuevoId = $link->insert_id;
      if ($nuevoId > 0)
      {
         $arrActividades = explode(",", $Actividades);
         $valActividades = "";
         foreach ($arrActividades as $key => $value) 
         {
            if ($value <> "")
            {
               $tmpActividad = explode("_", $value);
               $valActividades .= "($nuevoId, " . $tmpActividad[0] . ", '" . $tmpActividad[1] . "'), ";
            }
         }
         $valActividades = substr($valActividades, 0, -2);

         echo $link->error . " " .$nuevoId;   
         
         $sql = "INSERT INTO OT_has_Actividades (idOT, idFuncion, idActividad) 
                  VALUES " . $valActividades;
            
            $link->query(utf8_decode($sql));
            
            $sql = "INSERT INTO logOT (idOT, idResponsable, Accion) VALUES ($nuevoId, $idLogin, 'Creación de OT');";
            $link->query(utf8_decode($sql));

            $sql = "SELECT 
                     DatosUsuarios.Correo
                  FROM
                     DatosUsuarios
                     INNER JOIN login_has_zonas ON login_has_zonas.idLogin = DatosUsuarios.idLogin
                  WHERE 
                     DatosUsuarios.idPerfil = 4
                     AND login_has_zonas.idZona = '$Zona';";

            $result = $link->query(utf8_decode($sql));

            
            $zonaSinCoordinador = '';

            if ($result->num_rows == 0)
            {
               $sql = "SELECT 
                     DatosUsuarios.Correo
                  FROM
                     DatosUsuarios
                     INNER JOIN login_has_zonas ON login_has_zonas.idLogin = DatosUsuarios.idLogin
                  WHERE 
                     DatosUsuarios.idPerfil = 3;";

               $result = $link->query(utf8_decode($sql));    

               $zonaSinCoordinador = '<br><br>Este mensaje le ha llegado porque la zona en la que se creó la OT no tiene un coordinador';
            }

            $Correos = "";

            while ($row = mysqli_fetch_assoc($result))
            {
               $Correos .= $row['Correo']. ", ";
            }

            $Correos = substr($Correos, 0, -2);

            $mensaje = "Buen Día, 
            <br>Se ha creado una Orden de Trabajo,
            <br><br>
            Los datos de la OT son:
            <br><br>
            <table>
               <tr>
                  <td>Consecutivo:</td>
                  <td>" . $nuevoId . "</td>
               </tr>
               <tr>
                  <td>Nombre:</td>
                  <td>" . $Nombre . "</td>
               </tr>
               <tr>
                  <td>Código:</td>
                  <td>" . $Codigo . "</td>
               </tr>
               <tr>
                  <td>Localidad:</td>
                  <td>" . $Localidad . "</td>
               </tr>
               <tr>
                  <td>Fecha de Radicado:</td>
                  <td>" . $fechaRadicado . "</td>
               </tr>                  
            </table>
            <br><br>
            <p>Por favor ingrese al Sistema <a href='http://apolo.wspcolombia.com'>Apolo</a> para diligenciarle una hoja de trabajo</p>";

            $mensaje .= $zonaSinCoordinador;

            EnviarCorreo("$Destinatario", "Creación de OT", $mensaje)
      } else
      {
         echo "Hubo un error desconocido " . $link->error;
      }
   } else
   {
      if ($link->errno == 1452) //Llave Foranea por Zona,
      {
         echo "No ha seleccionado una zona válida";
      }
      elseif ($link->errno == 1062)
      {
         echo "El codigo Ingresado ya existe, ingrese otro e intente nuevamente por favor";
      } else
      {
         echo "Hubo un error desconocido" . $link->error;
      }
   }




?>
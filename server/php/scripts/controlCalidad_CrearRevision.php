<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/correo.php"); 
   
   $link = Conectar();

   $Items = json_decode($_POST['Items']);
   $Levantamiento = json_decode($_POST['Levantamiento']);
   $Usuario = addslashes($_POST['Usuario']);
   $Revision = addslashes($_POST['revision']);
   $idProyecto = addslashes($_POST['idProyecto']);

   $Resultado = '1';

   foreach ($Items as $index => $val) 
   {
      foreach ($val as $key => $value) 
      {
         $val->$key = addslashes($value);
      }

      if ($val->Valor == 'NO')
      {
         $Resultado = '0';
      }
   }

   foreach ($Levantamiento as $index => $val) 
   {
      foreach ($val as $key => $value) 
      {
         $val->$key = addslashes($value);
      }
   }

   $sql = "INSERT INTO OT_ControlDeCalidad(idUsuario, idProyecto, Revision, Resultado) VALUES  
               (
                  '$Usuario',
                  '$idProyecto',
                  '$Revision',
                  '$Resultado'
               );";

   $Respuesta = array('Error' => '', 'id' => 0, 'Resultado' => 0);

   $link->query(utf8_decode($sql));

   if ( $link->affected_rows > 0)
   {
      $nuevoId = $link->insert_id;
      if ($nuevoId > 0)
      {  
         $values = '';

         foreach ($Items as $index => $val) 
         {
            $values .= "('" . $nuevoId . "', 
                        '" . $val->idItem . "', 
                        '" . $val->Valor . "', 
                        '" . $val->Observaciones . "', 
                        '" . $val->Respuesta . "'), ";
         }

         $values = substr($values, 0, -2);


         $sql = "INSERT INTO OT_ControlDeCalidad_Items (idControl, idItem, Valor, Observaciones, Respuesta) VALUES " . $values . ";";
         $link->query(utf8_decode($sql));

         

         $values = '';

         foreach ($Levantamiento as $index => $val) 
         {
            $values .= "('" . $nuevoId . "', 
                        '" . $val->idLevantamiento . "', 
                        '" . $val->Observaciones . "'), ";
         }

         $values = substr($values, 0, -2);
            
            $sql = "INSERT INTO OT_ControlDeCalidad_Levantamiento (idControl, idLevantamiento, Observaciones) VALUES " . $values . ";";
            $link->query(utf8_decode($sql));

            $Respuesta['id'] = $nuevoId;
            $Respuesta['Resultado'] = $Resultado;

         /*
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

            EnviarCorreo($Correos, "Creación de OT", $mensaje);
            */
      } else
      {
         $Respuesta['Error'] =  "Hubo un error desconocido " . $link->error;
      }
   } else
   {
      $Respuesta['Error'] = "Hubo un error desconocido " . $link->error;
   }

   echo json_encode($Respuesta);
   
?>
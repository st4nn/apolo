<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/correo.php");  
   $link = Conectar();

   $datos = json_decode($_POST['datos']);
   $idLogin = $_POST['idLogin'];

   $nuevoId = addslashes($datos->idOt); 

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
   $ActividadesNuevas = addslashes($datos->FuncionesNuevas);
   $ActividadesBorradas = addslashes($datos->FuncionesBorradas);

   $Tiempo = addslashes($datos->Tiempo);
   $tipoProyecto = addslashes($datos->tipoProyecto);
   $tipoProyecto = addslashes($datos->tipoProyecto);
   $Recibo = addslashes($datos->Recibo);
   $Emision = addslashes($datos->Emision);
   $fechaOcen = addslashes($datos->fechaOcen);
   $horaOcen = addslashes($datos->horaOcen);

   $contactoNombre = addslashes($datos->ContactoNombre);
   $contactoDireccion = addslashes($datos->ContactoDireccion);
   $contactoTelefono = addslashes($datos->ContactoTelefono);

   $fechaOcen = $fechaOcen . " " . $horaOcen;
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
               (id, Nombre, Prefijo, Codigo, Alcance, Prioridad, idZona, idMunicipio, Localidad, tiempo, tipoProyecto, recibo, emision, fechaOcen, codigoRadicado, fechaRadicado, contactoNombre, contactoTelefono, Direccion) 
            VALUES 
               (
                  '$nuevoId',
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
                  '$contactoDireccion')
            ON DUPLICATE KEY UPDATE 
               Nombre = VALUES(Nombre),
               Prefijo = VALUES(Prefijo),
               Codigo = VALUES(Codigo),
               Alcance = VALUES(Alcance),
               Prioridad = VALUES(Prioridad),
               idZona = VALUES(idZona),
               idMunicipio = VALUES(idMunicipio),
               Localidad = VALUES(Localidad),
               tiempo = VALUES(tiempo),
               tipoProyecto = VALUES(tipoProyecto),
               recibo = VALUES(recibo),
               emision = VALUES(emision),
               codigoRadicado = VALUES(codigoRadicado),
               fechaRadicado = VALUES(fechaRadicado),
               contactoNombre = VALUES(contactoNombre),
               contactoTelefono = VALUES(contactoTelefono),
               Direccion = VALUES(Direccion),
               fechaOcen = VALUES(fechaOcen);";

   $link->query(utf8_decode($sql));
   
   if ($nuevoId > 0)
   {
      echo $link->error . " " .$link->affected_rows;   
      $idxHT = 0;
      $arrActividades = explode(",", $ActividadesNuevas);
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

      
      if ($valActividades <> "")
      {
         $sql = "INSERT INTO OT_has_Actividades (idOT, idFuncion, idActividad) 
                  VALUES " . $valActividades . " ON DUPLICATE KEY UPDATE idActividad = VALUES(idActividad);";
            
            $link->query(utf8_decode($sql));

            $idxHT++;
      }

      $arrActividades = explode(",", $ActividadesBorradas);
      $valActividades = "";
      foreach ($arrActividades as $key => $value) 
      {
         if ($value <> "")
         {
            $valActividades .= "$value, ";
         }
      }
      $valActividades = substr($valActividades, 0, -2);

      if ($valActividades <> "")
      {
         $sql = "DELETE FROM  OT_has_Actividades WHERE id IN ($valActividades);";
            $link->query(utf8_decode($sql));
      }

      if ($idxHT > 0)
      {
         $sql = "UPDATE OT SET idEstado = '1' WHERE id = '$nuevoId';";
         $link->query(utf8_decode($sql));
      }
         
         $sql = "INSERT INTO logOT (idOT, idResponsable, Accion) VALUES ($nuevoId, $idLogin, 'Edición de OT');";
         $link->query(utf8_decode($sql));
         
         /*

         $mensaje = "Buen Día, $nombre
         <br>Se ha creado un usuario de acceso para el sistema [],
         <br><br>
         Los datos de autenticación son:
         <br><br>
         <br>Url de Acceso: http://epsa.wspcolombia.com
         <br>Usuario: $usuario
         <br>Clave: $pClave";

         Correo("Creación de OT " . $nombre, $correo, $mensaje) ;
         */
         
   } else
   {
      echo "Hubo un error desconocido " . $link->error;
   }
   




?>
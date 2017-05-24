<?php
   include("../conectar.php"); 
   //include ("../proyecto/funTrasladar.php");
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = $_POST['datos'];

   if (array_key_exists("fecha", $datos))
   {
     $fecha = $datos['fecha'];

     if ($fecha == "")
     {
        $fecha = date('Y-m-d H:i:s');
     }

     if ($datos['codPoste'] == "")
     {
        $datos['codPoste'] = "000";
        $datos['Datos'] = str_replace('"CodPoste":""', '"CodPoste":"000"', $datos['Datos']);
     }

    $sql = "INSERT INTO Levantamiento (Prefijo, idProyecto, codPoste, coordenadas, Usuario, fecha, Datos) 
           VALUES (
              '" . addslashes($datos['Prefijo']) . "', 
              '" . addslashes($datos['idProyecto']) . "', 
              '" . addslashes($datos['codPoste']) . "', 
              '" . addslashes($datos['coordenadas']) . "', 
              '" . addslashes($datos['Usuario']) . "', 
              '" . addslashes($fecha) . "', 
              '" . addslashes($datos['Datos']) . "')
            ON DUPLICATE KEY UPDATE
               Prefijo = VALUES(Prefijo),
               idProyecto = VALUES(idProyecto),
               codPoste = VALUES(codPoste),
               coordenadas = VALUES(coordenadas),
               Usuario = VALUES(Usuario),
               fecha = VALUES(fecha),
               Datos = VALUES(Datos);";

            /*$fp = fopen('data.txt', 'w');
            fwrite($fp, $sql);
            fclose($fp);*/

    $result = $link->query(utf8_decode($sql));

    if ($link->errno > 0)
    {
      $fp = fopen('err' . date('YmdHis') . '.txt', 'w');
      fwrite($fp, $sql . "\n\n" . $link->error);
      fclose($fp);
    }

    if ( $link->affected_rows > 0)
    {
       echo 1;

       //$sql = "UPDATE Proyectos SET idEstado = '3' WHERE IdProyecto = '" . $datos['idProyecto'] . "';";
       //$result = $link->query(utf8_decode($sql));

    } else
    {
       if ($link->errno > 0)
       {

        echo 0;
       } else
       {
        echo 1;
       }
    }
  } else
  {
    echo 0;
  }
?>
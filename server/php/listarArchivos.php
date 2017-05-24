<?php
   $ruta = "../archivos/" . $_POST['ruta'];
   $archivos = array();
   date_default_timezone_set('America/Bogota');
   
   echo json_encode(listar_directorios_ruta($ruta, $archivos, "raiz"));

   function listar_directorios_ruta($ruta, $archivos, $directorio)
   { 
      if (!isset($archivos[$directorio]))
      {
         $archivos[$directorio] = array();
      }
      // abrir un directorio y listarlo recursivo 
      if (is_dir($ruta)) 
      { 
         if ($dh = opendir($ruta)) 
         { 
            while (($file = readdir($dh)) !== false) 
            { 
               if ( $file!="." && $file!="..")
               {
                  if (is_dir($ruta . "/" . $file))
                  { 
                     $archivos = listar_directorios_ruta($ruta . "/" . $file, $archivos, $file); 
                  }
                  else
                  {
                     $fechaArchivo = date ("Y-m-d H:i:s.", filemtime($ruta .  "/" . $file));
                     $obj = array('nomArchivo' => $file, 'ruta' => $ruta, 'fecha' => $fechaArchivo);
                     array_push($archivos[$directorio], $obj);
                  }
               }
            } 
         closedir($dh); 

         } 
      }else 
      {
         $archivos["error"] = "No es ruta valida";       
      }
      return $archivos;
   }
?>
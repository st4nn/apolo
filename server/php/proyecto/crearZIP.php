<?php

  $idProyecto = $_POST['idProyecto'];
  //$idProyecto = '20160905082714002';
  


  $filename = "../Archivos/comprimidos/" . $idProyecto . ".zip";
  $recurso = "../Archivos/Levantamientos/" . $idProyecto . "/";

  
	if (file_exists($filename))
	{
  		unlink($filename);
	}

  $zip = new ZipArchive();

  if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) 
  {
      exit("cannot open <$filename>\n");
  }


  listar_directorios_ruta($recurso);

  $zip->close();

  echo "../server/php/Archivos/comprimidos/" . $idProyecto . ".zip";
   
function listar_directorios_ruta($ruta)
{ 
   // abrir un directorio y listarlo recursivo 
   global $zip;
   if (is_dir($ruta)) 
   { 
      if ($dh = opendir($ruta)) 
      { 
         while (($file = readdir($dh)) !== false) 
         { 
            if ( $file!="." && $file!="..")
            {
               if (is_dir($ruta . $file))
               { 
                  //echo "crear Directorio: " . $file . "<br>";

                  listar_directorios_ruta($ruta .  $file . "/"); 
               }
               else
               {
                  $arrRuta = explode("/", $ruta);

                  //echo "->" . $arrRuta[count($arrRuta) - 2] . "/" . $file;
                  if ($arrRuta[count($arrRuta) - 2] == $idProyecto)
                  {
                    $zip->addFile($ruta . $file, $file);
                    //echo "-> SI <br>";
                  } else
                  {
                    $zip->addFile($ruta . $file, $arrRuta[count($arrRuta) - 2] . "/" . $file);
                    //echo "-> NO <br>";
                  }
               }
            }
         } 
      closedir($dh); 

      } 
   }else 
   {
      echo "<br>No es ruta valida";       
   }
   
} 
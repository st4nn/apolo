<?php
//set_time_limit(60);
	include("../conectar.php");
	$link = Conectar();

	date_default_timezone_set("America/Bogota");

	$Carpeta = $_GET['Ruta'];

	$Usuario = $_POST['Usuario'];
	$codPoste = $_POST['codPoste'];
	$idFoto = $_POST['idFoto'];
	$idProyecto = $_POST['idProyecto'];

	$targetDir = "../Archivos/" . $Carpeta . "/" . $codPoste;

	if (!file_exists($targetDir)) 
	{
		$arrTargetDir = explode("/", $targetDir);
		$tmpTargetDir = "";
		foreach ($arrTargetDir as $key => $value) 
		{
			if ($tmpTargetDir <> "")
			{
				$tmpTargetDir .= "/";
			}
			$tmpTargetDir .= $value;
			
			if (!file_exists($tmpTargetDir))
			{
				@mkdir($tmpTargetDir);
			}
		}
	} 

	$thumbtargetDir = str_replace("Levantamientos", "Levantamientos/thumbnails", $targetDir);


	if (!file_exists($thumbtargetDir)) 
	{
		$arrTargetDir = explode("/", $thumbtargetDir);
		$tmpTargetDir = "";
		foreach ($arrTargetDir as $key => $value) 
		{
			if ($tmpTargetDir <> "")
			{
				$tmpTargetDir .= "/";
			}
			$tmpTargetDir .= $value;
			
			if (!file_exists($tmpTargetDir))
			{
				@mkdir($tmpTargetDir);
			}
		}
	} 

	// Get a file name
	if (isset($_REQUEST["name"])) {
		$fileName = $_REQUEST["name"];
	} elseif (!empty($_FILES)) {
		$fileName = $_FILES["file"]["name"];
	} else {
		$fileName = uniqid("file_");
	}
	
	$pos = strpos(substr($fileName, -5, 5), ".");	

	if ($pos === false)
	{
		$fileName = str_replace("%", "_", $fileName) . ".jpg";
	}

	$ext = substr($fileName, -3, 3);

	if (!file_exists($targetDir . "/" . $fileName))
	{
	  if (move_uploaded_file($_FILES["file"]["tmp_name"],  $targetDir . "/" . $fileName))
	  	{
	  		echo 1;

	  		if ($ext == "png")
	  		{
	  			$imagen = imagecreatefrompng($targetDir . "/" . $fileName);
	  		}else
	  		{
	  			$imagen = imagecreatefromjpeg($targetDir . "/" . $fileName);
	  		 	error_reporting(E_ERROR);
	  		}


	  		$sql = "INSERT INTO levArchivos (IdProyecto, idFoto, idRecurso, Ruta, Usuario) VALUES (
	  		'" . $idProyecto . "',
	  		'" . $idFoto . "',
	  		'" . $codPoste . "',
	  		'" . $targetDir . "/" . $fileName . "',
	  		'" . $Usuario . "');";

	  		$link->query(utf8_decode($sql));

	  		list($ancho, $alto) = getimagesize($targetDir . "/" . $fileName);
	  		
	  		
	  		$info = getimagesize($targetDir . "/" . $fileName);

	  		$thumbnail = imagecreatetruecolor(200, 150); 

    		imagecopyresampled($thumbnail , $imagen, 0, 0, 0, 0, 200, 150, $ancho, $alto);


    		imagejpeg($thumbnail, $thumbtargetDir . "/" . $fileName, 80);
	  		/*
	  		$file_info = getimagesize($targetDir . "/" . $fileName);
	  		$img = imagecreatefromjpeg($targetDir . "/" . $fileName);
	  		// Creamos la miniatura
			$thumb = imagecreatetruecolor(200, 150);
			// La redimensionamos
			imagecopyresampled($thumb, $img, 0, 0, 0, 0, 200, 150, $file_info[0], $file_info[1]);
			// La mostramos como jpg
			header("Content-type: image/jpeg");
			imagejpeg($thumb, null, 80);*/

	  	} else
	  	{
	  		echo 0;
	  	}
	} else
	{
		echo 1;
	}

?>

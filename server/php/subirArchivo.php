<?php

$Carpeta = $_GET['Ruta'];

$targetDir = "../archivos/" . $Carpeta;

// Create target dir
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

$status = "___";

if ($_FILES["archivo"]['name'] <> "") 
{
	$fileName =	$_FILES["archivo"]['name'];
	$filePath = $fileName;
	$idx = 1;
	while (file_exists($targetDir . DIRECTORY_SEPARATOR . $filePath))
	{
		$tmpfilePath = explode(".", $fileName);
		$obj = count($tmpfilePath) - 1;
		$filePath = "";
		foreach ($tmpfilePath as $key => $value) 
		{
			
			if ($key == $obj)
			{
				$filePath .= "_$idx." . $tmpfilePath[$key];
			} else
			{
				$filePath .= "_" . $tmpfilePath[$key];
			}
		}
		$idx++;
	}
	$filePath = $targetDir . DIRECTORY_SEPARATOR . $filePath;
	if ($fileName != "") 
		{
	        if (copy($_FILES['archivo']['tmp_name'],$filePath)) 
	        {
	            $status = "$filePath";
	        } 
	    } 
}
	echo $status;

?>
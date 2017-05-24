<?php
	$archivo = $_POST['ruta'];
	echo unlink("../../" . $archivo);
?>
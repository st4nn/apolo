<?
	$rutaClaseConexionMySQL = '../../server/php/conectar.php';
	$rutaClaseSMTP = '../../assets/mensajes/correo.php';
	$rSQL = "SELECT idLogin, Nombre FROM DatosUsuarios WHERE Correo = '_Correo';";
	$cSQL = "";
	$url = "https://apolo.wspcolombia.com";
	$nomApp = "Apolo";
?>
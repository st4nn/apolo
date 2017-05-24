<?php
    date_default_timezone_set('America/Bogota');

    include("../conectar.php");
    include("../phpExcel/excel_reader2.php"); 
    
    include("../../../assets/mensajes/correo.php");  
    
    $link=Conectar();

    $archivo = str_replace("\\", "/", $_POST['archivo']);

    //$archivo = "../../archivos/OCEN/OT DISENO.XLSX";


    $data = new Spreadsheet_Excel_Reader("../" . $archivo, false, "ISO-8859-1");

$bandera = 0;
$contadorDeBlancos = 0;
$fValidadorHoja = false;
$ordenes = "";
$arrobras = array();
$idx = 0;
$menError = "";

$tipoDisenios = array();
    $tipoDisenios["1"] = 'P1_1';
    $tipoDisenios["2"] = 'P2_1';
    $tipoDisenios["3"] = 'P3_1';
    $tipoDisenios["4"] = 'P4_1';
    $tipoDisenios["5"] = 'P5_1';
    $tipoDisenios["6"] = 'P7_1';

foreach($data->sheets as $numeroHoja => $hoja)
{
    $datosHoja = $data->boundsheets[$numeroHoja];

   $numCols = $hoja['numCols'];
   $numRows = $hoja['numRows'];
   
   if ($datosHoja['name'] == "")
    {
        break 1;
    }else
    {
        if (isset($hoja['cells']))
        {
            if (strtolower($hoja['cells'][1][1]) == "central")
            {
                for ($j=2; $j < $numRows; $j++) 
                {
                    if ($hoja['cells'][$j][2] <> "")
                    {
                        $pPrefijo = date("YmdHis") + $j;
                        $contadorDeBlancos = 0;

                        $tipoDisenio = explode("TIPO ", $hoja['cells'][$j][32]);
                        if (count($tipoDisenio) > 1)
                        {
                            $tipoDisenio = $tipoDisenios[trim($tipoDisenio[1])];
                        } else
                        {
                            $tipoDisenio = $tipoDisenios["6"];
                        }

                        $ordenes .= "('" . addslashes($hoja['cells'][$j][38]) . "', " .
                            "'" . $pPrefijo . "', " .
                            "'" . addslashes($hoja['cells'][$j][2]) . "', " .
                            "'" . addslashes($hoja['cells'][$j][3] . " -- " . $hoja['cells'][$j][69]) . "', " .
                            "'Normal', " .
                            "'7', " .
                            "'44', " .
                            "'', " .
                            "'', " .
                            "'" . $tipoDisenio . "', " .
                            "'Cargue Masivo', " .
                            "'', " .
                            "'', " .
                            "'" . addslashes($hoja['cells'][$j][16]) . "', " .
                            "'" . date("Y-m-d H:i:s") . "', " .
                            "'" . addslashes($hoja['cells'][$j][40]) . "', " .
                            "'', " .
                            "''), " ;

                        $idx++;
                    } else
                    {
                        $contadorDeBlancos++;
                    }
                   
                    if ($contadorDeBlancos > 10)
                    {
                        break 1;
                    }
                }
                $ordenes = substr($ordenes, 0, -2);            
            } else
            {
                $menError = "El archivo no correponde a la estructura especificada";
            }
        }
    }
}
if ($ordenes <> "")
{
    $sql = "INSERT INTO OT 
               (Nombre, Prefijo, Codigo, Alcance, Prioridad, idZona, idMunicipio, Localidad, tiempo, tipoProyecto, recibo, emision, fechaOcen, codigoRadicado, fechaRadicado, contactoNombre, contactoTelefono, Direccion) 
            VALUES  " . $ordenes . " ON DUPLICATE KEY UPDATE Nombre = Nombre;";

    $result = $link->query($sql);

    $numCreadas = $link->affected_rows;
    $Respuesta = array();

    $Respuesta['Error'] = $menError;
    $Respuesta['Identificadas'] = $numCreadas;

    echo json_encode($Respuesta);

    if ($numCreadas > 0)
    {
        $sql = "SELECT 
                    DatosUsuarios.Correo 
                FROM 
                    DatosUsuarios 
                    INNER JOIN login_has_zonas ON login_has_zonas.idLogin = DatosUsuarios.idLogin
                WHERE 
                    login_has_zonas.idZona = 7
                    AND DatosUsuarios.idPerfil IN (2, 3, 4)";

        $result = $link->query($sql);
        $correos = "";
            while ($row = mysqli_fetch_assoc($result))
            {
                $correos .= $row['Correo'];
            }
            if ($correos <> "")
            {   
                $mensaje = "Buen Día, 
                        <br>Se han cargado $numCreadas ordenes en el sistema Apolo,
                        <br><br>
                        Por favor recuerda ingresar las actividades para estas ordenes.
                        <br><br>
                        <br>Url de Acceso: <a href='http://apolo.wspcolombia.com' target='_blank'>http://apolo.wspcolombia.com</a>";

                        EnviarCorreo($correos, "Cargue Masivo de Ordenes", $mensaje) ;
            }
    }
	
} else
{
    echo 0;
}
?>

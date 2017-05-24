<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idProyecto = $_POST['idProyecto'];

   $sql = "SELECT    
                OT.Nombre,
                OT.Alcance AS Descripcion
            FROM 
               OT
            WHERE OT.Prefijo = '$idProyecto';";

    $result = $link->query($sql);

    $fila =  $result->fetch_array(MYSQLI_ASSOC);

    $nomProyecto = $fila['Nombre'];
    $descProyecto = $fila['Descripcion'];

   $sql = "SELECT    
                Levantamiento.Datos
            FROM 
               Levantamiento
            WHERE Levantamiento.idProyecto = '$idProyecto';";

   $result = $link->query($sql);

   $idx = 0;

   $cadena = '<?xml version="1.0" encoding="UTF-8"?>
                  <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
                  <Document>
                    <name>'. $nomProyecto . '</name>
                    <Style id="icoPoste">
                      <IconStyle>
                        <scale>1</scale>
                        <Icon>
                          <href>http://orion.wsppb-latam.com/assets/images/icons/poste.png</href>
                        </Icon>
                        <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                      </IconStyle>
                    </Style>
                    <Style id="icoLine">
                      <LineStyle>
                        <color>ff00264c</color>
                        <width>5</width>
                      </LineStyle>
                    </Style>
                    <Folder>
                      <name>' . $nomProyecto . '</name>
                      <open>1</open>';

   if ( $result->num_rows > 0)
   {
      $arrCoord = array();

      while ($row = mysqli_fetch_assoc($result))
      {
        $json = str_replace("\r", " ", str_replace("\n", " ", trim(utf8_decode($row['Datos']))));
        
        $tmpData = json_decode($json);

        $arrCoord[$tmpData->CodPoste] = $tmpData->CoordY . ',' . $tmpData->CoordX . ',0';

        $cadena .= '<Placemark>
                      <name>' . $tmpData->CodPoste . '</name><description>';
        foreach ($tmpData as $key => $value) 
        {
          if ($value <> "" AND $value <> "0")
          {
            $cadena .= "<p><b>" . $key . ": </b><i>" . str_replace("\r", " ", str_replace("\n ", " ", $value)) . "</i></p>";
          }
        }

        $cadena .= '</description><LookAt>
                        <longitude>' . $tmpData->CoordY . '</longitude>
                        <latitude>' . $tmpData->CoordX . '</latitude>
                        <altitude>0</altitude>
                      </LookAt>
                      <styleUrl>#icoPoste</styleUrl>
                      <Point>
                        <gx:drawOrder>1</gx:drawOrder>
                        <coordinates>' . $tmpData->CoordY . ',' . $tmpData->CoordX . ',0</coordinates>
                      </Point>
                    </Placemark>';

        if ($tmpData->Tramo <> "" AND $tmpData->Tramo <> "null") 
        {
          $cadena .= '<Placemark>
                        <name>Tramo ' . $tmpData->CodPoste . ' - ' . $tmpData->Tramo . '</name>
                        <styleUrl>#icoLine</styleUrl>
                        <LineString>
                          <tessellate>1</tessellate>
                          <coordinates>
                            ' . $arrCoord[$tmpData->Tramo] . ' ' . $tmpData->CoordY . ',' . $tmpData->CoordX . ',0
                          </coordinates>
                        </LineString>
                      </Placemark>';
        }

      }
      $cadena .= '</Folder>
              </Document>
              </kml>';
      
      $nomArchivo = strtolower(str_replace(" ", "", ereg_replace('[^ A-Za-z0-9_-ñÑ]', '', $nomProyecto))). ".kml";

      $fp = fopen("../kml/" . $nomArchivo, 'w');
      fwrite($fp, $cadena);
      fclose($fp);

      echo "../server/php/kml/" . $nomArchivo;
   } else
   {
      echo 0;
   }
?>
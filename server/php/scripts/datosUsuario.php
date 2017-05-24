<?php
   function datosUsuario($idUsuario)
   {
      $link = Conectar();
    
      $sql = "SELECT 
               Login.idLogin,
               Login.Usuario,
               Login.Estado,
               Login.idEmpresa,
               DatosUsuarios.Nombre,
               DatosUsuarios.Correo,
               DatosUsuarios.idPerfil,
               login_has_zonas.idZona
            FROM 
               Login
               INNER JOIN DatosUsuarios ON Login.idLogin = DatosUsuarios.idLogin
               LEFT JOIN login_has_zonas ON Login.idLogin = login_has_zonas.idLogin
            WHERE 
               Login.idLogin = $idUsuario";
      
      $result = $link->query($sql);

      if ( $result->num_rows > 0)
      {
         class Usuario
         {
            public $idLogin;
            public $Usuario;
            public $idEmpresa;
            public $Nombre;
            public $Correo;
            public $idPerfil;
            public $Estado;
            public $Zonas;
         }
         
         $idx = 0;
            $Usuarios = new Usuario();
            while ($row = mysqli_fetch_assoc($result))
            { 
               if (is_array($Usuarios->Zonas) == false)
               {
                  $Usuarios->Zonas  = array();
               }
               
               $Usuarios->idLogin = utf8_encode($row['idLogin']);
               $Usuarios->Usuario = utf8_encode($row['Usuario']);
               $Usuarios->Nombre = utf8_encode($row['Nombre']);
               $Usuarios->idEmpresa = utf8_encode($row['idEmpresa']);
               $Usuarios->Correo = utf8_encode($row['Correo']);
               $Usuarios->idPerfil = utf8_encode($row['idPerfil']);
               $Usuarios->Estado = utf8_encode($row['Estado']);
               //$Usuarios->Zonas[$idx] = utf8_encode($row['idZona']);
               array_push($Usuarios->Zonas, utf8_encode($row['idZona']));

               $idx++;
            }
            
               mysqli_free_result($result);  
               return $Usuarios;
      } else
      {
         echo 0;
      }
   }
?>
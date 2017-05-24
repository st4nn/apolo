jQuery(document).ready(function($) {
  ready_registrar();
});
function ready_registrar()
{
 $("#txtRegistrar_empresa").cargarCombo("Empresas");
 $("#txtRegistrar_perfil").cargarCombo("Perfiles");
 $("#txtRegistrar_sede").cargarCombo("Sedes");
 $("#txtRegistrar_area").cargarCombo("Areas");
 $("#frmRegistrar").on("submit", function(evento)
 	{
 		evento.preventDefault();
 		$("#frmRegistrar").generarDatosEnvio("txtRegistrar_", function(datos)
 		{
		  if ($("#txtCrearUsuario_perfil").val() == "")
		  {
		    Mensaje("Error", "Por favor selecciona el Perfil");
		    $("#txtCrearUsuario_perfil").focus();
		  } else
		  {
		    if ($("#txtCrearUsuario_empresa").val() == "")
		    {
		      Mensaje("Error", "Por favor selecciona la Empresa");
		      $("#txtCrearUsuario_empresa").focus();
		    } else
		    {
		      if ($("#txtCrearUsuario_clave").val() != $("#txtCrearUsuario_clave2").val())
		      {
		        Mensaje("Error", "Las claves no coinciden");
		        $("#txtCrearUsuario_clave").focus();
		      } else
		      {

		        $.post("../server/php/scripts/crearUsuario.php",
		        {datos: datos}, function(data, textStatus, xhr)
		        {
		          if (data == 1)
		          {
		            Mensaje("Ok", "El Usuario ha sido almacenado.");    
		            $("#frmRegistrar")[0].reset();
		            
		          } else
		          {
		            Mensaje("Error", data);    
		          }
		        }).always(function() 
		        {
		          //Cuando Finaliza
		        }).fail(function() {
		          Mensaje("Error", "No fue posible almacenar el Usuario, por favor intenta nuevamente.");
		        });
		      }
		    }
		  }
 		});
 	});
}

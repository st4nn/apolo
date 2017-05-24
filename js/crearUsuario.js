//$(document).on("ready", informacionEstructual);
crearUsuario();

function crearUsuario()
{
	$("#btnCrearUsuario_Nuevo").on("click", btnCrearUsuario_Nuevo_Click);
	$("#txtCrearUsuario_empresa").cargarCombo("Empresas");
 	$("#txtCrearUsuario_perfil").cargarCombo("Perfiles");

 	$("#btnCrearUsuario_ZonasNinguna").on("click", function(evento)
 		{
 			evento.preventDefault();
 			$("#cntCrearUsuario_Zonas input").prop("checked", false);
 			crearUsuario_listenChkZonas();
 		});
 	$("#btnCrearUsuario_ZonasTodas").on("click", function(evento)
 		{
 			evento.preventDefault();
 			$("#cntCrearUsuario_Zonas input").prop("checked", true);
 			crearUsuario_listenChkZonas();
 		});

 	crearUsuario_cargarZonas();

 	$("#frmCrearUsuario").on("submit", function(evento)
 	{
 		evento.preventDefault();
 		$("#frmCrearUsuario").generarDatosEnvio("txtCrearUsuario_", function(datos)
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
		            $("#frmCrearUsuario")[0].reset();
		            
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

function crearUsuario_cargarZonas()
{
	$("#cntCrearUsuario_Zonas div").remove();
	$.post('../server/php/scripts/cargarZonas.php', {}, function(data, textStatus, xhr) 
	{
		var tds = "";
		$.each(data, function(index, val) 
		{
			 tds += '<div class="col-md-2 margin-5">';
				tds += '<div class="checkbox-custom checkbox-primary">';
                  tds += '<input type="checkbox" id="txtCrearUsuario_ZonasChk' + val.id + '" idZona="' + val.id + '">';
                  tds += '<label for="txtCrearUsuario_ZonasChk' + val.id + '">' + val.Nombre + '</label>';
                tds += '</div>';
			tds += '</div>';
		});
		$("#cntCrearUsuario_Zonas").append(tds);
		$("#cntCrearUsuario_Zonas input[type=checkbox]").on("click", crearUsuario_listenChkZonas);
	}, "json");
}
function crearUsuario_listenChkZonas()
{
	var obj = $("#cntCrearUsuario_Zonas input:checked");
	var tds = "";

	$.each(obj, function(index, val) 
	{
		tds += $(val).attr("idZona") + ",";
	});
	$("#txtCrearUsuario_zonas").val(tds);
}
function btnCrearUsuario_Nuevo_Click()
{
	var r = confirm("Los cambios realizados no se guardaran, \n ¿Desea continuar?");
	if (r == true) 
	{
		$("#frmCrearUsuario")[0].reset();	    
	} 	
}
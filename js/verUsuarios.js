verUsuarios();

function verUsuarios()
{
	$(document).delegate('.btnVerUsuarios_VerUsuario', 'eventType', function(event) 
	{
		
	});
	$("#btnVerUsuarios_NuevoUsuario").on("click", function(ev)
		{
			ev.preventDefault();
			window.location.replace("crearUsuario.html");
		});
	$("#frmVerUsuarios_Buscar").on("submit", function(ev)
		{
			ev.preventDefault();
			$.post('../server/php/scripts/cargarUsuarios.php', {usuario : Usuario.id, Parametro: $("#txtVerUsuarios_Parametro").val()}, function(data, textStatus, xhr) 
			{
				if (data != 0)
				{
					var tds = "";
					$.each(data, function(index, val) 
					{
						 tds += '<tr>';
			                tds += '<td><button class="btn btn-info btnVerUsuarios_VerUsuario"><i class="icon wb-eye"></i></button></td>';
			                tds += '<td>' + val.idLogin + '</td>';
			                tds += '<td>' + val.Nombre + '</td>';
			                tds += '<td>' + val.Correo + '</td>';
			                tds += '<td>' + val.Cargo + '</td>';
			                tds += '<td>' + val.Perfil + '</td>';
			                tds += '<td>' + val.Estado + '</td>';		                
			             tds += '</tr>';
					});
					$("#tblVerUsuarios_Resultados").crearDataTable(tds);
				} else
				{
					Mensaje("Error", "No se encontraron resultados con el parámetro " + $("#txtVerUsuarios_Parametro").val());
				}
			}, "json");
		});
}

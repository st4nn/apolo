ActSinAsignar();

function ActSinAsignar()
{
	 $("#frmActSinAsignar_Buscar .input-daterange").datepicker();


	 $(document).delegate('.btnActSinAsignar_EditarHT', 'click', function(event) 
	 {
	 	event.preventDefault();
	 	var idOt = $(this).attr("idOT");
	 	localStorage.setItem("wsp_epsa_idOT", JSON.stringify({tipo: "Vista", idOT : idOt}));
	 	
	 	var objParametros = {
					"Parametro": $("#txtActSinAsignar_Parametro").val(),
					"fechaIni" : $("#txtActSinAsignar_FechaIni").val(),
					"fechaFin" : $("#txtActSinAsignar_FechaFin").val(),
					"Edicion" : true};

		localStorage.setItem("wsp_epsa_otVer_Parametros", JSON.stringify(objParametros));    

	 	window.location.replace("editarOrden.html");
	 });

	$("#frmActSinAsignar_Buscar").on("submit", function(ev)
		{
			ev.preventDefault();

			$.post('../server/php/scripts/cargarActividadesSinAsignar.php', 
				{usuario : Usuario.id
				}, function(data, textStatus, xhr) 
			{
				if (data != 0)
				{
					var tds = "";
					$.each(data, function(index, val) 
					{
						 tds += '<tr>';
			                tds += '<td><button class="btn btn-warning btnActSinAsignar_EditarHT" idOT="' + val.id + '"><i class="icon wb-edit"></i></button></td>';
			                //tds += '<td></td>';
			                tds += '<td>' + val.id + '</td>';
			                tds += '<td>' + val.Codigo + '</td>';
			                tds += '<td>' + val.codigoRadicado + '</td>';
			                tds += '<td>' + val.Nombre + '</td>';
			                tds += '<td>' + val.Zona + '</td>';
			                tds += '<td>' + val.Municipio + '</td>';
			                tds += '<td>' + val.tipoProyecto + '</td>';		                
			                tds += '<td>' + val.idActividad + '</td>';
			                tds += '<td>' + val.Actividad + '</td>';	
			                tds += '<td>' + val.fechaCreacion + '</td>';	
			                tds += '<td>' + val.Prioridad + '</td>';		                
			             tds += '</tr>';
					});
					$("#tblActSinAsignar_Resultados").crearDataTable(tds);
				} else
				{
					var mensaje = "No se encontraron Actividades Sin Asignar";
					Mensaje("Error", mensaje);
				}
			}, "json");
		});

	$("#frmActSinAsignar_Buscar").trigger('submit');
}

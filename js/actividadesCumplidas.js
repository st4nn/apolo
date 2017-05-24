ActCumplidas();

function ActCumplidas()
{
	 $("#frmActCumplidas_Buscar .input-daterange").datepicker();


	 $(document).delegate('.btnActCumplidas_EditarHT', 'click', function(event) 
	 {
	 	event.preventDefault();
	 	var idOt = $(this).attr("idOT");
	 	localStorage.setItem("wsp_epsa_idOT", JSON.stringify({tipo: "Vista", idOT : idOt}));
	 	
	 	var objParametros = {
					"Parametro": $("#txtActCumplidas_Parametro").val(),
					"fechaIni" : $("#txtActCumplidas_FechaIni").val(),
					"fechaFin" : $("#txtActCumplidas_FechaFin").val(),
					"Edicion" : true};

		localStorage.setItem("wsp_epsa_otVer_Parametros", JSON.stringify(objParametros));    

	 	window.location.replace("editarOrden.html");
	 });

	$("#frmActCumplidas_Buscar").on("submit", function(ev)
		{
			ev.preventDefault();

			$.post('../server/php/scripts/cargarActividadesCumplidas.php', 
				{usuario : Usuario.id
				}, function(data, textStatus, xhr) 
			{
				if (data != 0)
				{
					var tds = "";
					$.each(data, function(index, val) 
					{
						 tds += '<tr>';
			                tds += '<td><button class="btn btn-warning btnActCumplidas_EditarHT" idOT="' + val.id + '"><i class="icon wb-edit"></i></button></td>';
			                tds += '<td>' + val.id + '</td>';
			                tds += '<td>' + val.Codigo + '</td>';
			                tds += '<td>' + val.codigoRadicado + '</td>';
			                tds += '<td>' + val.Nombre + '</td>';
			                tds += '<td>' + val.Zona + '</td>';
			                tds += '<td>' + val.Municipio + '</td>';
			                tds += '<td>' + val.tipoProyecto + '</td>';		                
			                tds += '<td>' + val.idActividad + '</td>';
			                tds += '<td>' + val.Actividad + '</td>';	
			                tds += '<td>' + val.fechaAsignacion + '</td>';	
			                tds += '<td>' + val.fechaCumplimiento + '</td>';	
			                tds += '<td>' + val.Tiempo + '</td>';	
			                tds += '<td>' + val.Responsable + '</td>';	
			             tds += '</tr>';
					});
					$("#tblActCumplidas_Resultados").crearDataTable(tds);
				} else
				{
					var mensaje = "No se encontraron Actividades Sin Asignar";
					Mensaje("Error", mensaje);
				}
			}, "json");
		});

	$("#frmActCumplidas_Buscar").trigger('submit');
}

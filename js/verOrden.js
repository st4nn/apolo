verOrden();

function verOrden()
{
	 $("#frmVerOrden_Buscar .input-daterange").datepicker();


	 $(document).delegate('.btnVerOrden_EditarOT', 'click', function(event) 
	 {
	 	event.preventDefault();
	 	var idOt = $(this).attr("idOT");
	 	localStorage.setItem("wsp_epsa_idOT", JSON.stringify({tipo: "Vista", idOT : idOt}));
	 	
	 	var objParametros = {
					"Parametro": $("#txtVerOrden_Parametro").val(),
					"fechaIni" : $("#txtVerOrden_FechaIni").val(),
					"fechaFin" : $("#txtVerOrden_FechaFin").val(),
					"fechaIniCump" : $("#txtVerOrden_FechaIniCump").val(),
					"fechaFinCump" : $("#txtVerOrden_FechaFinCump").val(),
					"Edicion" : true};

		localStorage.setItem("wsp_epsa_otVer_Parametros", JSON.stringify(objParametros));    

	 	window.location.replace("editarOrden.html");
	 });

	$("#btnVerOrden_NuevaOrden").on("click", function(ev)
		{
			ev.preventDefault();
			delete localStorage.wsp_epsa_idOT;
			window.location.replace("crearOrden.html");
		});
	$("#frmVerOrden_Buscar").on("submit", function(ev)
		{
			ev.preventDefault();

			var objParametros = {
					"Parametro": $("#txtVerOrden_Parametro").val(),
					"fechaIni" : $("#txtVerOrden_FechaIni").val(),
					"fechaFin" : $("#txtVerOrden_FechaFin").val(),
					"Edicion" : false
				};

			localStorage.setItem("wsp_epsa_otVer_Parametros", JSON.stringify(objParametros));    

			$.post('../server/php/scripts/cargarOrdenes.php', 
				{usuario : Usuario.id, 
					Parametro: $("#txtVerOrden_Parametro").val(),
					fechaIni : $("#txtVerOrden_FechaIni").val(),
					fechaFin : $("#txtVerOrden_FechaFin").val(),
					fechaIniCump : $("#txtVerOrden_FechaIniCump").val(),
					fechaFinCump : $("#txtVerOrden_FechaFinCump").val(),
					Estado : 0
				}, function(data, textStatus, xhr) 
			{
				if (data != 0)
				{
					var tds = "";
					$.each(data, function(index, val) 
					{
						 tds += '<tr>';
			                tds += '<td><button class="btn btn-warning btnVerOrden_EditarOT" idOT="' + val.id + '"><i class="icon wb-edit"></i></button></td>';
			                tds += '<td>' + val.id + '</td>';
			                tds += '<td>' + val.Codigo + '</td>';
			                tds += '<td>' + val.codigoRadicado + '</td>';
			                tds += '<td>' + val.Nombre + '</td>';
			                tds += '<td>' + val.Zona + '</td>';
			                tds += '<td>' + val.Municipio + '</td>';
			                tds += '<td>' + val.Alcance + '</td>';
			                tds += '<td>' + val.Prioridad + '</td>';		                
			                tds += '<td>' + val.tipoProyecto + '</td>';		                
			                tds += '<td>' + val.tipoProyectoDesc + '</td>';		                
			                tds += '<td>' + val.Estado + '</td>';	
			                tds += '<td>' + val.fechaCreacion + '</td>';	
			                tds += '<td>' + val.fechaCumplimiento + '</td>';	
			             tds += '</tr>';
					});
					$("#tblVerOrden_Resultados").crearDataTable(tds);
				} else
				{
					var mensaje = "No se encontraron resultados con el parámetro " + $("#txtVerOrden_Parametro").val();
					if 	($("#txtVerOrden_FechaIni").val() != "")
					{
						mensaje += " o que hayan sido creadas despues de " + $("#txtVerOrden_FechaIni").val();
					}
					if 	($("#txtVerOrden_FechaFin").val() != "")
					{
						mensaje += " o que hayan sido creadas antes de " + $("#txtVerOrden_FechaFin").val();
					}
					Mensaje("Error", mensaje);
				}
			}, "json");
		});

	var objParametros = JSON.parse(localStorage.getItem('wsp_epsa_otVer_Parametros'));
	if (objParametros != null)
	{
		if (objParametros.Edicion)
		{
			$("#txtVerOrden_Parametro").val(objParametros.Parametro);
			$("#txtVerOrden_FechaIni").val(objParametros.fechaIni);
			$("#txtVerOrden_FechaFin").val(objParametros.fechaFin);
			$("#txtVerOrden_FechaIniCump").val(objParametros.fechaIniCump);
			$("#txtVerOrden_FechaFinCump").val(objParametros.fechaFinCump);

			$("#frmVerOrden_Buscar").trigger('submit');
		}
	}
}

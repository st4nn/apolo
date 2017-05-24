verHoja();

function verHoja()
{
	$("#btnVerHoja_VerListado").on("click", function(evento)
		{
			evento.preventDefault();
			$("#cntVerHoja_Ordenes").show();
			$("#cntCrearHoja_DetalleOT").hide();
		});

	 $("#frmVerHoja_Buscar .input-daterange").datepicker();

	 $(document).delegate('.btnVerHoja_EditarOT', 'click', function(event) 
	 {
	 	event.preventDefault();
	 	var idOt = $(this).attr("idOT");
	 	localStorage.setItem("wsp_epsa_idOT", JSON.stringify({tipo: "Vista", idOT : idOt}));
	 	
	 	var objParametros = {
					"Parametro": $("#txtVerHoja_Parametro").val(),
					"fechaIni" : $("#txtVerHoja_FechaIni").val(),
					"fechaFin" : $("#txtVerHoja_FechaFin").val(),
					"Edicion" : true};

		localStorage.setItem("wsp_epsa_htVer_Parametros", JSON.stringify(objParametros));    

	 	window.location.replace("editarOrden.html");
	 });

	$("#frmVerHoja_Buscar").on("submit", function(ev)
		{
			ev.preventDefault();

			var objParametros = {
					"Parametro": $("#txtVerHoja_Parametro").val(),
					"fechaIni" : $("#txtVerHoja_FechaIni").val(),
					"fechaFin" : $("#txtVerHoja_FechaFin").val(),
					"Edicion" : false
				};

			localStorage.setItem("wsp_epsa_htVer_Parametros", JSON.stringify(objParametros));    

			$.post('../server/php/scripts/cargarHojas.php', 
				{usuario : Usuario.id, 
					Parametro: $("#txtVerHoja_Parametro").val(),
					fechaIni : $("#txtVerHoja_FechaIni").val(),
					fechaFin : $("#txtVerHoja_FechaFin").val()
				}, function(data, textStatus, xhr) 
			{
				if (data != 0)
				{
					var tds = "";
					$.each(data, function(index, val) 
					{
						var rowSpan = val.Usuarios.length;
						
						 tds += '<tr>';
			                tds += '<td><button class="btn btn-warning btnCrearHoja_Ver" idOT="' + val.idOT + '"><i class="icon wb-edit"></i></button></td>';
			                tds += '<td>' + val.idOT + '</td>';
			                tds += '<td>' + val.Codigo + '</td>';
			                tds += '<td>' + val.codigoRadicado + '</td>';
			                tds += '<td>' + val.Nombre + '</td>';
			                tds += '<td>' + val.Zona + '</td>';
			                tds += '<td>' + val.Municipio + '</td>';
			                tds += '<td>' + val.Estado + '</td>';
							tds += '<td>';
			                $.each(val.Usuarios, function(index2, actividad) 
			                {
			                	 tds += '<p>' + actividad.Usuario  + '</p>';
			                });
			                tds += '</td>';
			                tds += '<td>';
			                $.each(val.Usuarios, function(index2, actividad) 
			                {
			                	 tds += '<p>' + actividad.Actividad  + '</p>';
			                });
			                tds += '</td>';
			                tds += '<td>';
			                $.each(val.Usuarios, function(index2, actividad) 
			                {
			                	 tds += '<p>' + actividad.tiempo  + '</p>';
			                });
			                tds += '</td>';
			                tds += '<td>' + val.entrega + '</td>';	
			             tds += '</tr>';
					});
					$("#tblVerHoja_Resultados").crearDataTable(tds);
				} else
				{
					var mensaje = "No se encontraron resultados con el parámetro " + $("#txtVerHoja_Parametro").val();
					if 	($("#txtVerHoja_FechaIni").val() != "")
					{
						mensaje += " o que hayan sido creadas despues de " + $("#txtVerHoja_FechaIni").val();
					}
					if 	($("#txtVerHoja_FechaFin").val() != "")
					{
						mensaje += " o que hayan sido creadas antes de " + $("#txtVerHoja_FechaFin").val();
					}
					Mensaje("Error", mensaje);
				}
			}, "json");
		});

	var objParametros = JSON.parse(localStorage.getItem('wsp_epsa_htVer_Parametros'));
	if (objParametros != null)
	{
		if (objParametros.Edicion)
		{
			$("#txtVerHoja_Parametro").val(objParametros.Parametro);
			$("#txtVerHoja_FechaIni").val(objParametros.fechaIni);
			$("#txtVerHoja_FechaFin").val(objParametros.fechaFin);

			$("#frmVerHoja_Buscar").trigger('submit');
		}
	}
}

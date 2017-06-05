PanelDeOrden();

function PanelDeOrden()
{
	$("#frmPanelDeOrden_Buscar .input-daterange").datepicker();

	$("#btnPanelDeOrden_ActividadesPendientes").on("click", function(evento)
	{
		evento.preventDefault();

		misActividades_cargarPendientes();
	});

	$("#btnPanelDeOrden_ActividadesPendientes").trigger('click');


	 $(document).delegate('.btnPanelDeOrden_EditarOT', 'click', function(event) 
	 {
	 	event.preventDefault();
	 	var idOt = $(this).attr("idOT");
	 	$("#cntPanelDeOrdenes_Busqueda").hide();

	 	$("#cntPanelDeOrdenes_Panel").slideDown();
	 });

	 $("#btnPanelDeOrdenes_Panel_Volver").on("click", function(evento)
	 	{
	 		evento.preventDefault();

	 		$("#cntPanelDeOrdenes_Panel").hide();

	 		$("#cntPanelDeOrdenes_Busqueda").slideDown();
	 	});

	$("#btnPanelDeOrden_NuevaOrden").on("click", function(ev)
	{
		ev.preventDefault();
		delete localStorage.wsp_epsa_idOT;
		window.location.replace("crearOrden.html");
	});

	$("#frmPanelDeOrden_Buscar").on("submit", function(ev)
	{
		ev.preventDefault();

		var objParametros = {
				"Parametro": $("#txtPanelDeOrden_Parametro").val(),
				"fechaIni" : $("#txtPanelDeOrden_FechaIni").val(),
				"fechaFin" : $("#txtPanelDeOrden_FechaFin").val(),
				"Edicion" : false
			};

		localStorage.setItem("wsp_epsa_otVer_Parametros", JSON.stringify(objParametros));    

		$.post('../server/php/scripts/cargarOrdenes.php', 
			{usuario : Usuario.id, 
				Parametro: $("#txtPanelDeOrden_Parametro").val(),
				fechaIni : $("#txtPanelDeOrden_FechaIni").val(),
				fechaFin : $("#txtPanelDeOrden_FechaFin").val(),
				fechaIniCump : $("#txtPanelDeOrden_FechaIniCump").val(),
				fechaFinCump : $("#txtPanelDeOrden_FechaFinCump").val(),
				Estado : 0
			}, function(data, textStatus, xhr) 
		{
			if (data != 0)
			{
				var tds = "";
				$.each(data, function(index, val) 
				{
					 tds += '<tr>';
		                tds += '<td><a  href="panelOT.html?id=' + val.id + '" class="btn btn-info"><i class="icon wb-eye"></i></button></td>';
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
				$("#tblPanelDeOrden_Resultados").crearDataTable(tds);
			} else
			{
				var mensaje = "No se encontraron resultados con el parámetro " + $("#txtPanelDeOrden_Parametro").val();
				if 	($("#txtPanelDeOrden_FechaIni").val() != "")
				{
					mensaje += " o que hayan sido creadas despues de " + $("#txtPanelDeOrden_FechaIni").val();
				}
				if 	($("#txtPanelDeOrden_FechaFin").val() != "")
				{
					mensaje += " o que hayan sido creadas antes de " + $("#txtPanelDeOrden_FechaFin").val();
				}
				Mensaje("Error", mensaje);
			}
		}, "json");
	});

	$("#btnPanelDeOrden_ActividadesPendientes").val()

	$("#txteditarOrden_Zona").cargarCombo("Zonas", function()
	{
		$("#txteditarOrden_Zona").prepend('<option value="0">Seleccione una Zona</option>');
	});
	$("#txteditarOrden_Zona").on("change", txteditarOrden_Zona_Change);
}


function txteditarOrden_Zona_Change()
{
	var datos = {};
	datos["idZona"] = $(this).val();
	datos = JSON.stringify(datos);

	$("#txteditarOrden_Municipio").cargarCombo("MunicipiosZona", function()
		{
			if (tmpIdMunicipio != "")
			{
				$("#txteditarOrden_Municipio").val(tmpIdMunicipio);
			}
		}, [], {datos : datos});
}

function misActividades_cargarPendientes()
{
	$.post('../server/php/scripts/cargarOrdenesAsignadas.php', 
		{usuario : Usuario.id}, 
	function(data, textStatus, xhr) 
	{
		if (data != 0)
		{
			var tds = "";
			$.each(data, function(index, val) 
			{
				 tds += '<tr>';
	                tds += '<td><a  href="panelOT.html?id=' + val.id + '" class="btn btn-info"><i class="icon wb-eye"></i></button></td>';
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
			$("#tblPanelDeOrden_Resultados").crearDataTable(tds);
		} else
		{
			var mensaje = "No se encontraron actividades pendientes";
			Mensaje("Error", mensaje);
		}
	}, "json");
}
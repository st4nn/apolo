OTVencidas();

function OTVencidas()
{
	 $("#frmOTVencidas_Buscar .input-daterange").datepicker();


	 $(document).delegate('.btnOTVencidas_EditarHT', 'click', function(event) 
	 {
	 	event.preventDefault();
	 	var idOt = $(this).attr("idOT");
	 	localStorage.setItem("wsp_epsa_idOT", JSON.stringify({tipo: "Vista", idOT : idOt}));
	 	
	 	var objParametros = {
					"Parametro": "",
					"fechaIni" : "",
					"fechaFin" : "",
					"fechaIniCump" : "",
					"fechaFinCump" : "",
					"Edicion" : true};

		localStorage.setItem("wsp_epsa_otVer_Parametros", JSON.stringify(objParametros));    

	 	window.location.replace("editarOrden.html");
	 });

	$("#frmOTVencidas_Buscar").on("submit", function(ev)
		{
			ev.preventDefault();

			$.post('../server/php/scripts/cargarOrdenes.php', 
				{usuario : Usuario.id, Estado : "1, 3, 4"
				}, function(data, textStatus, xhr) 
			{
				if (data != 0)
				{
					var fecha = obtenerFecha();
					var tds = "";
					$.each(data, function(index, val) 
					{
						 tds += '<tr>';
			                tds += '<td><button class="btn btn-warning btnOTVencidas_EditarHT" idOT="' + val.id + '"><i class="icon wb-edit"></i></button></td>';
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
			                tds += '<td>' + restaFechas(val.fechaCreacion, fecha) + '</td>';	
			                tds += '<td></td>';
			             tds += '</tr>';
					});
					$("#tblOTVencidas_Resultados").crearDataTable(tds);
				} else
				{
					var mensaje = "No se encontraron Actividades Sin Asignar";
					Mensaje("Error", mensaje);
				}
			}, "json");
		});

	$("#frmOTVencidas_Buscar").trigger('submit');
}
restaFechas = function(f1,f2)
 {
 	var aFecha1 = f1.split('-'); 
	var aFecha2 = f2.split('-'); 

 	var fecha1 = new Date(aFecha1[0], aFecha1[1],aFecha1[2].substring(0, 2));
	var fecha2 = new Date(aFecha2[0], aFecha2[1],aFecha2[2].substring(0, 2));
	var diasDif = fecha2.getTime() - fecha1.getTime();
	var dias = Math.round(diasDif/(1000 * 60 * 60 * 24));

	/*
	 var aFecha1 = f1.split('-'); 
	 var aFecha2 = f2.split('-'); 
	 var fFecha1 = Date.UTC(aFecha1[0],aFecha1[1]-1,aFecha1[2]); 
	 var fFecha2 = Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2]); 
	 var dif = fFecha2 - fFecha1;
	 var dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
	 */
	 return dias;
 }
misActividades();

function misActividades()
{
	misActividades_cargarActividades();	
}

function misActividades_cargarActividades()
{
	$.post('../server/php/scripts/cargarOrdenesAsignadas.php', {usuario : Usuario.id}, function(data, textStatus, xhr) 
	{
		if (data != 0)
		{
			$("#cntMisActividades_OTAsignadas div").remove();

			var tds = "";
			$.each(data, function(index, val) 
			{
				tds += '<a href="panelOT.html?id='+ val.id +'" class="col-md-6">';
					tds += '<div class="widget widget-shadow bg-blue-600 white margin-5" id="widgetLinepoint">';
						tds += '<div class="widget-title white">';
							tds += '<div class="col-xs-6">';
								tds += '<div class="counter">';
									tds += '<span class="counter-number font-weight-medium white">' + val.id + '</span>';
									tds += '<div class="counter-label"><small>id</small></div>';
								tds += '</div>';
							tds += '</div>';
							tds += '<div class="col-xs-6">';
								tds += '<div class="counter">';
									tds += '<span class="counter-number font-weight-medium white">' + val.codigoRadicado + '</span>';
									tds += '<div class="counter-label"><small>Radicado</small></div>';
								tds += '</div>';
							tds += '</div>';
							tds += '<div class="col-xs-6">';
								tds += '<div class="counter">';
									tds += '<span class="counter-number font-weight-medium white">' + val.Codigo + '</span>';
									tds += '<div class="counter-label"><small>OT</small></div>';
								tds += '</div>';
							tds += '</div>';
							tds += '<div class="col-xs-6 text-right">';
								tds += '<div class="counter">';
									tds += '<small>Fecha de Entrega</small>';
		                        	tds += '<p class="font-size-30 text-nowrap">' + val.fechaEntrega+ '</p>';
								tds += '</div>';
							tds += '</div>';
						tds += '</div>';
		                tds += '<div class="widget-content">';
		                  tds += '<div class="padding-top-25 padding-horizontal-30">';
		                    tds += '<div class="row no-space">';
		                      tds += '<div class="col-xs-12">'
		                        tds += '<h2><i>' + val.Nombre + '</i></h2>';
		                      tds += '</div>'
		                      tds += '<div class="col-xs-6">';
		                        tds += '<p><strong>' + val.Zona + '</strong></p>';
		                        tds += '<p> ' + val.Localidad + '</p>';
		                        tds += '<p> ' + val.Direccion + '</p>';
		                      tds += '</div>';
		                      tds += '<div class="col-xs-6 text-right">';
		                      	tds += '<small>Numero de Actividades</small>';
		                        tds += '<p class="font-size-30 text-nowrap">' + val.Actividades + '</p>';
		                      tds += '</div>';
		                      tds += '</div>';
		                      tds += '<div class="col-xs-6 text-right">';
		                    tds += '</div>';
		                  tds += '</div>';
		                tds += '</div>';
					tds += '</div>';
				tds += '</a>';

			});
			$("#cntMisActividades_OTAsignadas").append(tds);
		} else
		{

		}
	}, "json");
}
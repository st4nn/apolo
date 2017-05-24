home();

function home()
{
	$("#lblHome_Usuario").text(Usuario.nombre);

	$.post('../server/php/scripts/cargarHomeOT.php', {usuario: Usuario.id}, function(data, textStatus, xhr) 
	{
		$("#tblHome_Ordenes tbody tr").remove();
		$("#tblHome_OrdenesVencidas tbody tr").remove();
		var tds = "";
		var tds2 = "";
		$.each(data, function(index, val) 
		{
			tds += '<tr>';
				tds += '<td>' + index + '</td>';
				if (val.v0.Cantidad > 0)
				{
					tds += '<td><a href="#">' + val.v0.Cantidad + '</a></td>';
				} else
				{
					tds += '<td>' + val.v0.Cantidad + '</td>';
				}

				if (val.v1.Cantidad > 0)
				{
					tds += '<td><a href="#">' + val.v1.Cantidad + '</a></td>';
				} else
				{
					tds += '<td>' + val.v1.Cantidad + '</td>';
				}

				if (val.v2.Cantidad > 0)
				{
					tds += '<td><a href="#">' + val.v2.Cantidad + '</a></td>';
				} else
				{
					tds += '<td>' + val.v2.Cantidad + '</td>';
				}
			tds += '</tr>';

			tds2 += '<tr>';
				tds2 += '<td>' + index + '</td>';
				if (val.v3.Cantidad > 0)
				{
					tds2 += '<td><a href="#">' + val.v3.Cantidad + '</a></td>';
				} else
				{
					tds2 += '<td>' + val.v3.Cantidad + '</td>';
				}

				if (val.v4.Cantidad > 0)
				{
					tds2 += '<td><a href="#">' + val.v4.Cantidad + '</a></td>';
				} else
				{
					tds2 += '<td>' + val.v4.Cantidad + '</td>';
				}

				if (val.v5.Cantidad > 0)
				{
					tds2 += '<td><a href="#">' + val.v5.Cantidad + '</a></td>';
				} else
				{
					tds2 += '<td>' + val.v5.Cantidad + '</td>';
				}
			tds2 += '</tr>';
		});
		$("#tblHome_Ordenes tbody").append(tds);
		$("#tblHome_OrdenesVencidas tbody").append(tds2);
	}, "json");

	$.post('../server/php/scripts/cargarGraficaEjecucion.php', {usuario : Usuario.id}, function(data, textStatus, xhr) {
		if (data != 0)
		{
			var labels = [], datasets = [], datas = [], zonas = [];
			var objTmp = {}, idx = 0;
			
			$.each(data.Estados, function(index, val) 
			{
				labels.push(val);
				idx = 0;
				$.each(data.Zonas, function(idxZona, zona) 
				{
					zonas[idx] = zona;
					idx++;
					if (data.Resultados[zona][val] == undefined)
					{
						data.Resultados[zona][val] = 0;	
					}	else
					{
						data.Resultados[zona][val] = parseInt(data.Resultados[zona][val]);
					}
				});

			});

			$.each(data.Resultados, function(index, val) 
			{
				$.each(data.Estados, function(idxDatos, datos) 
				{
					datas.push(val[datos]);
				}); 

				objTmp = {
	  				label: "",
	  				fillColor : "rgba(rgbStyle,0.5)",
	  				strokeColor : "rgba(rgbStyle,0.8)",
	  				highlightFill : "rgba(rgbStyle,0.75)",
	  				highlightStroke : "rgba(rgbStyle,1)",
	  				data : datas
	  			};
	  			datas = [];
	  			datasets.push(objTmp);

			});
	  		
	  		var barChartData = {labels: labels, datasets :datasets};

			var ctx = document.getElementById("canvas").getContext("2d");

		  		var objRGB = "";
		  		
		  		var tds = "";

		  		$.each(barChartData.datasets, function(index, val) 
		  		{	
		  			objRGB = randomScalingFactor() + "," + randomScalingFactor() + "," + randomScalingFactor();

		  			barChartData.datasets[index].label = zonas[index];
		  			barChartData.datasets[index].fillColor = val.fillColor.replace("rgbStyle", objRGB);
		  			barChartData.datasets[index].strokeColor = val.strokeColor.replace("rgbStyle", objRGB);
		  			barChartData.datasets[index].highlightFill = val.highlightFill.replace("rgbStyle", objRGB);
		  			barChartData.datasets[index].highlightStroke = val.highlightStroke.replace("rgbStyle", objRGB);

		  			//

		  			tds += '<a class="col-md-6 btn btn-outline btn-default"><i class="icon wb-large-point" style="color : rgb(' + objRGB + ');"></i>' + zonas[index] + '</a>';
		  		});

		  		$("#cntConvenciones").append(tds);

	  		var chart = new Chart(ctx).Bar(barChartData, {
		  			responsive: true,
		        	barShowStroke: true
		  		});
			
		} else
		{
			$("#cntGraficaEjecucion").hide();
		}
	}, "json");

	var randomScalingFactor = function(){
		      return Math.round(Math.random()*255);
		    };
}

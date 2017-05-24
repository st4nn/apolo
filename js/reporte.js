var repMap = null;
misActividades();

function misActividades()
{
	$("#btnLevantamiento_ActualizarReporte").on("click", function(evento)
	{
		evento.preventDefault();
		cargarOrdenes();
	});

	$("#btnLevantamiento_ActualizarReporte").trigger('click');

	$(document).delegate('.btnLevantamiento_AbrirFicha', 'click', function(event) 
	{
    var idProyecto = $(this).attr("idOT");
		event.preventDefault();
		$("#cntLevantamiento_Busqueda").hide();
		$("#cntLevantamiento_Ficha").slideDown();
    $("#txtReporte_idProyecto").val(idProyecto);
    cargarFicha();
	});

	$("#btnLevantamiento_VolverALaBusqueda").on("click", function(evento)
	{
		evento.preventDefault();
    $("#bntReporte_AbrirMapa").trigger('click');
		$("#cntLevantamiento_Ficha").hide();
		$("#cntLevantamiento_Busqueda").slideDown();
	});

	$('#bntReporte_AbrirTabla').on("click", function()
	{
		$('#bntReporte_AbrirTabla').on("click", function()
		{
		  $("#cntReporte_Tabla table").crearDataTable("", function()
		    {
		      $("#cntReporte_Tabla table").attr("style", "overflow-x: auto; width: 0px;");
		    });
		  
		});
	});

	$("#btnReporte_Archivos_DescargarTodos").on("click", function(evento)
  {
     evento.preventDefault();
     $("#imgReporte_Archivos_Cargando").show();
    $.post('../server/php/proyecto/crearZIP.php', {idProyecto: $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
    {
      $("#imgReporte_Archivos_Cargando").hide();
      if (data != 0)
      {
        document.location=data;
      } else
      {
        Mensaje("Error", "Hubo un error en la descarga: " + data, "danger");
      }
    }).fail(function()
    {
      $("#imgReporte_Archivos_Cargando").hide();
    });
  });

  $("#btnReporte_DescargarKML").on("click", function(evento)
  {
    evento.preventDefault();
    $.post('../server/php/proyecto/crearKML.php', {idProyecto: $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
    {
      if (data != 0)
      {
        //abrirURL(data);
        document.location=data;
      } else
      {
        Mensaje("Error", "Hubo un error en la descarga", "danger");
      }
    });
  });

  $(document).delegate('.btnReporte_ArchivosEliminar', 'click', function(event) 
  {
    event.preventDefault();

    var obj = this;

    alertify.set({"labels" : {"ok" : "Si, Borrar", "cancel" : "No, Volver"}});
    alertify.confirm("Confirma que desea borrar este elemento?", function (ev) 
    {
      if (ev)
      {
        var ruta = $(obj).parent("h4").find("[href]");
        ruta = $(ruta).attr("href");
        
        $.post("../server/php/eliminarArchivo.php", {ruta: ruta}, function(data)
        {
          if (data == 1)
          {
            $(obj).parent("h4").parent("div").parent("div").parent("li").remove();
          } else
          {
            Mensaje("Error", data);
          }

        })
      } 
    });
  });
}

function cargarOrdenes()
{
	$("#tblLevantamiento_Resultados tbody tr").remove();

	$.post('../server/php/scripts/cargarOrdenes_Levantamientos.php', 
		{usuario : Usuario.id, Estado : "1, 2, 3"
		}, function(data, textStatus, xhr) 
	{
		if (data != 0)
		{
			var fecha = obtenerFecha();
			var tds = "";
			$.each(data, function(index, val) 
			{
				 tds += '<tr>';
	                tds += '<td><button class="btn btn-info btnLevantamiento_AbrirFicha" idOT="' + val.Prefijo + '"><i class="icon wb-eye"></i></button></td>';
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
			$("#tblLevantamiento_Resultados").crearDataTable(tds);
		} else
		{
			var mensaje = "No se encontraron Actividades Sin Asignar";
			Mensaje("Error", mensaje);
		}
	}, "json");
}

restaFechas = function(f1,f2)
 {
 	var aFecha1 = f1.split('-'); 
	var aFecha2 = f2.split('-'); 

 	var fecha1 = new Date(aFecha1[0], aFecha1[1],aFecha1[2].substring(0, 2));
	var fecha2 = new Date(aFecha2[0], aFecha2[1],aFecha2[2].substring(0, 2));
	var diasDif = fecha2.getTime() - fecha1.getTime();
	var dias = Math.round(diasDif/(1000 * 60 * 60 * 24));

	 return dias;
 }

markerSelect = null;

 function iniciarMapa(Lat, Lon, contenedor)
{
  if (typeof GMaps == "undefined")
  {
    
  } else
  {
    Lat = 10.97575;
    Lon = -74.7893333333333;

    if (contenedor === undefined)
    {
      contenedor = '#cntReporte_Mapa';
    }
    if (Lat != undefined && Lon != undefined)
    {
      repMap = new GMaps({
        el: contenedor,
        lat : Lat,
        lng : Lon,
        zoomControl: true,
        zoomControlOpt: {
          style: "SMALL",
          position: "TOP_LEFT"
        },
        panControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        overviewMapControl: true

      });

      repMap.addStyle({
        styledMapName: "Styled Map",
        styles: $.components.get('gmaps', 'styles'),
        mapTypeId: "map_style"
      });

      repMap.setStyle("map_style");

      var tIcono = '../assets/images/icons/poste_selected.png';
      
      markerSelect = repMap.addMarker({
          lat: 0,
          lng: 0,
          icon : tIcono
        });
      
    }
  }
}


function cargarFicha()
{
   $("#cntReporte_Imagenes div").remove();
   $("#cntReporte_Datos ul").remove();

  if (repMap != null)
  {
    repMap.removeMarkers();
  }

  $("#cntReporte_Tabla table").remove();
  $("#cntReporte_Tabla div").remove();
  $("#cntReporte_btnPostes div").remove();
  $("#cntReporte_Fotos li").remove();
  iniciarMapa();

  var tmpContador = "";

  $.post('../server/php/proyecto/cargarFotos.php', {Usuario : Usuario.id, idProyecto : $("#txtReporte_idProyecto").val(), codPoste :  ""}, 
    function(fotos, textStatus, xhr) 
    {
      tds = "";
      var idx = 0;

      if (fotos != 0)
      {
        $.each(fotos, function(index, val) 
        {
          if (tmpContador != val.idRecurso)
          {
            $("#cntReporte_Fotos_" + tmpContador).magnificPopup(
            {
              delegate: 'a', 
              type: 'image', 
              gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] 
            }});

            tmpContador = val.idRecurso;
            idx = 0;

            tds = '<li class="list-group-item">';
              tds += '<div class="media">';
                tds += '<div class="media-body">';
                  tds += '<h4 class="media-heading">' + val.nomUsuario;
                    tds += '<span> <span id="lblReporte_CantFotos_' + val.idRecurso + '" class="badge badge-radius badge-info">0</span> fotos del ' + val.idRecurso + '</span>';
                  tds += '</h4>';
                  tds += '<small id="id="lblReporte_Fecha_' + val.idRecurso + '">' + val.fechaCargue + '</small>';
                  tds += '<div id="cntReporte_Fotos_' + val.idRecurso + '" class="col-md-12">';
                  tds += '</div>';
                tds += '</div>';
              tds += '</div>';
            tds += '</li>';

            $("#cntReporte_Fotos").append(tds);
          }
          idx++;

          $("#lblReporte_CantFotos_" + val.idRecurso).text(idx);
          $("#lblReporte_Fecha_" + val.idRecurso).text(val.fechaCargue);
            tds = '<a class="inline-block margin-5" href="' + val.Ruta.replace("../", '../server/php/') + '">';
              tds += '<img class="img-responsive margin-top-5 imgReporte_FotoZoomIn" style="border-radius: 5px;" src="' + val.Ruta.replace("../Archivos/Levantamientos", '../server/php/Archivos/Levantamientos/thumbnails') + '" alt="...">';
            tds += '</a>';
          $("#cntReporte_Fotos_"  + val.idRecurso).append(tds);
        });

        $("#cntReporte_Fotos_" + tmpContador).magnificPopup(
            {
              delegate: 'a', 
              type: 'image', 
              gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] 
            }});

        //$(".mfp-img").pinchzoomer({ imageOptions:{ preloaderUrl:"../assets/preloader.gif"} });
      }
    }, "json");

  $.post('../server/php/proyecto/cargarLevantamiento.php', {Usuario : Usuario.id, idProyecto : $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
  {
    Markers = {};
    tmpLastMarker = null;
    if (data.length > 0)
    {
      var arrCoord = {};
      var tds = "";
      var tds2 = "";
      var idx = -1;
      var idTabla = obtenerPrefijo();
      var tmpData = {};

      var objPostes = {};
      var tmpJSON = {};
      var tmpPath = {};

      var filas = {};
      var encabezados = [];

      tds = '<table id="tblReporte_' + idTabla + '" class="table table-hover" style="display: block;overflow-x: auto;">';
      var idy = 0;
      tds += '<thead><tr><th></th><th></th>';
      $.each(data, function(index, val) 
      {
        val.Datos = JSON.parse(val.Datos);
        encabezados[idy] = val.Datos.CodPoste;
        tds += '<th>' + val.Datos.CodPoste + '</th>';

        $.each(val.Datos, function(indexD, valD) 
        {
          if (typeof(filas[indexD]) == "undefined")
          {
           filas[indexD] = [];
          }
          filas[indexD][val.Datos.CodPoste] = valD;          
        });

        idy++;

        if (val.Datos.CoordX != "")
        {
          if (!isNaN(val.Datos.CoordX))
          {
            idx++;
            objPostes[val.Datos.CodPoste] = [val.Datos.CoordX, val.Datos.CoordY];
            repMapa_AgregarMarcador(val.Datos);
          }
        }
        if (val.Datos.Tramo != null && val.Datos.Tramo != "" && val.Datos != "null")
        {
          if (objPostes[val.Datos.Tramo] != undefined)
          {
            tmpPath = [objPostes[val.Datos.Tramo], objPostes[val.Datos.CodPoste]];
          
            repMapa_AgregarLinea(tmpPath);
          }
        }
      });

      tds += '</tr></thead>';
      tds += '<tbody>';
      
      $.each(filas, function(index, val) 
      {
        tds += '<tr><td></td>';

        tds += '<td>' + index.replace(/_/g, ' ') + '</td>';

        $.each(encabezados, function(indice, codPoste) 
        {
           if (typeof(val[codPoste]) == "undefined")
           {
              tds += '<td>No Aplica</td>';
           } else
           {
              tds += '<td>' + val[codPoste] + '</td>';
           }
        });

        tds += '</tr>';
      });

      tds += '</tbody>';

      tds += '</table>';
      $("#cntReporte_Tabla").append(tds);
      $("#tblReporte_" + idTabla).crearDataTable("");

      if (idx >= 0)
      {
        var arrCoord = data[idx].coordenadas.split("#");

        repMap.setCenter(arrCoord[0].replace(",", "."), arrCoord[1].replace(",", "."));
        repMap.setZoom(15);
      } else
      {
        Mensaje("Error", "No se encontró niguna coordenada Válida en el Proyecto", "danger");
      }
    }
  }, "json");

  $.post('../server/php/listarArchivos.php', {ruta: 'Panama/' + $("#txtReporte_idProyecto").val()}, function(archivos) 
      {
        $("#cntReporte_Archivos li").remove();
        $("#btnReporte_Archivos_DescargarTodos").attr("idProyecto", $("#txtReporte_idProyecto").val());
        $("#frmReporte_Archivos").attr("action", "../server/php/subirArchivo.php?Ruta=Panama/" + $("#txtReporte_idProyecto").val());
        if (archivos.error === undefined)
        {
          var ext = "";
          var arrExt;
          var tmpDirectorio = "";
          var regDirectorio = "";
          var tds2 = "";
          $.each(archivos, function(nomDirectorio, cntDirectorio) 
          {
            if (regDirectorio != nomDirectorio)
            {
              regDirectorio = nomDirectorio;
              tds2 += '<li class="list-group-item">';
              if (regDirectorio != "raiz")
              {

                      tds2 += '<h4 class="example-title">' + regDirectorio + '</h4>';
              } else
              {
                tds2 += '<h4 class="example-title"></h4>';
              }
                    tds2 += '</li>';
            }

            
            $.each(cntDirectorio, function(idx, Archivo) 
            {
              arrExt = Archivo.nomArchivo.split(".");
              ext = arrExt[arrExt.length - 1];

              tds2 += '<li class="list-group-item">';
                      tds2 += '<div class="media">';
                        tds2 += '<div class="media-left">';
                          tds2 += '<a class="avatar" href="javascript:void(0)">';
                            tds2 += '<img src="../assets/images/fileIcons/' + ext.toLowerCase() + '.png" alt=""></a>';
                        tds2 += '</div>';
                        tds2 += '<div class="media-body">';
                          tds2 += '<h4 class="media-heading">';
                            tds2 += '<a class="name" href="../server/php/' + Archivo.ruta + "/" + Archivo.nomArchivo + '" target="_blank">' + Archivo.nomArchivo + '</a>';
                            tds2 += '<a class="btn btn-danger pull-right btnReporte_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
                          tds2 += '</h4>';
                          tds2 += '<p class="list-group-item-text">';
                            tds2 +='<small><i>' + Archivo.fecha + '</i></small>';
                          tds2 += '</p>';
                        tds2 += '</div>';
                      tds2 += '</div>';
                    tds2 += '</li>';
            });
          });
          
          $("#cntReporte_Archivos").append(tds2);
        } 
      }, "json");

}

function repMapa_AgregarMarcador(datos)
  {
    if (datos === undefined)
    {
      datos = {};
    }
   
   var lat = datos.CoordX;
   var lon = datos.CoordY;

    if (lat != "" && lon != "")
    {
      lat = lat.replace(",", ".");
      lon = lon.replace(",", ".");
      
      var contenido = "";
      //datos.Datos = JSON.parse(datos.Datos);
      
      contenido += '<div>';
        contenido += '<h4><strong>' + datos.CodPoste + '</strong></h4>';
        contenido += '<div class="col-md-12">';
        
        $.each(datos, function(index, val) 
        {
          contenido += '<div class="col-md-6">';
            contenido += '<h6><small>' + index + ':</small> <strong>' + val + '</strong></h6>';
          contenido += '</div>';
        });
        contenido += '</div>';
      contenido += '</div>';

      var tIcono = '../assets/images/icons/poste.png';
      if (datos.Tipo_Elemento !== undefined)
      {
        tIcono = '../assets/images/icons/i' + datos.Tipo_Elemento + '.png'
      }
      Markers[datos.CodPoste] = repMap.addMarker({
          lat: lat,
          lng: lon,
          title : datos.CodPoste,
          icon : tIcono,
          /*infoWindow: {
            content: contenido
          },*/
          click : function(e)
          {
            seleccionarMarker(datos.CodPoste);
          }
        });

      repMap.drawOverlay({
        lat: lat,
        lng: lon,
        content: '<div class="badge badge-info badge-sm">' + datos.CodPoste + '</div>'
      });
        
    }
  }


  function repMapa_AgregarLinea(path)
{
  repMap.drawPolyline({
  path: path,
  strokeColor: '#715146',
  strokeOpacity: 0.6,
  strokeWeight: 5
});
}

function seleccionarMarker(codPoste, callback)
{
  if (callback === undefined)
  {    callback = function(){};  }

  var vLat = Markers[codPoste].getPosition().lat();
  var vLng = Markers[codPoste].getPosition().lng();

  markerSelect.setPosition({lat : vLat, lng : vLng});
  repMap.setCenter({lat : vLat, lng : vLng});
  var zoom = repMap.getZoom();
  if (zoom < 19)
  {
    repMap.setZoom(19);
  }

  $("#cntReporte_Imagenes div").remove();
  $("#cntReporte_Datos ul").remove();

  $.post('../server/php/proyecto/cargarArchivos_Poste.php', 
  {Usuario : Usuario.id, codPoste : codPoste, idProyecto : $("#txtReporte_idProyecto").val()}, 
  function(data, textStatus, xhr) 
  {
    var tds = '';
    if (data.Imagenes != 0)
    {
      $.each(data.Imagenes, function(index, val) 
      {
        tds += '<div class="col-xs-6">';
          tds += '<div class="margin-5">';
            tds += '<a class="" target="_blank" href="' + val.Ruta.replace("../", '../server/php/') + '">';
              tds += '<img class="media-object" style="border-radius: 5px;" src="' + val.Ruta.replace("../Archivos/Levantamientos", '../server/php/Archivos/Levantamientos/thumbnails') + '">';
            tds += '</a>';
          tds += '</div>';
        tds += '</div>';
      });
    } else
    {
            tds += '<div class="alert dark alert-danger alert-dismissible" role="alert">';
              tds += 'Aún no hay archivos cargados para ese punto';
            tds += '</div>';
    }

    var tdsData = '';

    if (data.Datos != 0)
    {
      var jDatos = JSON.parse(data.Datos.Datos);
      tdsData += '<ul class="list-group list-group-dividered list-group-full">';
      $.each(jDatos, function(index, val) 
      {
        tdsData += '<li class="list-group-item bg-blue-grey-100"><strong>' + index.replace(/_/g, ' ') + ': </strong> ' + val + '</li>';
      });
      tdsData += '</ul>';
    }

    
    $("#cntReporte_Datos").append(tdsData);
    $("#cntReporte_Imagenes").append(tds);
  }, 'json');

  callback();
}
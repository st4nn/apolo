editarOrden();
var tmpIdMunicipio = "";
function editarOrden()
{
	$("#frmEditarOrden_Congelar").on("submit", function(evento)
	{
		evento.preventDefault();
		var tInforme = $("#txtEditarOrden_Congelar_Informe").val();
		var tAutorizo = $("#txtEditarOrden_Congelar_Quien_Autorizo").val();
		if (tInforme == '')
		{
			$("#txtEditarOrden_Congelar_Informe").focus();
		} else
		{
			if (tAutorizo == '')
			{
				$("#txtEditarOrden_Congelar_Quien_Autorizo").focus();
			} else
			{
				/*$.post('../', {param1: 'value1'}, function(data, textStatus, xhr) {
					/*optional stuff to do after success */
				//});*/
			}
		}
	});

	editarOrden_NuevaOrden();
	editarOrden_CargarArchivo();
	editarOrden_cargarFunciones();

	$("#btnverOrden_Borrar").on("click", function(event)
		{
			event.preventDefault();

			alertify.set({"labels" : {"ok" : "Si, Borrar", "cancel" : "No, Volver"}});
			alertify.confirm("Confirma que desea borrar este elemento?", function (ev) 
			{
				if (ev)
				{
					$.post('../server/php/scripts/borrarOT.php', {usuario: Usuario.id, idOT : $("#txteditarOrden_idOt").val(), idEstado : 8}, function(data, textStatus, xhr) 
					{
						Mensaje("Hey", "La OT ha sido descartada");
						window.location.replace("verOrden.html");
					});
				} 
			});
		});

	$("#btnverOrden_Anular").on("click", function(event)
		{
			event.preventDefault();

			alertify.set({"labels" : {"ok" : "Si, Anular", "cancel" : "No, Volver"}});
			alertify.confirm("Confirma que desea Anular este elemento?", function (ev) 
			{
				if (ev)
				{
					$.post('../server/php/scripts/borrarOT.php', {usuario: Usuario.id, idOT : $("#txteditarOrden_idOt").val(), idEstado : 2}, function(data, textStatus, xhr) 
					{
						Mensaje("Hey", "La OT ha sido Anulada");
						window.location.replace("verOrden.html");
					});
				} 
			});
		});

	$("#btnverOrden_Rechazar").on("click", function(event)
		{
			event.preventDefault();

			alertify.set({"labels" : {"ok" : "Si, Rechazar", "cancel" : "No, Volver"}});
			alertify.confirm("Confirma que desea Rechazar este elemento?", function (ev) 
			{
				if (ev)
				{
					$.post('../server/php/scripts/borrarOT.php', {usuario: Usuario.id, idOT : $("#txteditarOrden_idOt").val(), idEstado : 5}, function(data, textStatus, xhr) 
					{
						Mensaje("Hey", "La OT ha sido Rechazada");
						window.location.replace("verOrden.html");
					});
				} 
			});
		});


	$("#btnverOrden_VisitaFallida").on("click", function(event)
		{
			event.preventDefault();

			alertify.set({"labels" : {"ok" : "Si, Anunciar", "cancel" : "No, Volver"}});
			alertify.confirm("Confirma que desea Anunciar Visita Fallida a este elemento?", function (ev) 
			{
				if (ev)
				{
					$.post('../server/php/scripts/borrarOT.php', {usuario: Usuario.id, idOT : $("#txteditarOrden_idOt").val(), idEstado : 6}, function(data, textStatus, xhr) 
					{
						Mensaje("Hey", "La OT ha sido Clasificada");
						window.location.replace("verOrden.html");
					});
				} 
			});
		});

	$("#btnverOrden_CancelarOT").on("click", function(event)
		{
			event.preventDefault();

			$("#cntEditarOrden_Congelar").modal('show');
			

		});

	$("#txteditarOrden_fechaOcen, #txteditarOrden_RadicadoFecha").datepicker({
		    clearBtn: true,
		    language: "es",
		    orientation: "top auto",
		    daysOfWeekHighlighted: "0",
		    autoclose: true,
		    todayHighlight: true
		});
	$("#txteditarOrden_horaOcen, #txteditarOrden_RadicadoHora").timepicker({ 'timeFormat': 'H:i:s',  'scrollDefault': 'now'  });

	$("#txteditarOrden_Zona").cargarCombo("Zonas", function()
	{
		$("#txteditarOrden_Zona").prepend('<option value="0">Seleccione una Zona</option>');
	});
	$("#txteditarOrden_Zona").on("change", txteditarOrden_Zona_Change);
	

	$("input:radio[name=radeditarOrden_TP]").on("click", function()
	{
		$("#txteditarOrden_tipoProyecto").val($("input:radio[name=radeditarOrden_TP]:checked").val());
	});
	$("#cnteditarOrden_btnTipoProyecto button").on("click", editarOrden_checkFunciones);

	$("#frmeditarOrden").on("submit", frmeditarOrden_Submit);

	$(document).delegate('.btneditarOrden_ArchivosEliminar', 'click', function(event) 
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
				
				$.post("../server/php/scripts/eliminarArchivo.php", {ruta: ruta}, function(data)
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

	$(document).delegate(".inputControl", "change" ,function()
    {
      var contenedor = $(this).parent("span").parent("span").parent("div");
      var texto = $(contenedor).find(".inputText");
      var archivo = $(this).val();
      archivo = archivo.split("\\");
      archivo = archivo[(archivo.length - 1)];
      $(texto).val(archivo);
      var barra = $(contenedor).parent("form").find(".progress-bar");
      var percentVal = '0%';
      $(barra).width(percentVal);
      $(barra).text(percentVal);
    });
}

function frmeditarOrden_Submit(evento)
{
	function frmeditarOrden_Submit_Enviar()
	{
		$("#frmeditarOrden").generarDatosEnvio("txteditarOrden_", function(datos)
			{
				$.post("../server/php/scripts/editarOT.php",
				{datos: datos, idLogin : Usuario.id}, function(data, textStatus, xhr)
				{
					if (data >= 0)
		          	{
		          		$("#cnteditarOrden_Funciones .chkeditarOrden_Actividad[idRelacion]").removeAttr('idRelacion');
			            Mensaje("Ok", "Los cambios de la OT han sido guardados."); 
			            editarOrden_CargarOT();
			        } else
			        {
			            Mensaje("Error", data);    
			        }
				});
			});
	}
	evento.preventDefault();
	var objActividades = $("#cnteditarOrden_Funciones .chkeditarOrden_Actividad:checked");
	var objActividadesBorradas = $("#cnteditarOrden_Funciones .chkeditarOrden_Actividad:not(:checked)[idRelacion]");
	
	if (objActividades.length > 0)
	{
		var tds = "";
		var tds2 = "";
		var tds3 = "";
		$.each(objActividades, function(index, val) 
		{
			if ($(val).attr("idRelacion") === undefined)
			{
			 	tds2 += $(val).attr("id").replace("txteditarOrden_FuncionChk", "") + ",";
			} else
			{
				tds += $(val).attr("id").replace("txteditarOrden_FuncionChk", "") + ",";
			}
		});

		$.each(objActividadesBorradas, function(index, val) 
		{
			tds3 += $(val).attr("idRelacion") + ",";
		});
		$("#txteditarOrden_Funciones").val(tds);
		$("#txteditarOrden_FuncionesNuevas").val(tds2);
		$("#txteditarOrden_FuncionesBorradas").val(tds3);

		if (tds2 == "" && tds3 == "")
		{
			frmeditarOrden_Submit_Enviar();
		} else
		{
			alertify.set({"labels" : {"ok" : "Si, Enviar", "cancel" : "No, Volver"}});
			alertify.confirm("Ha modificado las actividades asociadas, por lo que será necesario ajustar la Hoja de Trabajo, \n¿está seguro que desa continuar?", 
			function (ev) 
			{
				if (ev)
				{
					frmeditarOrden_Submit_Enviar();
				} 
			});
		}

		

	} else
	{
		Mensaje("Hey", "Debe seleccionar por lo menos una actividad para esta OT");
		return false;
	}
	
}
function editarOrden_cargarFunciones()
{
	$("#cnteditarOrden_Funciones div").remove();
	$.post('../server/php/scripts/cargarFunciones.php', {}, function(data, textStatus, xhr) 
	{
		var tds = "";
		$.each(data, function(index, val) 
		{
			tds += '<div class="col-md-4">';
				tds += '<div class="checkbox-custom checkbox-primary">';
					tds += '<input type="checkbox" id="txteditarOrden_FuncionChk' + val.id + '" class="chkeditarOrden_Funcion">';
					tds += '<label for="txteditarOrden_FuncionChk' + val.id + '">' + val.Nombre + '</label>';
				tds += '</div>';
				tds += '<div id="cnteditarOrden_Funcion' + val.id + '" class="margin-left-25 hide"></div>';
			tds += '</div>';
		});
		$("#cnteditarOrden_Funciones").append(tds);
		
		$(".chkeditarOrden_Funcion").change(editarOrden_chkFunciones_Click);

		$.post('../server/php/scripts/cargarFunciones_Actividades.php', {}, function(data, textStatus, xhr) 
		{
			var tds = "";
			$.each(data, function(index, val) 
			{
				tds = "";
				tds += '<div class="checkbox-custom checkbox-success">';
					tds += '<input type="checkbox" id="txteditarOrden_FuncionChk' + val.idFuncion + '_' + val.idActividad + '" class="chkeditarOrden_Actividad">';
					tds += '<label for="txteditarOrden_FuncionChk' + val.idFuncion + '_' + val.idActividad + '">(<b>' + val.idActividad + '</b>) ' + val.nombreActividad+ '</label>';
				tds += '</div>';
				$("#cnteditarOrden_Funcion" + val.idFuncion).append(tds);
			});
			

			editarOrden_CargarOT();
		}, "json");
		
	}, "json");
}

function editarOrden_checkFunciones(evento)
{
	evento.preventDefault();
	$("#cnteditarOrden_Funciones .chkeditarOrden_Funcion").prop("checked", false).trigger("change");

	$(".cntRadeditarOrden_P").hide();
	


	var tipoProyecto = [1, 2, 3, 4, 5, 6, 7];
	tipoProyecto[1] = [1, 5, 7, 8, 9, 10, 11, 12, 13, 19];
	tipoProyecto[2] = [1, 2, 3, 5, 7, 8, 10, 12, 13, 20];
	tipoProyecto[3] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 21];
	tipoProyecto[4] = [2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18];
	tipoProyecto[5] = [2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18];
	tipoProyecto[6] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
	tipoProyecto[7] = [];

	var tiemposProyecto = [0, 4, 1, 5, 12, 15, 0, 0];

	var selTipoProyecto = $(this).attr("tipoProyecto");

	$("#txteditarOrden_Tiempo").val(tiemposProyecto[selTipoProyecto]);

	if ($("#cntRadeditarOrden_P" + selTipoProyecto).length)
	{
		$("#cntRadeditarOrden_P" + selTipoProyecto).show();
	} 
	$('#radeditarOrden_P' + selTipoProyecto + '_1').prop('checked', 'true');
	$("#txteditarOrden_tipoProyecto").val($("input:radio[name=radeditarOrden_TP]:checked").val());
	

	$.each(tipoProyecto[selTipoProyecto], function(index, val) 
	{
		$("#txteditarOrden_FuncionChk" + val).prop("checked", true).trigger("change"); 
	});

}

function editarOrden_chkFunciones_Click()
{
	var idFuncion = $(this).attr('id').replace("txteditarOrden_FuncionChk", "");
	if ($(this).is(":checked"))
	{
		$("#cnteditarOrden_Funcion" + idFuncion).slideDown();
	} else
	{
		$("#cnteditarOrden_Funcion" + idFuncion).slideUp();
		//$("#cnteditarOrden_Funcion" + idFuncion + " input[type=checkbox]").prop("checked", false); 
		//$("#txteditarOrden_FuncionChk5_ACT70007").prop('checked', true);
	}
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
function editarOrden_NuevaOrden()
{
	$("#txteditarOrden_Prefijo").val(obtenerPrefijo());
	$("#frmeditarOrden_Archivos").attr("action", "../server/php/subirArchivo.php?Ruta=OT/" + $("#txteditarOrden_Prefijo").val());
	$("#frmeditarOrden_Archivos")[0].reset();
	$("#cnteditarOrden_Archivos li").remove();
}
function editarOrden_CargarArchivo()
{
	$("#frmeditarOrden_Archivos").ajaxForm(
	{
		beforeSend: function() 
		{
		    var percentVal = '0%';
		    $("#txteditarOrden_ArchivoProgreso").width(percentVal);
		    $("#txteditarOrden_ArchivoProgreso").text(percentVal);
		},
		uploadProgress: function(event, position, total, percentComplete) {
		    
		    var percentVal = percentComplete + '%';
		    $("#txteditarOrden_ArchivoProgreso").width(percentVal);
		    $("#txteditarOrden_ArchivoProgreso").text(percentVal);
		},
		success: function() {
		    var percentVal = '100%';
		    $("#txteditarOrden_ArchivoProgreso").width(percentVal);
		    $("#txteditarOrden_ArchivoProgreso").text(percentVal);
		},
		complete: function(xhr) {
		  var respuesta = xhr.responseText;
		  if (respuesta.substring(0, 11) == "../archivos")
          {
          	var tds = "";
          	var arrArchivo = respuesta.split("/");
          	var arrExt = arrArchivo[arrArchivo.length - 1].split(".");
          	var nomArchivo = arrArchivo[arrArchivo.length - 1];
          	var ext = arrExt[arrExt.length - 1];

	          	tds += '<li class="list-group-item">';
	              tds += '<div class="media">';
	                tds += '<div class="media-left">';
	                  tds += '<a class="avatar" href="javascript:void(0)">';
	                    tds += '<img src="../assets/images/icons/' + ext.toLowerCase() + '.png" alt=""></a>';
	                tds += '</div>';
	                tds += '<div class="media-body">';
	                  tds += '<h4 class="media-heading">';
	                    tds += '<a class="name" href="' + respuesta.replace("../", "../server/") + '" target="_blank">' + nomArchivo + '</a>';
                    	tds += '<a class="btn btn-danger pull-right btneditarOrden_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
	                  tds += '</h4>';
	                tds += '</div>';
	              tds += '</div>';
	            tds += '</li>';

	        $("#cnteditarOrden_Archivos").append(tds);
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
		 }
	}); 

}

function editarOrden_CargarOT()
{
	var tOT = JSON.parse(localStorage.getItem('wsp_epsa_idOT'));  
	if (tOT === null)
	{
		window.location.replace("crearOrden.html");
	} else
	{
		$.post('../server/php/scripts/cargarOrden.php', {usuario : Usuario.id, idOT: tOT.idOT}, function(data, textStatus, xhr) 
		{
			$("#txtReporte_idProyecto").val(data.oT.Prefijo);
			cargarFicha();
			$("#lblVerOrden_Estado").text(data.oT.Estado)
			$("#lblEditarOrden_idOT").text(data.oT.id);
			$("#txteditarOrden_idOt").val(data.oT.id);
			$("#txteditarOrden_Prefijo").val(data.oT.Prefijo);
			$("#txteditarOrden_Nombre").val(data.oT.Nombre);
			$("#txteditarOrden_Codigo").val(data.oT.Codigo);
			$("#txteditarOrden_recibo").val(data.oT.Recibo);
			$("#txteditarOrden_Emision").val(data.oT.emision);
			$("#txteditarOrden_RadicadoCodigo").val(data.oT.codigoRadicado);
			var fechaOcen = data.oT.fechaOcen.split(" ");

			$("#txteditarOrden_fechaOcen").val(fechaOcen[0]);
			if (fechaOcen.length > 1)
			{
				$("#txteditarOrden_horaOcen").val(fechaOcen[1]);
			}

			fechaOcen = data.oT.fechaRadicado.split(" ");

			$("#txteditarOrden_RadicadoFecha").val(fechaOcen[0]);
			if (fechaOcen.length > 1)
			{
				$("#txteditarOrden_RadicadoHora").val(fechaOcen[1]);
			}
			
			$("#txteditarOrden_Alcance").val(data.oT.Alcance);
			tmpIdMunicipio = data.oT.idMunicipio;
			$("#txteditarOrden_Zona").val(data.oT.idZona).trigger('change');
			$("#txteditarOrden_Localidad").val(data.oT.Localidad);
			$("#txteditarOrden_Prioridad").val(data.oT.Prioridad);
			$("#txteditarOrden_Tiempo").val(data.oT.tiempo);

			$("#txteditarOrden_ContactoNombre").val(data.oT.contactoNombre);
			$("#txteditarOrden_ContactoTelefono").val(data.oT.contactoTelefono);
			$("#txteditarOrden_ContactoDireccion").val(data.oT.Direccion);


			var arrTP = data.oT.tipoProyecto.split("_");
			var btnTP = arrTP[0].replace("P", "");
			if (btnTP != "")
			{
				$("[tipoProyecto='" + btnTP + "']").trigger('click');
				
				$("#radeditarOrden_" + data.oT.tipoProyecto).trigger('click');

				$.each(data.actividades, function(index, val) 
				{
					if (!$("#txteditarOrden_FuncionChk" + val. idFuncion).is(":checked"))
					{
						$("#txteditarOrden_FuncionChk" + val. idFuncion).trigger("click");
					} 

					$("#txteditarOrden_FuncionChk" + val. idFuncion + "_" + val.idActividad).trigger("click");
					$("#txteditarOrden_FuncionChk" + val. idFuncion + "_" + val.idActividad).attr("idRelacion", val.id);
				});

				$(".chkeditarOrden_Actividad[idRelacion]").prop("checked", true);
			} 

			$.post('../server/php/listarArchivos.php', {ruta: 'OT/' + data.oT.Prefijo}, function(archivos) 
			{
				$("#cnteditarOrden_Archivos li").remove();
				$("#frmeditarOrden_Archivos").attr("action", "../server/php/subirArchivo.php?Ruta=OT/" + data.oT.Prefijo);
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
				                    tds2 += '<img src="../assets/images/icons/' + ext.toLowerCase() + '.png" alt=""></a>';
				                tds2 += '</div>';
				                tds2 += '<div class="media-body">';
				                  tds2 += '<h4 class="media-heading">';
				                    tds2 += '<a class="name" href="' + Archivo.ruta.replace("../", "../server/") + "/" + Archivo.nomArchivo + '" target="_blank">' + Archivo.nomArchivo + '</a>';
			                    	tds2 += '<a class="btn btn-danger pull-right btneditarOrden_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
				                  tds2 += '</h4>';
				                  tds2 += '<p class="list-group-item-text">';
									tds2 +='<small><i>' + Archivo.fecha + '</i></small>';
				                  tds2 += '</p>';
				                tds2 += '</div>';
				              tds2 += '</div>';
				            tds2 += '</li>';
						});
					});
					
					$("#cnteditarOrden_Archivos").append(tds2);
				} 
			}, "json");
			
		}, "json");
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

	iniciarMapa();

	$.post('../server/php/proyecto/cargarLevantamiento.php', {Usuario : Usuario.id, idProyecto : $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
	  {
	    Markers = {};
	    tmpLastMarker = null;
	    if (data.length > 0)
	    {
	      var arrCoord = {};
	      var idx = -1;
	      var objPostes = {};

	      $.each(data, function(index, val) 
	      {
	        val.Datos = JSON.parse(val.Datos);

	        if (val.Datos.CoordX != "")
	        {
	          if (!isNaN(val.Datos.CoordX))
	          {
	            idx++;
	            objPostes[val.Datos.CodPoste] = [val.Datos.CoordX, val.Datos.CoordY];
	            repMapa_AgregarMarcador(val.Datos);
	          }
	        }
	      });

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


var repMap = null;
var markerSelect = null;

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


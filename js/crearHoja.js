crearHoja();

function crearHoja()
{
	$(document).delegate('.btnCrearHoja_Ver', 'click', btnCrearHoja_Ver_Click);

	var nomArchivo = location.href;
            var arrNomArchivo = location.href.split("/");
            nomArchivo = arrNomArchivo[arrNomArchivo.length - 2] + "/" + arrNomArchivo[arrNomArchivo.length - 1];
            arrNomArchivo = nomArchivo.split("?");
            nomArchivo = arrNomArchivo[0];
            arrNomArchivo = nomArchivo.split("#");
            nomArchivo = arrNomArchivo[0];

    if (nomArchivo == "hojasDeTrabajo/crearHoja.html")
    {
		crearHoja_CargarOrdenes();
    }
	CrearHoja_CargarArchivo();

	$("#cntCrearHoja_Cronograma .input-daterange").datepicker();
	$("#cntCrearHoja_Cronograma .input-daterange input").on("change", function()
	{
		var id = $(this).attr("id");
		/*
		var arrTipo = id.split("_");
		var tipo = arrTipo[2];
		*/
		
		id = id.replace("_FechaIni", "").replace("_FechaFin", "");

		if ($("#" + id + "_FechaIni").val() == "" || $("#" + id + "_FechaFin").val() == "")
		{
			$("#" + id).prop('checked', false);
		} else
		{
			$("#" + id).prop('checked', true);			
		}
		crearHoja_OrganizarFechasCronograma();
		
	});

	$("#frmCrearHoja_Actividades").on("submit", function(ev)
		{
			ev.preventDefault();
			var tmpValidar = true;
			var obj = $("#tblCrearHoja_Funciones tbody tr");
			
			var datos = {"actividades" : [], "cronograma" : {}};
			var idx = 0;

			$.each(obj, function(index, val) 
			{
				if ($(val).find("input[type=number]").val()  < 1 || isNaN($(val).find("input[type=number]").val()))
				{
					Mensaje("Error", "Debe indicar un tiempo estimado válido");
					$(val).find("input[type=number]").focus();
					tmpValidar = false;
					return false;
				}
				if ($(val).find("select").val()  < 1 || isNaN($(val).find("select").val()))
				{
					Mensaje("Error", "Debe indicar un Responsable por cada actividad");
					$(val).find("select").focus();
					tmpValidar = false;
					return false;
				}

				datos['actividades'][idx] = {};
				
				datos['actividades'][idx]['idRelacion'] = $(val).attr("idRelacion");
				datos['actividades'][idx]['observaciones'] = $(val).find("textarea").val();
				datos['actividades'][idx]['tiempoEstimado'] = $(val).find("input[type=number]").val();
				datos['actividades'][idx]['idResponsable'] = $(val).find("select").val();

				idx++;
			});	
			if (tmpValidar)		
			{
				$("#cntCrearHoja_Cronograma").generarDatosEnvio("txtCrearHoja_", function(data)
				{
					datos['cronograma'] = data;
					
					datos = JSON.stringify(datos);

					$.post('../server/php/scripts/guardarHT.php', {usuario : Usuario.id, datos: datos}, function(data, textStatus, xhr) 
					{
						if (data == 1)
						{
							Mensaje("Hey", "La HT ha sido guardada y los responsables notificados");
							$("#cntCrearHoja_DetalleOT").hide();
							$("#cntCrearHoja_Ordenes").show();
							var tmpIdOT = $("#txtCrearHoja_idOt").val();
							var btn = ("[idOT='" + tmpIdOT + "']");
							$(btn).parent("td").parent("tr").addClass('rowDelete');
							$("#tblCrearHoja_Ordenes").DataTable().row('.rowDelete').remove().draw( false );


						}
					});
				});
			}
		});

	$(document).delegate('.btnCrearHoja_ArchivosEliminar', 'click', function(event) 
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

	$("#btnCrearHoja_VerListado").on("click", function(evento)
		{
			evento.preventDefault();
			$("#cntCrearHoja_Ordenes").show();
			$("#cntCrearHoja_DetalleOT").hide();
		});

	$(document).delegate('.txtCrearHoja_TiempoActividad', 'change', function() 
	{
		var valor = $(this).val();

		if (isNaN(valor))
		{
			Mensaje("Error", "El valor ingresado no es válido");
			$(this).focus();
		} else
		{
			valor = 0;
			var obj = $(".txtCrearHoja_TiempoActividad");
			$.each(obj, function(index, val) 
			{
				valor += parseInt($(val).val());
			});

			$("#lblCrearHoja_TotalTiempoPropuesto").text(valor);
		}
		valor = parseInt($("#lblCrearHoja_TotalTiempoPropuesto").text())
		if (valor > parseInt($("#lblCrearHoja_TiempoDeEntrega").text()))
		{
			Mensaje("Error", "El tiempo Propuesto supera la expectativa del Cliente");
			$("#lblCrearHoja_TotalTiempoPropuesto").removeClass("badge-success");
			$("#lblCrearHoja_TotalTiempoPropuesto").addClass("badge-danger");
		} else
		{
			$("#lblCrearHoja_TotalTiempoPropuesto").removeClass("badge-danger");
			$("#lblCrearHoja_TotalTiempoPropuesto").addClass("badge-success");
		}
	});

	var tmpIdOT = localStorage.getItem('wsp_epsa_OTCreada_id');
	if (tmpIdOT != null)
	{
		btnCrearHoja_Ver_Click();		
	} 	
}

function crearHoja_CargarOrdenes()
{
	$.post('../server/php/scripts/cargarOrdenesHT.php', {usuario : Usuario.id}, 
	function(data, textStatus, xhr) 
	{
		//$("#tblCrearHoja_Ordenes tbody tr").remove();

		var tds = "";
		var Prioridad = "";
		$.each(data, function(index, val) 
		{
			if (val.Prioridad == "Alta")
			{
				Prioridad = '<span class="label label-danger">' + val.Prioridad + '</span>';
			} else
			{
				Prioridad = val.Prioridad;
			}
			 tds += '<tr>';
			 	tds += '<td>' + val.id + '</td>';
			 	tds += '<td>' + val.Codigo + '</td>';
			 	tds += '<td>' + val.codigoRadicado + '</td>';
			 	tds += '<td>' + Prioridad + '</td>';
			 	tds += '<td>' + val.Zona + '</td>';
			 	tds += '<td>' + val.Municipio + '</td>';
			 	tds += '<td>' + val.Localidad + '</td>';
			 	tds += '<td>' + val.fechaCreacion + '</td>';
			 	tds += '<td><button idOT="' + val.id + '" class="btn btn-primary btnCrearHoja_Ver"><i class="icon wb-edit"></i>Crear</button></td>';
			 tds += '</tr>';
		});
		$("#tblCrearHoja_Ordenes").crearDataTable(tds);

	}, "json");
	
}
function btnCrearHoja_Ver_Click(evento)
{
	$("#cntCrearHoja_DetalleOT").show();
	$("#cntVerHoja_Ordenes").hide();
	$("#cntCrearHoja_Ordenes").hide();
	
	var idOT = 0;
	var tmpIdOT = localStorage.getItem('wsp_epsa_OTCreada_id');
	if (tmpIdOT === null)
	{
		evento.preventDefault();
		idOT = $(this).attr("idOT");
	} else
	{
		idOT = parseInt(tmpIdOT);
		delete localStorage.wsp_epsa_OTCreada_id;
	}


	$("#cntCrearHoja_Archivos li").remove();

	$.post('../server/php/scripts/cargarActividadesOT.php', {idOT: idOT, usuario : Usuario.id}, 
	function(data, textStatus, xhr) 
	{
		$("#txtCrearHoja_idOt").val(idOT);
		$.post('../server/php/listarArchivos.php', {ruta: 'OT/' + data.oT.Prefijo}, function(archivos) 
		{
			$("#frmCrearHoja_Archivos").attr("action", "../server/php/subirArchivo.php?Ruta=OT/" + data.oT.Prefijo);
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
		                    	tds2 += '<a class="btn btn-danger pull-right btnCrearHoja_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
			                  tds2 += '</h4>';
			                  	tds2 += '<p class="list-group-item-text">';
									tds2 +='<small><i>' + Archivo.fecha + '</i></small>';
		                    	tds2 += '</p>';
			                tds2 += '</div>';
			              tds2 += '</div>';
			            tds2 += '</li>';
					});
				});
				
				$("#cntCrearHoja_Archivos").append(tds2);
			} 
		}, "json");
		
		$("#tblCrearHoja_Funciones tbody tr").remove();
		$("#tblCrearHoja_Funciones tfoot tr").remove();

		var tds = "";
		var Usuarios = '<option value="">Seleccione un Responsable</option>';
		var Prioridad = "";

		$("#lblCrearHoja_id").text(data.oT.id);
		$("#lblCrearHoja_Codigo").text(data.oT.Codigo);
		$("#lblCrearHoja_Radicado").text(data.oT.codigoRadicado);
		$("#lblCrearHoja_Nombre").text(data.oT.Nombre);
		$("#lblCrearHoja_Alcance").text(data.oT.Alcance);
		$("#lblCrearHoja_Zona").text(data.oT.Zona);
		$("#lblCrearHoja_Municipio").text(data.oT.Municipio);
		$("#lblCrearHoja_Localidad").text(data.oT.Localidad);
		$("#lblCrearHoja_TiempoDeEntrega").text(data.oT.TiempoDeEntrega);
		$("#lblCrearHoja_Prioridad").text(data.oT.Prioridad);

		$("#lblCrearHoja_contactoNombre").text(data.oT.contactoNombre);
		$("#lblCrearHoja_contactoTelefono").text(data.oT.contactoTelefono);
		$("#lblCrearHoja_contactoDireccion").text(data.oT.Direccion);

		if (data.oT.Prioridad == "Alta")
		{
			$("#lblCrearHoja_Prioridad").removeClass('label-primary').addClass('label-danger');
		} else
		{
			$("#lblCrearHoja_Prioridad").removeClass('label-danger').addClass('label-primary');
		}

		$.each(data.Usuarios, function(index, val) 
		{
			 Usuarios += '<option value="' + val.id + '">' + val.Nombre + '</option>'
		});

		$.each(data.actividades, function(index, val) 
		{
			
			 tds += '<tr idRelacion="' + val.id + '">';
			 	tds += '<td>' + val.Funcion + '</td>';
			 	tds += '<td>' + val.Actividad + '</td>';
			 	tds += '<td>' + '<textarea class="form-control">' + val.observaciones + '</textarea>' + '</td>';
			 	tds += '<td><input type="number" class="form-control round text-center width-100 txtCrearHoja_TiempoActividad" value="' + val.tiempoEstimado + '"></td>';
			 	tds += '<td>' + '<select class="form-control">' + Usuarios + '</select>' + '</td>';
			 tds += '</tr>';
		});

		var tds2 = "";
		tds2 += '<tr>';
			tds2 += '<td></td>';
			tds2 += '<td></td>';
		 	tds2 += '<td class="text-right"><strong>TIEMPO TOTAL</strong></td>';
		 	tds2 += '<td class="text-center"><span id="lblCrearHoja_TotalTiempoPropuesto" class="badge badge-success">0</span></td>';
		 	tds2 += '<td></td>';
		 	tds2 += '<td></td>';
		tds2 += '</tr>';

		$("#tblCrearHoja_Funciones tbody").append(tds);
		$("#tblCrearHoja_Funciones tfoot").append(tds2);

		var objTiempoActividad = $(".txtCrearHoja_TiempoActividad")[0];
		$(objTiempoActividad).trigger('change');

		$.each(data.actividades, function(index, val) 
		{
			$("#tblCrearHoja_Funciones tr[idRelacion=" + val.id+ "] select").val(val.idResponsable);
		});
		
		if (data.cronograma.iniLevantamiento != undefined)
		{
			$("#txtCrearHoja_chkLevantamiento_FechaIni").val(data.cronograma.iniLevantamiento);
			$("#txtCrearHoja_chkLevantamiento_FechaFin").val(data.cronograma.finLevantamiento);
			$("#txtCrearHoja_chkDiseno_FechaIni").val(data.cronograma.iniDiseno);
			$("#txtCrearHoja_chkDiseno_FechaFin").val(data.cronograma.finDiseno);
			$("#txtCrearHoja_chkDibujo_FechaIni").val(data.cronograma.iniDibujo);
			$("#txtCrearHoja_chkDibujo_FechaFin").val(data.cronograma.finDibujo);
			$("#txtCrearHoja_chkConsolidacion_FechaIni").val(data.cronograma.iniRevision);
			$("#txtCrearHoja_chkConsolidacion_FechaFin").val(data.cronograma.finRevision);
			
			$("#txtCrearHoja_chkLevantamiento_FechaFin").trigger('change');
			$("#txtCrearHoja_chkDiseno_FechaFin").trigger('change');
			$("#txtCrearHoja_chkDibujo_FechaFin").trigger('change');
			$("#txtCrearHoja_chkRevision_FechaFin").trigger('change');
		}
		


	}, "json");

}

function CrearHoja_CargarArchivo()
{
	$("#frmCrearHoja_Archivos").ajaxForm(
	{
		beforeSend: function() 
		{
		    var percentVal = '0%';
		    $("#txtCrearHoja_ArchivoProgreso").width(percentVal);
		    $("#txtCrearHoja_ArchivoProgreso").text(percentVal);
		},
		uploadProgress: function(event, position, total, percentComplete) {
		    
		    var percentVal = percentComplete + '%';
		    $("#txtCrearHoja_ArchivoProgreso").width(percentVal);
		    $("#txtCrearHoja_ArchivoProgreso").text(percentVal);
		},
		success: function() {
		    var percentVal = '100%';
		    $("#txtCrearHoja_ArchivoProgreso").width(percentVal);
		    $("#txtCrearHoja_ArchivoProgreso").text(percentVal);
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
                    	tds += '<a class="btn btn-danger pull-right btnCrearHoja_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
	                  tds += '</h4>';
	                tds += '</div>';
	              tds += '</div>';
	            tds += '</li>';

	        $("#cntCrearHoja_Archivos").append(tds);
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
		 }
	}); 

}

function crearHoja_OrganizarFechasCronograma()
{
	var obj = $("#cntCrearHoja_Cronograma .input-daterange input");
	
	
	var tmpFechaIni = new Date("2030-01-01");
	var tmpFechaFin = new Date("1900-01-01");

	var f1 = new Date();

	var arrFecha;
	$.each(obj, function(index, val) 
	{
		if ($(val).val() != "")
		{
			arrFecha = $(val).val().split("-");
			f1 = new Date(arrFecha[0], arrFecha[1], arrFecha[2]);
			if (f1 < tmpFechaIni)
			{
				tmpFechaIni = f1;
			}
			if (f1 > tmpFechaFin)
			{
				tmpFechaFin = f1;
			}
		}
	});	
	tmpFechaIni = tmpFechaIni.getFullYear() + "-" + CompletarConCero(tmpFechaIni.getMonth(), 2) + "-" + CompletarConCero(tmpFechaIni.getDate(), 2);
	tmpFechaFin = tmpFechaFin.getFullYear() + "-" + CompletarConCero(tmpFechaFin.getMonth(), 2) + "-" + CompletarConCero(tmpFechaFin.getDate(), 2);

	//$("#txtCrearHoja_chkConsolidacion_FechaIni").val(tmpFechaIni);
	$("#txtCrearHoja_chkConsolidacion_FechaFin").val(tmpFechaFin).datepicker('update');;
	$("#txtCrearHoja_chkEntrega_FechaFin").val(tmpFechaFin);
	$("#lblCrearHoja_FechaEntrega").text(tmpFechaFin);
}

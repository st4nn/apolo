panelOT();

function panelOT()
{
	panel_ManejoArchivos();

	$("#btnPanelOT_CerrarNota").on("click", function()
	{
		$("#cntPanelOT_Notas").modal("hide");
	});
	$("#btnPanelOT_CerrarRechazo").on("click", function()
	{
		$("#cntPanelOT_Rechazo").modal("hide");
	});

	$(document).delegate('.btnPanelOT_EnvRechazarAct', 'click', function(event) 
	{
		var idActividad = $(this).attr("idActividad");
		$("#txtPanelOT_Rechazo_id").val(idActividad);

		$("#txtPanelOT_Rechazo_Estado").val(3);
		$("#txtPanelOT_MotivoRechazo").val("");
		$("#txtPanelOT_MotivoRechazo").show();
		$("#lblPanel_OT_Conf").hide();
		$("#cntPanelOT_Rechazo").modal('show');
	});

	$(document).delegate('.btnPanelOT_EnvAprobarAct', 'click', function(event) 
	{
		var idActividad = $(this).attr("idActividad");
		$("#txtPanelOT_Rechazo_id").val(idActividad);

		$("#txtPanelOT_Rechazo_Estado").val(4);
		$("#txtPanelOT_MotivoRechazo").val("");
		$("#txtPanelOT_MotivoRechazo").hide();
		$("#lblPanel_OT_Conf").show();
		$("#cntPanelOT_Rechazo").modal('show');
	});

	$(document).delegate('.btnPanelOT_AprobarAct', 'click', function(event) 
	{
		var idActividad = $(this).attr("idActividad");
		$("#txtPanelOT_Rechazo_id").val(idActividad);

		$("#txtPanelOT_Rechazo_Estado").val(5);
		$("#txtPanelOT_MotivoRechazo").val("");
		$("#txtPanelOT_MotivoRechazo").hide();
		$("#lblPanel_OT_Conf").show();
		$("#cntPanelOT_Rechazo").modal('show');
	});


	$(document).delegate('.btnPanelOT_RechazarAct', 'click', function(event) 
	{
		var idActividad = $(this).attr("idActividad");
		$("#txtPanelOT_Rechazo_id").val(idActividad);

		$("#txtPanelOT_Rechazo_Estado").val(6);
		$("#txtPanelOT_MotivoRechazo").val("");
		$("#txtPanelOT_MotivoRechazo").show();
		$("#lblPanel_OT_Conf").hide();
		$("#cntPanelOT_Rechazo").modal('show');
	});

	$("#btnPanelOT_Rechazar").on("click", function()
	{
		$("#cntPanelOT_Rechazo").modal("hide");
		var fecha = obtenerFecha();

		$.post('../server/php/scripts/estadoActividad.php', 
		{
			usuario: Usuario.id,
			idActividad : $("#txtPanelOT_Rechazo_id").val(),
			observacion : $("#txtPanelOT_MotivoRechazo").val(),
			idEstado : $("#txtPanelOT_Rechazo_Estado").val()
		}, function(data, textStatus, xhr) 
		{
			if (data == 1)	
			{
				Mensaje("Hey", "Actividad Enviada");

				var estados = ["default", "dark", "warning", "danger", "info", "success", "danger"];
				var nomEstados = ["", "Sin Asignar", "Asignada", "Rechazada", "Esperando Aprobación", "Aprobada", "Devuelta"];


				$("#lblEstadoAct_" + $("#txtPanelOT_Rechazo_id").val()).removeClass('label-dark');
				$("#lblEstadoAct_" + $("#txtPanelOT_Rechazo_id").val()).removeClass('label-warning');
				$("#lblEstadoAct_" + $("#txtPanelOT_Rechazo_id").val()).removeClass('label-danger');
				$("#lblEstadoAct_" + $("#txtPanelOT_Rechazo_id").val()).removeClass('label-success');
				$("#lblEstadoAct_" + $("#txtPanelOT_Rechazo_id").val()).removeClass('label-info');

				$("#lblEstadoAct_" + $("#txtPanelOT_Rechazo_id").val()).addClass('label-' + estados[$("#txtPanelOT_Rechazo_Estado").val()]);

				console.log($("#txtPanelOT_Rechazo_id").val());
				
				$("#lblEstadoAct_" + $("#txtPanelOT_Rechazo_id").val()).text(nomEstados[$("#txtPanelOT_Rechazo_Estado").val()]);
				
			}
		});
		
	});

	$("#btnPanelOT_AgregarNota").on("click", function()
	{
		$("#cntPanelOT_Notas").modal("hide");
		var fecha = obtenerFecha();
		if ($("#txtPanelOT_Nota").val().trim() != "")
		{
			$.post('../server/php/scripts/crearNota.php', 
			{
				usuario: Usuario.id,
				idOT : $("#txtPanelOT_idOT").val(),
				idActividad : $("#txtPanelOT_Nota_id").val(),
				observacion : $("#txtPanelOT_Nota").val()
			}, function(data, textStatus, xhr) 
			{
				if (data == 1)	
				{
					var tds = "";
					tds += '<li class="list-group-item">';
					  tds += '<div class="media">';
					    tds += '<div class="media-body">';
					      tds += '<h4 class="media-heading">';
					        tds += '<small class="pull-right">' + fecha + '</small>';
					        tds += '<a class="name">' + Usuario.nombre + '</a>';
					      tds += '</h4>';
					      tds += '<span>' + $("#txtPanelOT_Nota").val() + '</span>';
					    tds += '</div>';
					  tds += '</div>';
					tds += '</li>';
					$("#cntPanelOT_Actividades_Obs_" + $("#txtPanelOT_Nota_id").val()).prepend(tds);
				}
			});
		} else
		{
			Mensaje("Error", "Las Notas vacías no se almacenan");
		}
		
	});

	$(document).delegate('.btnPanelOT_Notas', 'click', function(event) 
	{
		$("#cntPanelOT_Notas").modal("show");
		
		var idActividad = $(this).attr("idActividad");
		$("#txtPanelOT_Nota_id").val(idActividad);
		$("#txtPanelOT_Nota").val("");
	
	});
	("#btnPanelOT_Notas")
	var idOT = GET("id");

	if (idOT === 'undefined')
	{
		window.location.replace("misActividades.html");
	} else
	{
		$.post('../server/php/scripts/cargarActividadesOT.php', {usuario : Usuario.id, idOT : idOT, propia : true}, 
		function(data, textStatus, xhr) 
		{
			if (parseInt(data.actividades.length) > 0)
			{
				$("#txtPanelOT_idOT").val(idOT);

				$.post('../server/php/listarArchivos.php', {ruta: 'OT/' + data.oT.Prefijo}, function(archivos) 
				{
					var tds = '<input type="hidden" id="txtPanel_idActividadArchivos">';
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

					var idx = 1;
					var plural = "s";
					var restriccion = "hide";
					var estados = ["default", "dark", "warning", "danger", "info", "success", "danger"]
					$.each(data.actividades, function(index, val) 
					{
						if (val.idEstado == 2 || val.idEstado == 6)
						{
							restriccion = "";
						}

						if (val.tiempoEstimado == 1)
						{
							plural = "";
						} else 
						{
							plural = "s";
						}
						var tds3 = "";
						$.post('../server/php/listarArchivos.php', {ruta: 'OT/' + data.oT.Prefijo + '/' + val.idActividad}, function(archivos) 
						{
							$.each(archivos, function(nomDirectorio, cntDirectorio) 
							{
								if (regDirectorio != nomDirectorio)
								{
									regDirectorio = nomDirectorio;
									tds3 += '<li class="list-group-item">';
									if (regDirectorio != "raiz")
									{

						              tds3 += '<h4 class="example-title">' + regDirectorio + '</h4>';
									} else
									{
										tds3 += '<h4 class="example-title"></h4>';
									}
						            tds3 += '</li>';
								}

								
								$.each(cntDirectorio, function(idx, Archivo) 
								{
									arrExt = Archivo.nomArchivo.split(".");
									ext = arrExt[arrExt.length - 1];

									tds3 += '<li class="list-group-item">';
						              tds3 += '<div class="media">';
						                tds3 += '<div class="media-left">';
						                  tds3 += '<a class="avatar" href="javascript:void(0)">';
						                    tds3 += '<img src="../assets/images/icons/' + ext.toLowerCase() + '.png" alt=""></a>';
						                tds3 += '</div>';
						                tds3 += '<div class="media-body">';
						                  tds3 += '<h4 class="media-heading">';
						                    tds3 += '<a class="list-group-item-heading" href="' + Archivo.ruta.replace("../", "../server/") + "/" + Archivo.nomArchivo + '" target="_blank">' + Archivo.nomArchivo + '</a>';
				                    		//tds3 += '<a class="btn btn-danger pull-right btnPanel_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
						                  tds3 += '</h4>';
											tds3 += '<p class="list-group-item-text">';
												tds3 +='<small><i>' + Archivo.fecha + '</i></small>';
					                    	tds3 += '</p>';
						                tds3 += '</div>';
						              tds3 += '</div>';
						            tds3 += '</li>';
								});
							});

							$("#cntArchivos_" + val.idActividad).append(tds3);
						}, "json");

						var tdsNotas = "";
						if (data.nota != undefined)
						{
							if (data.nota[val.idActividad] != undefined)
							{
								$.each(data.notas[val.idActividad], function(index, valNota) 
								{
									tdsNotas += '<li class="list-group-item">';
									  tdsNotas += '<div class="media">';
									    tdsNotas += '<div class="media-body">';
									      tdsNotas += '<h4 class="media-heading">';
									        tdsNotas += '<small class="pull-right">' + valNota.fecha + '</small>';
									        tdsNotas += '<a class="name">' + valNota.Usuario + '</a>';
									      tdsNotas += '</h4>';
									      tdsNotas += '<span>' + valNota.Observacion + '</span>';
									    tdsNotas += '</div>';
									  tdsNotas += '</div>';
									tdsNotas += '</li>';
								});
							}
						}
						

						tds += '<div class="panel nav-tabs-horizontal">';
			          		tds += '<div class="panel-heading">';
			          			tds += '<br><br>';
				              tds += '<div class="panel-actions">';
				              	tds += '<a class="panel-action icon wb-minus" aria-expanded="true" data-toggle="panel-collapse" aria-hidden="true"></a>';
				              	tds += '<a class="panel-action icon wb-expand" data-toggle="panel-fullscreen" aria-hidden="true"></a>';
				              tds += '</div>';
			          		tds += '</div>';
				            tds += '<div class="panel-heading">';
				              tds += '<span id="lblEstadoAct_' + val.id + '" class="label label-' + estados[val.idEstado] + '">' + val.Estado + '</span><br>';
				              tds += '<small>' + val.NomResponsable + '</small>';
				              tds += '<h3 class="panel-title">';
				              	tds += '<strong>' + val.idActividad + '</strong><br> ';
				              	tds += '<span>' + val.Actividad + '<span><br> ';
				              	tds += '<small>' + val.Funcion + '</small>';
				              tds += '</h3>';
				            tds += '</div>';
				            tds += '<ul class="nav nav-tabs nav-tabs-line" data-plugin="nav-tabs" role="tablist">';
				              tds += '<li class="active col-md-3" role="presentation">';
				              	tds += '<a data-toggle="tab" href="#tabPanelOT_Actividades_Informacion_' + val.id + '" aria-controls="tabPanelOT_Actividades_Informacion_' + val.id + '"';
				                tds += 'role="tab">';
				                	tds += '<i class="icon wb-pugin" aria-hidden="true"></i>Información';
				                tds += '</a>';
				               tds += '</li>';
				              tds += '<li class="col-md-3" role="presentation"><a data-toggle="tab" href="#tabPanelOT_Actividades_Notas_' + val.idActividad + '" aria-controls="tabPanelOT_Actividades_Notas_' + val.id + '"';
				                tds += 'role="tab"><i class="icon fa-comment" aria-hidden="true"></i>Notas</a></li>';
				              tds += '<li class="col-md-3" role="presentation"><a data-toggle="tab" href="#tabPanelOT_Actividades_Archivos_' + val.id + '" aria-controls="tabPanelOT_Actividades_Archivos_' + val.id + '"';
				                tds += 'role="tab"><i class="icon wb-upload" aria-hidden="true"></i>Cargar Archivos</a></li>';
				              tds += '<li class="col-md-3" role="presentation"><a data-toggle="tab" href="#tabPanelOT_Actividades_Rechazar_' + val.id + '" aria-controls="tabPanelOT_Actividades_Rechazar_' + val.id + '"';
				                tds += 'role="tab"><i class="icon fa-check-square" aria-hidden="true"></i>Terminar</a></li>';
				            tds += '</ul>';
				            tds += '<div class="panel-body">';
				              tds += '<div class="tab-content">';
				                tds += '<div class="tab-pane active" id="tabPanelOT_Actividades_Informacion_' + val.id + '" role="tabpanel">';
				                  tds += '<h4><small>Tiempo Estimado: </small><span>' + val.tiempoEstimado +'</span><span> día' + plural + '</span></h4>';
				                  tds += '<h4><small>Observaciones: </small> <span>' + val.observaciones + '</span></h4>';
				                tds += '</div>';
				                tds += '<div class="tab-pane" id="tabPanelOT_Actividades_Notas_' + val.idActividad + '" role="tabpanel">';
				                  	tds += '<button type="button" idActividad="' + val.idActividad + '" class="btn btn-warning btn-lg btn-block btn-floating btnPanelOT_Notas">';
										tds += '<i class="icon wb-plus-circle" aria-hidden="true"></i>';
									tds += '</button>';
									tds += '<ul class="list-group list-group-dividered list-group-full" id="cntPanelOT_Actividades_Obs_' + val.idActividad + '">';
										tds += tdsNotas;
									tds += '</ul>';
				                tds += '</div>';
				                tds += '<div class="tab-pane" id="tabPanelOT_Actividades_Archivos_' + val.id + '" role="tabpanel">';
				                	tds += '<form class="form-group" idActividad="' + val.idActividad + '" action="../server/php/subirArchivo.php?Ruta=OT/' + data.oT.Prefijo + '/' + val.idActividad + '"  method="post" enctype="multipart/form-data">';
					                	tds += '<div class="progress progress-lg col-xs-8">';
								            tds += '<div class="progress-bar progress-bar-success" id="cntPanel_Barra_' + val.idActividad + '" style="width: 0%;" role="progressbar"></div>';
								        tds += '</div>';
							          	tds += '<div class="col-xs-2"></div>';
				                		tds += '<div class="input-group input-group-file col-xs-2">';
						                    tds += '<span class="input-group-btn">';
						                      tds += '<span class="btn btn-success btn-file btn-floating btn-lg btn-block">';
						                        tds += '<i class="icon fa-camera" aria-hidden="true"></i>';
						                        tds += '<input type="file" name="archivo" class="inputControl2" idActividad="' + val.idActividad + '">';
						                      tds += '</span>';
						                    tds += '</span>';
					                  	tds += '</div>';
				                	
							          
							        tds += '</form>';
				                	tds += '<div class="col-xs-10 list-group list-group-full" id="cntArchivos_' + val.idActividad + '">';
				                		tds += tds3;
				                	tds += '</div>';
				                tds += '</div>';
				                tds += '<div class="tab-pane" id="tabPanelOT_Actividades_Rechazar_' + val.id + '" role="tabpanel">';
				                	tds += '<div>';
				                	if (Usuario.idPerfil == 5 || Usuario.idPerfil == 6)
				                	{
				                		tds += '<div class="form-group col-xs-6">';
					                  		tds += '<button type="button" idActividad="' + val.id + '" class="btn btn-floating btn-success btn-lg btn-block btnPanelOT_EnvAprobarAct"><i class="icon fa-check-circle" aria-hidden="true"></i></button>';
					  						tds += '<small>Enviar para aprobación</small>';
				                  		tds += '</div>';
					                  	tds += '<div class="form-group col-xs-6">';
					  						tds += '<button type="button" idActividad="' + val.id + '" class="btn btn-floating btn-danger btn-lg btn-block btnPanelOT_EnvRechazarAct"><i class="icon wb-trash" aria-hidden="true"></i></button>';
					  						tds += '<small>Rechazar Actividad</small>';
					  					tds += '</div>';
				                	} else
				                	{
					                  	tds += '<div class="form-group col-xs-6">';
					                  		tds += '<button type="button" idActividad="' + val.id + '" class="btn btn-floating btn-success btn-lg btn-block btnPanelOT_AprobarAct"><i class="icon fa-check-circle" aria-hidden="true"></i></button>';
					  						tds += '<small>Aprobar</small>';
				                  		tds += '</div>';
					                  	tds += '<div class="form-group col-xs-6">';
					  						tds += '<button type="button" idActividad="' + val.id + '" class="btn btn-floating btn-danger btn-lg btn-block btnPanelOT_RechazarAct"><i class="icon wb-trash" aria-hidden="true"></i></button>';
					  						tds += '<small>Rechazar Actividad</small>';
					  					tds += '</div>';
				                	}
				                	tds += '</div>';
				                tds += '</div>';
				              tds += '</div>';
				            tds += '</div>';
			          	tds += '</div>';
					});


					$("#cnPanelOT_Actividades").append(tds);
					$.components._components.panel.init();
					

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
					panel_CargarArchivo();
				}, "json");
			} else
			{
				window.location.replace("misActividades.html");
			}
		}, "json");
	}
}


function panel_ManejoArchivos()
{
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

    $(document).delegate(".inputControl2", "change" ,function()
    {
      var contenedor = $(this).parent("span").parent("span").parent("div").parent("form");
      var barra = $(contenedor).parent("div").find(".progress-bar");
      var percentVal = '0%';

      $("#txtPanel_idActividadArchivos").val($(this).attr("idActividad"));
      
      $(barra).width(percentVal);
      $(barra).text(percentVal);
      $(contenedor).trigger('submit');
    });

    $(document).delegate('.btnPanel_ArchivosEliminar', 'click', function(event) 
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

}

function panel_CargarArchivo()
{
	$("form").ajaxForm(
	{
		beforeSend: function() 
		{
		    var percentVal = '0%';
		    var idActividad = $("#txtPanel_idActividadArchivos").val();
		    var barra = $("#cntPanel_Barra_" + idActividad);
		    $(barra).width(percentVal);
		    $(barra).text(percentVal);
		},
		uploadProgress: function(event, position, total, percentComplete) {
		    
		    var percentVal = percentComplete + '%';
		    var idActividad = $("#txtPanel_idActividadArchivos").val();
		    var barra = $("#cntPanel_Barra_" + idActividad);
		    $(barra).width(percentVal);
		    $(barra).text(percentVal);
		},
		success: function() {
		    var percentVal = '100%';
		    var idActividad = $("#txtPanel_idActividadArchivos").val();
		    var barra = $("#cntPanel_Barra_" + idActividad);
		    $(barra).width(percentVal);
		    $(barra).text(percentVal);
		},
		complete: function(xhr) {
		  var respuesta = xhr.responseText;
		  var idActividad = $("#txtPanel_idActividadArchivos").val();
		  var contenedorArchivos = $("#cntArchivos_" + idActividad);
		  
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
                    	tds += '<a class="btn btn-danger pull-right btnCrearOrden_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
	                  tds += '</h4>';
	                tds += '</div>';
	              tds += '</div>';
	            tds += '</li>';

	        $(contenedorArchivos).prepend(tds);
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
		 }
	}); 

}
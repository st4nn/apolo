panelOT();

function panelOT()
{
	panel_ManejoArchivos();

	$("#btnPanel_IrAHojaDeTrabajo").on("click", function(evento)
	{
		evento.preventDefault();
		localStorage.setItem('wsp_epsa_OTCreada_id', $("#txtPanelOT_idOT").val());
		window.location.replace("../hojasDeTrabajo/crearHoja.html");
	});

	$("#btnControlCalidad_Cerrar").on("click", function(evento)
	{
		evento.preventDefault();
		$("#cntControlCalidad_Modal").modal('hide');
	});

	$(document).delegate('.lnkControlCalidad_AbrirRevision', 'click', function(event) 
	{
		event.preventDefault();
		$("#cntControlCalidad_Revision_Plano div").remove();
		$("#cntControlCalidad_Revision_Disenio div").remove();
		$("#cntControlCalidad_Revision_Ficha div").remove();
		var idRevision = $(this).attr("idControl");

		$.post('../server/php/scripts/controlCalidad_cargarRevision.php', 
			{
				Usuario : Usuario.id,
				idRevision : idRevision,
				idOT : $("#txtPanelOT_idOT").val()
			}, function(data, textStatus, xhr) 
			{
				var tmpEstado = '';
				var tdsControlDeCalidad = '';
				$.each(data.controlDeCalidad, function(index, val) 
				{
					 tmpEstado = 'info';
					 if (val.Valor == 'NO')
					 {
					 	tmpEstado = 'danger';
					 }

					 if (val.Tipo == 'Diseño')
						{val.Tipo = 'Disenio';}

					tdsControlDeCalidad = '';

					tdsControlDeCalidad += '<div class="col-sm-6">';
						tdsControlDeCalidad += '<div class="list-group-item">';
							 tdsControlDeCalidad += '<div class="row">';
								tdsControlDeCalidad += '<div class="row col-sm-12">';
									tdsControlDeCalidad += '<div class="col-sm-12">';
										tdsControlDeCalidad += '<h4 class="media-heading">' + val.Texto + '</h4>';
									tdsControlDeCalidad += '</div>';
									tdsControlDeCalidad += '<div class="pull-right">';
				                       	tdsControlDeCalidad += '<label class="label label-' + tmpEstado + '">' + val.Valor + '</label>';
				                    tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '<br><br><br><br>';
								tdsControlDeCalidad += '<div class="row col-sm-12"> ';
				                    tdsControlDeCalidad += '<div class="form-group">';
										tdsControlDeCalidad += '<div class="col-sm-6 form-material">';
					                    	tdsControlDeCalidad += '<label class="control-label" for="">Observaciones:</label>';
					                    	tdsControlDeCalidad += '<p class="form-control">' + val.Observaciones + '</p>';
					                    tdsControlDeCalidad += '</div>';
										tdsControlDeCalidad += '<div class="col-sm-6  form-material">';
											tdsControlDeCalidad += '<label class="control-label" for="">Respuesta:</label>';
					                    	tdsControlDeCalidad += '<p class="form-control">' + val.Respuesta  + '</p>';
				                    	tdsControlDeCalidad += '</div>';
				                    tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '</div>';
							tdsControlDeCalidad += '</div>';
						tdsControlDeCalidad += '</div>';
					tdsControlDeCalidad += '</div>';

					$('#cntControlCalidad_Revision_' + val.Tipo).append(tdsControlDeCalidad);
				});

				$.each(data.controlDeCalidad_Levantamiento, function(index, val) 
				{
					tdsControlDeCalidad = '';

					tdsControlDeCalidad += '<div class="col-sm-6">';
						tdsControlDeCalidad += '<div class="list-group-item">';
							 tdsControlDeCalidad += '<div class="row">';
								tdsControlDeCalidad += '<div class="row col-sm-12">';
									tdsControlDeCalidad += '<div class="col-sm-12">';
										tdsControlDeCalidad += '<h4 class="media-heading">' + val.codPoste + '</h4>';
									tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '<br><br><br><br>';
								tdsControlDeCalidad += '<div class="row col-sm-12"> ';
				                    tdsControlDeCalidad += '<div class="form-group">';
										tdsControlDeCalidad += '<div class="col-sm-6 form-material">';
					                    	tdsControlDeCalidad += '<label class="control-label" for="">Observaciones:</label>';
					                    	tdsControlDeCalidad += '<p class="form-control">' + val.Observaciones + '</p>';
					                    tdsControlDeCalidad += '</div>';
				                    tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '</div>';
							tdsControlDeCalidad += '</div>';
						tdsControlDeCalidad += '</div>';
					tdsControlDeCalidad += '</div>';

					$('#cntControlCalidad_Revision_Ficha').append(tdsControlDeCalidad);
				});
			}, 'json');
		$("#cntControlCalidad_Modal").modal('show');
	});

	$("#btnControlCalidad_Guardar").on("click", function(evento)
	{
		evento.preventDefault();

		var obj = this;

		alertify.set({"labels" : {"ok" : "Si, Guardar", "cancel" : "No, Volver"}});
		alertify.confirm("Confirma que desea guardar esta revisión?", function (ev) 
		{
			if (ev)
			{
				var numRevision = parseInt($("#lblControlCalidad_Revision").text());

				var jObjetos = $(".cntControlCalidad_Item");

				var jItems = [];
				var jItems_Ficha = [];
				var idItem = '';
				var Valor = '';
				var Observaciones = '';
				var Respuesta = '';

				$.each(jObjetos, function(index, val) 
				{
					Valor = $(val).find(':checked').attr('data-valor');
					Observaciones = $(val).find('.txtControlCalidad_Item_Observaciones').val();
					Respuesta = $(val).find('.txtControlCalidad_Item_Respuesta').val();
					jItems[index] = {idItem : $(val).attr('idItem'), Valor : Valor, Observaciones : Observaciones, Respuesta : Respuesta };
				});

				jObjetos = $(".cntControlCalidad_Item_Ficha");

				if (jObjetos.length > 0)
				{
					$.each(jObjetos, function(index, val) 
					{
						Observaciones = $(val).find('.txtControlCalidad_Item_Ficha_Observaciones').val();
						jItems_Ficha[index] = {idLevantamiento : $(val).attr('idItem'), Observaciones : Observaciones};
					});
				}

				jItems = JSON.stringify(jItems);
				jItems_Ficha = JSON.stringify(jItems_Ficha);

				
				$.post("../server/php/scripts/controlCalidad_CrearRevision.php", 
				{
					Usuario : Usuario.id,
					revision : numRevision,
					idProyecto : $("#txtPanelOT_idOT").val(),
					Items : jItems,
					Levantamiento : jItems_Ficha
				}, function(data)
				{
					if (data.Error != '')
					{
						Mensaje("Error", data.Error, 'danger');
					} else
					{
						$("#lblControlCalidad_Revision").text(numRevision + 1);

						controlDeCalidad_addHistorio(
						{
							id : data.id,
							Resultado : data.Resultado,
							Usuario : Usuario.nombre,
							fechaCargue : obtenerFecha(),
							Revision : numRevision
						});

					}
				}, 'json');
			} 
		});

	});

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

					$("#txtReporte_idProyecto").val(data.oT.Prefijo);
					
					cargarLevantamiento();

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
					var estados = ["default", "dark", "warning", "danger", "info", "success", "danger"];
					var colores = ["grey-600", "blue-grey-600", "orange-600", "red-600", "blue-600", "light-green-600", "red-600"];
					var tmpEstado = '';
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
							if (archivos.length > 0)
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
							}
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

						if (tmpEstado != val.Estado)
						{
							if (tmpEstado == '')
							{
								tds += '<div class="row">'
							} else
							{
								tds += '</div><div class="row">'
							}

							tmpEstado = val.Estado;
							tds += '<h1>Actividades ' + tmpEstado + 's</h1>';
						}
						

						tds += '<div class="col-sm-4">';
							tds += '<div class="panel panel-bordered panel-' + estados[val.idEstado] + '">';
								tds += '<div class="panel-heading">';
				              		tds += '<h3 class="panel-title">' + val.Actividad + ' <small class="white">' + val.idActividad + '</small></h3>';

					              	tds += '<div class="panel-actions">';
						              	tds += '<a class="panel-action icon wb-minus" aria-expanded="true" data-toggle="panel-collapse" aria-hidden="true"></a>';
						              	tds += '<a class="panel-action icon wb-expand" data-toggle="panel-fullscreen" aria-hidden="true"></a>';
					              	tds += '</div>';
					            tds += '</div>';
					            tds += '<div class="panel-body">';
				              		tds += '<div class="col-sm-12">';
				              				tds += '<h4>' + val.Funcion + '</h4>';
				              		tds += '</div>';
					              	tds += '<div class="nav-tabs-horizontal">';
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
							                tds += 'role="tab"><i class="icon wb-upload" aria-hidden="true"></i>Archivos</a></li>';
							              tds += '<li class="col-md-3" role="presentation"><a data-toggle="tab" href="#tabPanelOT_Actividades_Rechazar_' + val.id + '" aria-controls="tabPanelOT_Actividades_Rechazar_' + val.id + '"';
							                tds += 'role="tab"><i class="icon fa-check-square" aria-hidden="true"></i>Terminar</a></li>';
							            tds += '</ul>';
					            	tds += '</div>';
					            	tds += '<div class="tab-content padding-10">';
					            		tds += '<div class="tab-pane active" id="tabPanelOT_Actividades_Informacion_' + val.id + '" role="tabpanel">';
						                  tds += '<h4><small>Tiempo Estimado: </small><span>' + val.tiempoEstimado +'</span><span> día' + plural + '</span></h4>';
						                  tds += '<h4><small>Observaciones: </small> <span>' + val.observaciones + '</span></h4>';
						                  tds += '<h4><small>Responsable: </small> <span>' + val.NomResponsable + '</span></h4>';
						                  tds += '<h4><small>Fecha de Asignación: </small> <span> ' + val.fechaAsignacion + '</span></h4><br>';
						                  
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
							            	tds += '<div class="row">';
							            	if (Usuario.idPerfil == 5 || Usuario.idPerfil == 6)
						                	{
						                		tds += '<div class="col-xs-6 text-center">';
							                  		tds += '<button type="button" idActividad="' + val.id + '" class="btn btn-success btn-lg btn-block btnPanelOT_EnvAprobarAct height-100"><i class="icon fa-check-circle" aria-hidden="true"></i></button>';
							  						tds += '<small>Enviar para aprobación</small>';
						                  		tds += '</div>';
							                  	tds += '<div class="col-xs-6 text-center">';
							  						tds += '<button type="button" idActividad="' + val.id + '" class="btn btn-danger btn-lg btn-block btnPanelOT_EnvRechazarAct height-100"><i class="icon wb-trash" aria-hidden="true"></i></button>';
							  						tds += '<small>Rechazar Actividad</small>';
							  					tds += '</div>';
						                	} else
						                	{
							                  	tds += '<div class="col-xs-6 text-center">';
							                  		tds += '<button type="button" idActividad="' + val.id + '" class="btn btn-success btn-lg btn-block btnPanelOT_AprobarAct height-100"><i class="icon fa-check-circle" aria-hidden="true"></i></button>';
							  						tds += '<small>Aprobar</small>';
						                  		tds += '</div>';
							                  	tds += '<div class="col-xs-6 text-center">';
							  						tds += '<button type="button" idActividad="' + val.id + '" class="btn btn-danger btn-lg btn-block btnPanelOT_RechazarAct height-100"><i class="icon wb-close" aria-hidden="true"></i></button>';
							  						tds += '<small>Rechazar Actividad</small>';
							  					tds += '</div>';
						                	}
					                		tds += '</div>';
						                tds += '</div>';
					            	tds += '</div>';

					            tds += '</div>';
					            tds += '<div class="panel-footer bg-' + colores[val.idEstado] + ' text-center white">';
					            	tds += '<span>' + val.Estado + '</span>';
					            tds += '</div>';
							tds += '</div>';	
						tds += '</div>';
					});

					tds += '</div>';


					$("#cnPanelOT_Actividades").append(tds);
					$.components._components.panel.init();


					var tdsControlDeCalidad = '';

					$("#lblControlCalidad_Revision").text(parseInt($("#lblControlCalidad_Revision").text()) + 1);

					$.each(data.controlDeCalidad, function(index, val) 
					{
						if (val.Tipo == 'Diseño')
							{val.Tipo = 'Disenio';}

						tdsControlDeCalidad = '';

						tdsControlDeCalidad += '<div class="list-group-item">';
							 tdsControlDeCalidad += '<div class="cntControlCalidad_Item row" idItem="' + val.id + '">';
								tdsControlDeCalidad += '<div class="row col-sm-12">';
									tdsControlDeCalidad += '<div class="col-sm-12">';
										tdsControlDeCalidad += '<h4 class="media-heading">' + val.Texto + '</h4>';
									tdsControlDeCalidad += '</div>';
									tdsControlDeCalidad += '<div class="pull-right">';
				                       	tdsControlDeCalidad += '<input type="radio" class="to-labelauty-icon" data-valor="NA" id="optControlCalidad_' + val.id + '_NA" name="optControlCalidad_' + val.id + '" data-plugin="labelauty" data-label="false" checked>';
				                       	tdsControlDeCalidad += '<span class="margin-right-15">NA</span> ';
				                    tdsControlDeCalidad += '';
				                        tdsControlDeCalidad += '<input type="radio" class="to-labelauty-icon" data-valor="SI" id="optControlCalidad_' + val.id + '_SI" name="optControlCalidad_' + val.id + '" data-plugin="labelauty" data-label="false">';
				                        tdsControlDeCalidad += '<span class="margin-right-15">SI</span> ';
				                    tdsControlDeCalidad += '';
				                        tdsControlDeCalidad += '<input type="radio" class="to-labelauty-icon" data-valor="NO" id="optControlCalidad_' + val.id + '_NO" name="optControlCalidad_' + val.id + '" data-plugin="labelauty" data-label="false">';
				                        tdsControlDeCalidad += '<span>NO</span> ';
				                    tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '<br><br><br><br>';
								tdsControlDeCalidad += '<div class="row col-sm-12"> ';
				                    tdsControlDeCalidad += '<div class="form-group">';
										tdsControlDeCalidad += '<div class="col-sm-6 form-material">';
					                    	tdsControlDeCalidad += '<label class="control-label" for="">Observaciones:</label>';
					                    	tdsControlDeCalidad += '<textarea class="form-control txtControlCalidad_Item_Observaciones">' + val.Observaciones + '</textarea>';
					                    tdsControlDeCalidad += '</div>';
										tdsControlDeCalidad += '<div class="col-sm-6  form-material">';
											tdsControlDeCalidad += '<label class="control-label" for="">Respuesta:</label>';
					                    	tdsControlDeCalidad += '<textarea class="form-control txtControlCalidad_Item_Respuesta">' + val.Respuesta  + '</textarea>';
				                    	tdsControlDeCalidad += '</div>';
				                    tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '</div>';
							tdsControlDeCalidad += '</div>';
						tdsControlDeCalidad += '</div>';

						$('#cntControlDeCalidad_' + val.Tipo + '_list').append(tdsControlDeCalidad);

						if (Usuario.idPerfil != '8')
						{
							$('input[name="optControlCalidad_' + val.id + '"]').attr('disabled','disabled');
						}

						if ($('#optControlCalidad_' + val.id + '_' + val.Valor).length > 0)
						{
							$('#optControlCalidad_' + val.id + '_' + val.Valor).trigger('click');
						}
					});

					if (data.controlDeCalidad_historico != 0)
					{
						$.each(data.controlDeCalidad_historico, function(index, val) 
						{
							 controlDeCalidad_addHistorio(val);
						});

					}

					if (data.controlDeCalidad_Levantamiento != 0)
					{
						$('#cntControlDeCalidad_Ficha_list div').remove();

						$.each(data.controlDeCalidad_Levantamiento, function(index, val) 
						{
							tdsControlDeCalidad = '';

							tdsControlDeCalidad += '<div class="list-group-item">';
								 tdsControlDeCalidad += '<div class="cntControlCalidad_Item_Ficha row" idItem="' + val.id + '">';
									tdsControlDeCalidad += '<div class="row col-sm-4">';
										tdsControlDeCalidad += '<h4 class="media-heading">' + val.codPoste + '</h4>';
									tdsControlDeCalidad += '</div>';
									tdsControlDeCalidad += '<div class="col-sm-8">'
					                    tdsControlDeCalidad += '<div class="form-group">';
											tdsControlDeCalidad += '<div class="col-sm-12 form-material">';
						                    	tdsControlDeCalidad += '<label class="control-label" for="">Observaciones:</label>';
						                    	tdsControlDeCalidad += '<textarea class="form-control txtControlCalidad_Item_Ficha_Observaciones">' + val.Observaciones + '</textarea>';
						                    tdsControlDeCalidad += '</div>';
					                    tdsControlDeCalidad += '</div>';
					                tdsControlDeCalidad += '</div>';
								tdsControlDeCalidad += '</div>';
							tdsControlDeCalidad += '</div>';

							$('#cntControlDeCalidad_Ficha_list').append(tdsControlDeCalidad);
						});
					}

					if (Usuario.idPerfil != '8')
					{
						$('.txtControlCalidad_Item_Observaciones').attr('disabled','disabled');
						$('.txtControlCalidad_Item_Ficha_Observaciones').attr('disabled','disabled');
					} else
					{
						$('.txtControlCalidad_Item_Respuesta').attr('disabled','disabled');
					}

					$(".to-labelauty-icon").labelauty({ label: false });
				

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



function cargarLevantamiento()
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



function controlDeCalidad_addHistorio(val)
{
	$("#cntControlDeCalidad_Historial_list .alert").remove();

	var tmpIcono = '<i class="icon wb-check" aria-hidden="true"></i>';
	var tmpStatus = 'online';
	if (val.Resultado == 0)
	{
		tmpIcono = '<i class="icon wb-close" aria-hidden="true"></i>';
		tmpStatus = 'away';
	}

	var tds = '';

	tds += '<li class="list-group-item">';
        tds += '<div class="media">';
          tds += '<div class="media-left">';
            tds += '<a class="avatar" href="javascript:void(0)">';
              tds += tmpIcono;
            tds += '</a>';
          tds += '</div>';
          tds += '<div class="media-body">';
            tds += '<h4 class="media-heading"><a class="lnkControlCalidad_AbrirRevision" href="#" idControl="' + val.id + '">Revisión ' + val.Revision + '</a></h4>';
            tds += '<small>Hecho por</small> <span>' + val.Usuario + '</span><br>';
            tds += '<small>Hecho en</small> <span>' + val.fechaCargue + '</span>';
          tds += '</div>';
          tds += '<div class="media-right">';
            tds += '<span class="status status-lg status-' + tmpStatus + '"></span>';
          tds += '</div>';
        tds += '</div>';
    tds += '</li>';

    $("#cntControlDeCalidad_Historial_list").prepend(tds);

}
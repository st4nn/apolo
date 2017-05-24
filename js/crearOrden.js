crearOrden();

function crearOrden()
{
	crearOrden_NuevaOrden();
	crearOrden_CargarArchivo();

	$("#txtCrearOrden_fechaOcen, #txtCrearOrden_RadicadoFecha").datepicker({
		    clearBtn: true,
		    language: "es",
		    orientation: "top auto",
		    daysOfWeekHighlighted: "0",
		    autoclose: true,
		    todayHighlight: true
		});
	$("#txtCrearOrden_horaOcen, #txtCrearOrden_RadicadoHora").timepicker({ 'timeFormat': 'H:i:s',  'scrollDefault': 'now'  });

	$("#txtCrearOrden_Zona").cargarCombo("Zonas", function()
	{
		$("#txtCrearOrden_Zona").prepend('<option value="0">Seleccione una Zona</option>');
	});
	$("#txtCrearOrden_Zona").on("change", txtCrearOrden_Zona_Change);
	
	crearOrden_cargarFunciones();

	$("input:radio[name=radCrearOrden_TP]").on("click", function()
	{
		$("#txtCrearOrden_tipoProyecto").val($("input:radio[name=radCrearOrden_TP]:checked").val());
	});
	$("#cntCrearOrden_btnTipoProyecto button").on("click", crearOrden_checkFunciones);

	$("#frmCrearOrden").on("submit", frmCrearOrden_Submit);

	$("#btnCrearOrden_Nuevo").on("click", function(evento)
	{
		evento.preventDefault();
		$("#frmCrearOrden")[0].reset();
		crearOrden_NuevaOrden();
	});


	$(document).delegate('.btnCrearOrden_ArchivosEliminar', 'click', function(event) 
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

function frmCrearOrden_Submit(evento)
{
	evento.preventDefault();
	var objActividades = $("#cntCrearOrden_Funciones .chkCrearOrden_Actividad:checked");
	if (objActividades.length > 0)
	{
		var tds = "";
		$.each(objActividades, function(index, val) 
		{
			 tds += $(val).attr("id").replace("txtCrearOrden_FuncionChk", "") + ",";
		});
		$("#txtCrearOrden_Funciones").val(tds);

		$("#frmCrearOrden").generarDatosEnvio("txtCrearOrden_", function(datos)
			{
				$.post("../server/php/scripts/crearOT.php",
				{datos: datos, idLogin : Usuario.id}, function(data, textStatus, xhr)
				{
					if (parseInt(data) > 0)
		          	{
			            Mensaje("Ok", "La OT ha sido almacenada."); 
			            alertify.set({"labels" : {"ok" : "Ir a la Hoja de Trabajo", "cancel" : "Crear Nueva OT"}});
						alertify.confirm("La OT se ha Almacenado con el consecutivo " + parseInt(data), function (ev) 
						{
							if (ev)
							{
								localStorage.setItem('wsp_epsa_OTCreada_id', data);
								window.location.replace("../hojasDeTrabajo/crearHoja.html");
							} else
							{
					            $("#frmCrearOrden")[0].reset();
					            crearOrden_NuevaOrden();
							} 
						});   
			        } else
			        {
			            Mensaje("Error", data);    
			        }
				});
			});

	} else
	{
		Mensaje("Hey", "Debe seleccionar por lo menos una actividad para esta OT");
		return false;
	}
	
}
function crearOrden_cargarFunciones()
{
	$("#cntCrearOrden_Funciones div").remove();
	$.post('../server/php/scripts/cargarFunciones.php', {}, function(data, textStatus, xhr) 
	{
		var tds = "";
		$.each(data, function(index, val) 
		{
			tds += '<div class="col-md-4">';
				tds += '<div class="checkbox-custom checkbox-primary">';
					tds += '<input type="checkbox" id="txtCrearOrden_FuncionChk' + val.id + '" class="chkCrearOrden_Funcion">';
					tds += '<label for="txtCrearOrden_FuncionChk' + val.id + '">' + val.Nombre + '</label>';
				tds += '</div>';
				tds += '<div id="cntCrearOrden_Funcion' + val.id + '" class="margin-left-25 hide"></div>';
			tds += '</div>';
		});
		$("#cntCrearOrden_Funciones").append(tds);
		
		$(".chkCrearOrden_Funcion").change(crearOrden_chkFunciones_Click);

		$.post('../server/php/scripts/cargarFunciones_Actividades.php', {}, function(data, textStatus, xhr) 
		{
			var tds = "";
			$.each(data, function(index, val) 
			{
				tds = "";
				tds += '<div class="checkbox-custom checkbox-success">';
					tds += '<input type="checkbox" id="txtCrearOrden_FuncionChk' + val.idFuncion + '_' + val.idActividad + '" class="chkCrearOrden_Actividad">';
					tds += '<label for="txtCrearOrden_FuncionChk' + val.idFuncion + '_' + val.idActividad + '">(<b>' + val.idActividad + '</b>) ' + val.nombreActividad+ '</label>';
				tds += '</div>';
				$("#cntCrearOrden_Funcion" + val.idFuncion).append(tds);
			});
			//$("#cntCrearOrden_Funciones input[type=checkbox]").on("click", crearUsuario_listenChkZonas);
		}, "json");
		
	}, "json");
}

function crearOrden_checkFunciones(evento)
{
	evento.preventDefault();
	$("#cntCrearOrden_Funciones .chkCrearOrden_Funcion").prop("checked", false).trigger("change");

	$(".cntRadCrearOrden_P").hide();
	


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

	$("#txtCrearOrden_Tiempo").val(tiemposProyecto[selTipoProyecto]);

	if ($("#cntRadCrearOrden_P" + selTipoProyecto).length)
	{
		$("#cntRadCrearOrden_P" + selTipoProyecto).show();
	} 
	$('#radCrearOrden_P' + selTipoProyecto + '_1').prop('checked', 'true');
	$("#txtCrearOrden_tipoProyecto").val($("input:radio[name=radCrearOrden_TP]:checked").val());
	

	$.each(tipoProyecto[selTipoProyecto], function(index, val) 
	{
		$("#txtCrearOrden_FuncionChk" + val).prop("checked", true).trigger("change"); 
	});
}

function crearOrden_chkFunciones_Click()
{
	var idFuncion = $(this).attr('id').replace("txtCrearOrden_FuncionChk", "");
	if ($(this).is(":checked"))
	{
		$("#cntCrearOrden_Funcion" + idFuncion).slideDown();
	} else
	{
		$("#cntCrearOrden_Funcion" + idFuncion).slideUp();
		$("#cntCrearOrden_Funcion" + idFuncion + " input[type=checkbox]").prop("checked", false); 
	}
}
function txtCrearOrden_Zona_Change()
{
	var datos = {};
	datos["idZona"] = $(this).val();
	datos = JSON.stringify(datos);

	$("#txtCrearOrden_Municipio").cargarCombo("MunicipiosZona", function(){}, [], {datos : datos});
}
function crearOrden_NuevaOrden()
{
	$("#txtCrearOrden_Prefijo").val(obtenerPrefijo());
	$("#frmCrearOrden_Archivos").attr("action", "../server/php/subirArchivo.php?Ruta=OT/" + $("#txtCrearOrden_Prefijo").val());
	$("#frmCrearOrden_Archivos")[0].reset();
	$("#cntCrearOrden_Archivos li").remove();
}
function crearOrden_CargarArchivo()
{
	$("#frmCrearOrden_Archivos").ajaxForm(
	{
		beforeSend: function() 
		{
		    var percentVal = '0%';
		    $("#txtCrearOrden_ArchivoProgreso").width(percentVal);
		    $("#txtCrearOrden_ArchivoProgreso").text(percentVal);
		},
		uploadProgress: function(event, position, total, percentComplete) {
		    
		    var percentVal = percentComplete + '%';
		    $("#txtCrearOrden_ArchivoProgreso").width(percentVal);
		    $("#txtCrearOrden_ArchivoProgreso").text(percentVal);
		},
		success: function() {
		    var percentVal = '100%';
		    $("#txtCrearOrden_ArchivoProgreso").width(percentVal);
		    $("#txtCrearOrden_ArchivoProgreso").text(percentVal);
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
                    	tds += '<a class="btn btn-danger pull-right btnCrearOrden_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
	                  tds += '</h4>';
	                tds += '</div>';
	              tds += '</div>';
	            tds += '</li>';

	        $("#cntCrearOrden_Archivos").append(tds);
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
		 }
	}); 

}

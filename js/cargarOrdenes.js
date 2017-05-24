CargarOrdenes();

function CargarOrdenes()
{
	$("#txtCargarOrdenes_idUsuario").val(Usuario.id);

    $("#frmCargarOrdenes_CargarArchivo").ajaxForm(
      {
      	beforeSubmit: function() 
      	{
      		var nombreDeArchivo = $("[name=archivo]").val().split("\.");
        	nombreDeArchivo = nombreDeArchivo[nombreDeArchivo.length - 1];
        	if (nombreDeArchivo != "xls")
        	{
        		Mensaje("Error", "El tipo de archivo cargado no está soportado en este proceso, por favor cargue un archivo con extensión XLS");
        		return false;
        	}
      	}, 
        beforeSend: function() 
        {
        	$("#lblCargarOrdenes_Comentarios").text("");
            var percentVal = '0%';
            $("#txtCargarOrdenes_ArchivoProgreso").width(percentVal);
            $("#txtCargarOrdenes_ArchivoProgreso").text(percentVal);
        },
        uploadProgress: function(event, position, total, percentComplete) {
            
            var percentVal = percentComplete + '%';
            $("#txtCargarOrdenes_ArchivoProgreso").width(percentVal);
            $("#txtCargarOrdenes_ArchivoProgreso").text(percentVal);
        },
        success: function() {
            var percentVal = '100%';
            $("#txtCargarOrdenes_ArchivoProgreso").width(percentVal);
            $("#txtCargarOrdenes_ArchivoProgreso").text(percentVal);
        },
      complete: function(xhr) {
          var respuesta = xhr.responseText;
          if (respuesta.substring(0, 12) == "../archivos/")
          {
            $.post("../server/php/scripts/cargueOcen.php", 
            {
              archivo : respuesta
            },
            function(data)
            {
              if (data != 0)
              {
                var idx = 0;
                if (typeof data == "object")
                {
                  $("#lblCargarOrdenes_TotalOrdenesIdentificadas").text(data.Identificadas);
                  $("#lblCargarOrdenes_Comentarios").text("No olvide Diligenciar las Actividades");

                  if (data.Error != "")
                  {
                  	Mensaje("Error", data.Error);
                  } else
                  {
                  	Mensaje("Hey", "Las Ordenes han sido cargadas");
                  }
                } else
                {
                  Mensaje("Error", data);
                }
              } 
            }, "json").fail(function()
            {
              //Mensaje("Error", "No hay conexión con el Servidor SI");
            });
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
        }
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
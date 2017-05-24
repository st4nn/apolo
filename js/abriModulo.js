//var idxJs = 0;
//var cargaScriptPropio = false;
jQuery(document).ready(function($) {
  abrirModulo();
});

function abrirModulo()
{
  $.ajaxSetup({
    cache: true
  });
  $("body > header").abrirModulo_cargarArchivos("../admin/header.html", function()
    {
      $("#lblCerrarSesion").on("click", cerrarSesion);
      $("#lblUsuario").text(Usuario.nombre);
    });
  
    $("body > sidebar").abrirModulo_cargarArchivos("../admin/sidebar.html", function()
    {
      $("body > footer").abrirModulo_cargarArchivos("../admin/footer.html", function()
        {
            Site.run();
            
            var nomArchivo = location.href;
            var arrNomArchivo = location.href.split("/");
            nomArchivo = arrNomArchivo[arrNomArchivo.length - 2] + "/" + arrNomArchivo[arrNomArchivo.length - 1];
            arrNomArchivo = nomArchivo.split("?");
            nomArchivo = arrNomArchivo[0];
            arrNomArchivo = nomArchivo.split("#");
            nomArchivo = arrNomArchivo[0];
            //abrirModulo_cargarPlugins(nomArchivo);
            
            if (modulos[nomArchivo] != undefined )
            {
              $("#lblNomModulo").text(modulos[nomArchivo].titulo);
              abrirModulo_CargarScriptPropio();
            } 
        });
    });
}

$.fn.abrirModulo_cargarArchivos = function (modulo, callback)
{
  if (callback === undefined)
    {callback = function(){};}
  var obj = this;

  //modulo += "?timeStamp=" + Date.now();
  $.get(modulo, function(data) 
    {
      $(obj).html(data).promise().done(function()
      {
        callback();
      });

    });
  return 1;
}

function abrirModulo_cargarPlugins(nomArchivo)
{
  if (modulos[nomArchivo] != undefined )
  {
    if  (arrPlugins[modulos[nomArchivo].nick].length > 0)
    {
      $.each(arrPlugins[modulos[nomArchivo].nick], function(index, val) 
      {
         $("customCss").append(archivosCSS[val]);
         
      });
      
      abrirModulo_cargarJs(arrPlugins[modulos[nomArchivo].nick]);

    } else
    {
      abrirModulo_cargarJs();
    }
  }
}

function abrirModulo_cargarJs(plugins)
{
  if (plugins === undefined)
  {
    plugins = {};
  }

  var idxPlugin = 0;
  var idxCargue = 0;
  $.each(plugins, function(index, val) 
  {
    idxPlugin += archivosJS[val].length;
    $.each(archivosJS[val], function(index2, urlPlugin) 
    {
       $.getScript(urlPlugin, function()
       {
          idxCargue++;
          if (idxCargue >= idxPlugin)
          {
            abrirModulo_CargarScriptPropio(); 
          }
       });
       $(this).delay(10);
    });
  });
  
  if (plugins === {})
  {
    abrirModulo_CargarScriptPropio(); 
  }
    
}

function abrirModulo_CargarScriptPropio()
{
  $.ajaxSetup({
    cache: false
  })
  
  var arrNomArchivo = location.href.split("/");
  nomArchivo = arrNomArchivo[arrNomArchivo.length - 1];    //$("fixedScripts").append("<script src='../js/" + nomArchivo.replace(".html", ".js") + "'>");
  $.getScript("../js/" + nomArchivo.replace(".html", ".js"), function(ev)
    {
      controlarPermisos();
    });
}

/*
function abrirModulo_cargarJs(val)
{
  //console.log(archivosJS[val]);
  if (val === undefined)
  {
    archivosJS[val] = 0;
  }

  if (idxJs < archivosJS[val].length)
  {
    $.getScript(archivosJS[val][idxJs], function()
      {
        idxJs++;
        abrirModulo_cargarJs(val);
      }); 
  } else
  {
    if (!cargaScriptPropio)
    {
      cargaScriptPropio = true;
      var arrNomArchivo = location.href.split("/");
      nomArchivo = arrNomArchivo[arrNomArchivo.length - 1];    //$("fixedScripts").append("<script src='../js/" + nomArchivo.replace(".html", ".js") + "'>");
      $.getScript("../js/" + nomArchivo.replace(".html", ".js"), function(ev)
        {
          Site.run();
        });
    }
  }
}
*/
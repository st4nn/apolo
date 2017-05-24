//$(document).on("ready", informacionEstructual);
informacionEstructual();

function informacionEstructual()
{
	var graph = new joint.dia.Graph();

	var paper = new joint.dia.Paper({
	    el: $('#cntInfEstructural_Paper'),
	    width: 800,
	    height: 800,
	    gridSize: 20,
	    model: graph,
	    perpendicularLinks: true,
	    restrictTranslate: false
	});

	var member = function(x, y, nombre, cargo, correo, telefono, extension, celular, image, background, textColor) {
		background  = background || '#30d0c6';
	    textColor = textColor || "#000";

	    var cell = new joint.shapes.org.Member({
	        position: { x: x, y: y },
	        attrs: {
	            '.card': { fill: background, stroke: 'none'},
	              image: { 'xlink:href': '../assets/images/'+ image, opacity: 0.7 },
	            '.cargo': { text: cargo, fill: textColor, 'word-spacing': '-5px', 'letter-spacing': 0},
	            '.nombre': { text: nombre, fill: textColor, 'font-size': 13, 'font-family': 'Arial', 'letter-spacing': 0 },
	            '.correo' : { text: correo, fill: "#3366FF", 'font-size': 13, 'font-family': 'Arial', 'letter-spacing': 0 },
	            '.tel' : { text: telefono, fill: textColor, 'font-size': 13, 'font-family': 'Arial', 'letter-spacing': 0 },
	            '.ext' : { text: extension, fill: textColor, 'font-size': 13, 'font-family': 'Arial', 'letter-spacing': 0 },
	            '.cel' : { text: celular, fill: textColor, 'font-size': 13, 'font-family': 'Arial', 'letter-spacing': 0 }
	        }
	    });
	    graph.addCell(cell);
	    return cell;
	};

	function link(source, target, breakpoints) {

	    var cell = new joint.shapes.org.Arrow({
	        source: { id: source.id },
	        target: { id: target.id },
	        vertices: breakpoints,
	        attrs: {
	            '.connection': {
	                'fill': 'none',
	                'stroke-linejoin': 'round',
	                'stroke-width': '2',
	                'stroke': '#4b4a67'
	            }
	        }

	    });
	    graph.addCell(cell);
	    return cell;
	}
	

	var datos = [
		{ "x" : 300, "y" : 15, "Nombre" : "Jorge Celis", "Cargo" : "CEO", "Correo" : "jorge.celis@wspgroup.com", "Telefono" : "7562989", "Ext" : "", "Cel" :  "", "Icono" : "male.png", "Color" : "#30d0c6", "textColor" : "#000", "idPadre" : 0},
		{ "x" : 90, "y" : 200, "Nombre" : "Jhonathan Espinosa", "Cargo" : "VPMarketing", "Correo" : "jhonathan.epsinosa@wspgroup.com", "Telefono" : "7562989", "Ext" : "", "Cel" :  "3214551215", "Icono" : "male.png", "Color" : "#30d0c6", "textColor" : "#000", "idPadre" : 1},
		{ "x" : 300, "y" : 200, "Nombre" : "Pablo Manrrique", "Cargo" : "VPSales", "Correo" : "pablo.manrrique@wspgroup.com", "Telefono" : "7562989", "Ext" : "", "Cel" :  "", "Icono" :"male.png", "Color" : "#30d0c6", "textColor" : "#000", "idPadre" : 1},
		{ "x" : 500, "y" : 200, "Nombre" :  "Lisa Simpson", "Cargo" : "VPProduction", "Correo" : "", "Telefono" : "7562989", "Ext" : "", "Cel" :  "", "Icono" :"female.png", "Color" : "#30d0c6", "textColor" : "#000", "idPadre" : 1},
		{ "x" : 400, "y" : 350, "Nombre" : "Maggie Simpson", "Cargo" : "Manager", "Correo" : "", "Telefono" : "7562989", "Ext" : "", "Cel" :  "", "Icono" :"female.png", "Color" : "#30d0c6", "textColor" : "#000", "idPadre" : 3},
		{ "x" : 190, "y" : 350, "Nombre" : "Lenny Leonard", "Cargo" : "Manager", "Correo" : "", "Telefono" : "7562989", "Ext" : "", "Cel" :  "", "Icono" :"male.png", "Color" : "#30d0c6", "textColor" : "#000", "idPadre" : 2},
		{ "x" : 190, "y" : 500, "Nombre" : "Carl Carlson", "Cargo" : "Manager", "Correo" : "", "Telefono" : "7562989", "Ext" : "", "Cel" :  "", "Icono" : "male.png", "Color" : "#30d0c6", "textColor" : "#000", "idPadre" : 2}
	];
	
	var objMember = [];
	var idx = 1;
	
	$.each(datos, function(index, val) 
	{
		
		objMember[idx] = member(val.x, val.y, val.Nombre, val.Cargo, val.Correo, val.Telefono, val.Ext, val.Cel, val.Icono, val.Color, val.textColor);
		idx++;
	});



	idx = 0;
	var objCoord = [];
	objCoord[2] = [{x: 385, y: 180}, {x: 175, y: 180}];
	objCoord[3] = [{x: 385, y: 20}];
	objCoord[4] = [{x: 385, y: 180}, {x: 585, y: 180}];
	objCoord[5] = [{x:175 , y: 380}];
	objCoord[6] = [{x:175 , y: 530}];
	objCoord[7] = [{x:385 , y: 380}];

	idx = 1 ;
	$.each(datos, function(index, val) 
	{
		if (val.idPadre != 0)
		{
			//link(objMember[val.idPadre], objMember[idx], objCoord[idx]);
			link(objMember[val.idPadre], objMember[idx]);
		}
		idx++;
	});
	

/*
	var bart = member(300,10,'Jorge Celis', 'CEO', 'jorge.celis@wspgroup.com', '7562989','001', '', 'male.png');
	var homer = member(90,200,'Jhonathan Espinosa', 'VPMarketing', 'jhonathan.epsinosa@wspgroup.com', '7562989','', '3214551215','male.png');
	var marge = member(300,200,'Pablo Manrrique', 'VPSales', 'pablo.manrrique@wspgroup.com', '7562989','', '','male.png');
	var lisa = member(500,200, 'Lisa Simpson', 'VPProduction', '', '7562989','', '','female.png');
	var maggie = member(400,350,'Maggie Simpson', 'Manager', '', '7562989','', '','female.png');
	var lenny = member(190,350,'Lenny Leonard', 'Manager', '', '7562989','', '','male.png');
	var carl = member(190,500,'Carl Carlson', 'Manager', '', '7562989','', '', 'male.png');
/*

	link(bart, marge, [{x: 385, y: 20}]);
	link(bart, homer, [{x: 385, y: 180}, {x: 175, y: 180}]);
	link(bart, lisa, [{x: 385, y: 180}, {x: 585, y: 180}]);
	link(homer, lenny, [{x:175 , y: 380}]);
	link(homer, carl, [{x:175 , y: 530}]);
	link(marge, maggie, [{x:385 , y: 380}]);
*/	

	

	$("g .rotatable").mouseup(function()
	{
		var posicion = $(this).position();
		console.log("actualizarXY(" + posicion.left +", " + posicion.top + ")");
	})

}
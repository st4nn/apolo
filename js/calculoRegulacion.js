calculoRegulacion();

function calculoRegulacion()
{
	$("#frmCR_AgregarItem").on("submit", cr_AgregarItem);
}
function cr_AgregarItem(evento)
{
	evento.preventDefault();
	
	var tds ="";
		tds += '<tr>';
		tds += '<td>' + $("#txtCR_TramoIni").val() + '</td>';
    	tds += '<td>' + $("#txtCR_TramoFin").val() + '</td>';
    	tds += '<td></td>'; //Reg Parc
    	tds += '<td></td>'; //Reg Acum
    	tds += '<td>' + $("#txtCR_Longitud").val() + '</td>';
    	tds += '<td>' + $("#txtCR_Calibre").val() + '</td>';
    	tds += '<td>' + $("#txtCR_UsuariosNum").val() + '</td>';
    	tds += '<td>' + $("#txtCR_APNum").val() + '</td>';
    	tds += '</tr>';

    //$("#tblCR_Resultados tbody").append(tds);

    cr_realizarCalculos();
}

function cr_realizarCalculos()
{
	var objTbl = $("#tblCR_Resultados tbody tr");
	var objTblLen = $(objTbl).length;
	
	var 
		tramoIni = [],
		tramoFin = [],
		longitud = [],
		calibre = [],
		usuariosNum = [],
		usuariosAcum = [],
		usuariosProy = [],
		apNum = [],
		apParc = [],
		apAcum = [],
		factor = [],
		demanda = [],
		momento = [],
		regulacionParc = [],
		regulacionAum = [];


	var objTd = {};
	$.each(objTbl, function(index, val) 
	{
		objTd = $(val).find("td");

		tramoIni[index] = $(objTd[0]).text();
		tramoFin[index] = $(objTd[1]).text();
		longitud[index] = $(objTd[4]).text();
		calibre[index] = $(objTd[5]).text();
		usuariosNum[index] = $(objTd[6]).text();
		apNum[index] = $(objTd[7]).text();

		usuariosAcum[index] = parseInt($(objTd[6]).text());

		usuariosProy[index] = 0;
		apParc[index] = 0;
		apAcum[index] = 0;
		factor[index] = 0;
		demanda[index] = 0;
		momento[index] = 0;
		regulacionParc[index] = 0;
		regulacionAum[index] = 0;

	});

	var objCond = true;
	var idxR = 0;

	function bucle1()
	{
		if (idxR < tramoIni.length) 
		{
			
		}
	}

	bucle1();
	/*
	$.each(objTbl, function(idx, valor) 
	{
		$.each(objTbl, function(index, val) 
		{
			 if (tramoFin[idx] == tramoIni[index])
			 {
			 	usuariosAcum[idx] += parseInt(usuariosNum[index]);
			 }
		});

		$(valor).find("td:eq(7)").html(usuariosAcum[idx]);
	});
	*/
}

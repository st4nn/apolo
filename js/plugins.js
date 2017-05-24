var modulos = 
{
	"admin/home.html" : {titulo : "Inicio", nick : "ad_Home"},
	"usuarios/crearUsuario.html" : {titulo : "Crear Usuario", nick : "us_Crear"},
	"usuarios/verUsuarios.html" : {titulo : "Ver Usuarios", nick : "us_Ver"},
	"ordenesDeTrabajo/crearOrden.html" : {titulo : "Crear OT", nick : "ot_Crear"},
	"ordenesDeTrabajo/editarOrden.html" : {titulo : "Editar OT", nick : "ot_Editar"},
	"ordenesDeTrabajo/verOrden.html" : {titulo : "Ver OT", nick : "ot_Ver"},
	"ordenesDeTrabajo/panelDeOrdenes.html" : {titulo : "Ordenes de Trabajo", nick : "ot_Ordenes"},
	"ordenesDeTrabajo/cargarOrdenes.html" : {titulo : "Cargar OTs", nick : "ot_Cargar"},
	"hojasDeTrabajo/crearHoja.html" : {titulo : "Crear Hoja de Trabajo", nick : "ht_Crear"},
	"hojasDeTrabajo/verHoja.html" : {titulo : "Ver Hoja de Trabajo", nick : "ht_Ver"},
	"operativo/calculoRegulacion.html" : {titulo : "Calculo de Regulación", nick : "calculoRegulacion"},
	"operativo/misActividades.html" : {titulo : "Mis Actividades", nick : "op_Actividades"},
	"operativo/panelOT.html" : {titulo : "Panel de OT", nick : "op_Panel"},
	"reportes/actividadesSinAsignar.html" : {titulo : "Actividades Sin Asignar", nick : "rp_actividadesSinAsignar"},
	"reportes/actividadesCumplidas.html" : {titulo : "Actividades Cumplidas", nick : "rp_actividadesCumplidas"},
	"reportes/OT_Huerfanas.html" : {titulo : "OT Huerfanas", nick : "rp_OTHuerfanas"},
	"reportes/OT_Vencidas.html" : {titulo : "OT Vencidas", nick : "rp_OTVencidas"},
	"levantamiento/reporte.html" : {titulo : "Levantamiento", nick : "lv_Reporte"}
};
var arrPlugins =
{
	ad_Home : ["charjs"],
	us_Crear : [],
	us_Ver : ["datatable"],
	ot_Crear : ["jqueryForm", "datepicker", "timepicker"],
	ot_Editar : ["jqueryForm", "datepicker", "timepicker"],
	ot_Cargar : ["jqueryForm"],
	ot_Ver : ["datatable", "datepicker"],
	ot_Ordenes : ["datatable", "datepicker"],
	ht_Crear : ["datatable", "jqueryForm", "datepicker"],
	ht_Ver : ["datatable", "jqueryForm", "datepicker"],
	calculoRegulacion : ["tablesresponisive"],
	op_Actividades : [],
	op_Panel : [],
	rp_actividadesSinAsignar : ["datatable"],
	rp_actividadesCumplidas : ["datatable"],
	rp_OTHuerfanas : ["datatable"],
	rp_OTVencidas : ["datatable"],
	lv_Reporte : ["datatable"]
};
var archivosCSS = 
{
	"charjs" : "<link rel='stylesheet' href='../assets/examples/css/charts/chartjs.css'>",
	"datatable" : "<link rel='stylesheet' href='../assets/vendor/datatables-bootstrap/dataTables.bootstrap.css'><link rel='stylesheet' href='../assets/vendor/datatables-fixedheader/dataTables.fixedHeader.css'><link rel='stylesheet' href='../assets/vendor/datatables-responsive/dataTables.responsive.css'>",
	"datepicker" : "<link rel='stylesheet' href='../assets/vendor/bootstrap-datepicker/bootstrap-datepicker.css'>",
	"timepicker" : "<link rel='stylesheet' href='../assets/vendor/jt-timepicker/jquery-timepicker.css'>",
	"tablesresponisive" : "<link rel='stylesheet' href='../assets/vendor/filament-tablesaw/tablesaw.css'>"
};
var archivosJS = 
{
	"charjs" : ['../assets/vendor/chart-js/Chart.js'],
	"jqueryForm" : ['../assets/js/components/jquery.form.js'],
	"datatable" : ['../assets/vendor/datatables/jquery.dataTables.js', '../assets/vendor/datatables-bootstrap/dataTables.bootstrap.js', '../assets/vendor/datatables-tabletools/dataTables.tableTools.js', '../assets/js/components/datatables.js'],
	"datepicker" : ['../assets/vendor/bootstrap-datepicker/bootstrap-datepicker.js'],
	"timepicker" : ['../assets/vendor/jt-timepicker/jquery.timepicker.min.js'],
	"tablesresponisive" : ['../assets/vendor/filament-tablesaw/tablesaw.js']
};

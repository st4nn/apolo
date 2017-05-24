sesionReady();

function sesionReady()
{
  $("body").on('click', expirarSesion);
}
function expirarSesion()
{
  var objDate = 16;
  if (Usuario == null)
  {
    sessionFlag = false;
  } else
  {
    var objUser = JSON.parse(localStorage.getItem('wsp_epsa'));
    var cDate = new Date();
    var sessionFlag = true;
  
    var pDate = new Date(objUser.cDate);
  
    objDate = cDate - pDate;  
  }

  
    if (Math.round((objDate/1000)/60) < 720 && sessionFlag)
    {
      objUser.cDate = cDate;
      localStorage.setItem("wsp_epsa", JSON.stringify(objUser));    
    } else
    {
      delete localStorage.wsp_epsa;
      window.location.replace("../index.html");
    } 
}
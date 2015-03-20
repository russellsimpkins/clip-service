
document.onclick = HCal;
var dt = new Date();
var CalS = (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
dt = new Date((dt.getFullYear()+1),(dt.getMonth()),(dt.getDate()));
var CalE = (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
function SC(el1,el2){if (DE('CalFrame') == null){return;}el1.select();ShowCalendar(el1,el1,el2,CalS,CalE);
	if(el1) {
		 if(el1==document.HotForm.InDate || el1==document.HotForm.OutDate) 
		 DE('CalFrame').className="shiftLeft"
		 else { DE('CalFrame').className=""; }
		 }
}
function HCal(e){if (DE('CalFrame') != null){CancelCal();}}

function DE(el){ return document.getElementById(el);}

function switchOff(tripType) { 
 	if( DE(tripType) != null ) {
 		DE(tripType).style.display = 'none';  
 		var idHeader = tripType + "Header";
 		if( DE(idHeader) != null) {DE(idHeader).style.display = 'none'; }
 		}
}

function hw(id)
{
    var idHeader = id + "Header";
    switchOff('flt'); 
    switchOff('car'); 
    switchOff('pac'); 
    switchOff('hot'); 
    switchOff('cru');
    switchOff('tsh');
    DE(id).style.display = 'block';
    if( DE(idHeader) != null)  DE(idHeader).style.display = 'inline';  
    var d = document.Wiz;
}

function chkBrowser(){this.ver=navigator.appVersion;this.dom=document.getElementById?1:0;this.ie5=(this.ver.indexOf("MSIE 5")>-1 && this.dom)?1:0;this.ie4=(document.all && !this.dom)?1:0;this.ns5=(this.dom && parseInt(this.ver) >= 5) ?1:0;this.ns4=(document.layers && !this.dom)?1:0;this.bVer=(this.ie5 || this.ie4 || this.ns4 || this.ns5);return this;}bVer=new chkBrowser();ns4 = (document.layers)? true:false;ie4 = (document.all)? true:false;
function AttB(f){if(bVer.ie4)f.style.display='block';}
function AttN(f){if(bVer.ie4)f.style.display='none';}
function show(idLayer,idParent){cLayer=bVer.dom?document.getElementById(idLayer).style:bVer.ie4?document.all[idLayer].style:bVer.ns4?idParent?document[idParent].document[idLayer]:document[idLayer]:0;cLayer.display='block';var d=document.Wiz;}
function hide(idLayer,idParent){cLayer=bVer.dom?document.getElementById(idLayer).style:bVer.ie4?document.all[idLayer].style:bVer.ns4?idParent?document[idParent].document[idLayer]:document[idLayer]:0;cLayer.display='none';}
function mrd(i){if (i==1) {hide('hotrm2'); hide('hotrm3'); show('rm1txt');}if (i==2) {show('hotrm2'); hide('hotrm3'); hide('rm1txt');}if (i==3) {show('hotrm2'); show('hotrm3'); hide('rm1txt');}}

function SetPkgType(i){var PkgWithFlightVal = document.PkgFormWithFlight.DestName.value;var PkgNoFlightVal = document.PkgFormNoFlight.DestName.value;
	if (3==i) {
				hide('PkgWithFlight');hide('PkgWithFlightCar');show('PkgNoFlight');
				DE('PkgType').className="shortPkgHeader"
				if (PkgWithFlightVal.length > 0) {
					document.PkgFormNoFlight.DestName.value = PkgWithFlightVal;
					}
			  } else if (5==i) {DE('PkgType').className="normalPkgHeader"
								hide('PkgWithFlight');hide('PkgNoFlight');show('PkgWithFlightCar');

								} else {DE('PkgType').className="normalPkgHeader"
										 hide('PkgNoFlight');hide('PkgWithFlightCar');show('PkgWithFlight');
										 if (PkgNoFlightVal.length > 0) {
										document.PkgFormWithFlight.DestName.value = PkgNoFlightVal;
										}
										document.PkgFormWithFlight.PackageType.value = i;
										}
								document.PkgTypeFrm.PrevPkgType.value = i;
								}


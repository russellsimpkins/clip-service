tDate = new Date();
iMonth = tDate.getMonth();
iYear = tDate.getFullYear();
nextYear = iYear + 1
var j = 0;
for (i=iMonth;i<(iMonth+13);i++){
	if (i > 11) {
		newi = i - 12;
		iYear = nextYear
	} else {
		newi = i;
	}
	tDate.setMonth(newi)
	tDate.setFullYear(iYear)
	switch (newi) {
		case 0:
			strMonth = "January " + iYear;
			break;
		case 1:
			strMonth = "February " + iYear;
			break;
		case 2:
			strMonth = "March " + iYear;
			break;
		case 3:
			strMonth = "April " + iYear;
			break;
		case 4:
			strMonth = "May " + iYear;
			break;
		case 5:
			strMonth = "June " + iYear;
			break;
		case 6:
			strMonth = "July " + iYear;
			break;
		case 7:
			strMonth = "August " + iYear;
			break;
		case 8:
			strMonth = "September " + iYear;
			break;
		case 9:
			strMonth = "October " + iYear;
			break;
		case 10:
			strMonth = "November " + iYear;
			break;
		case 11:
			strMonth = "December " + iYear;
			break;
	}
	document.forms.CruForm.FromDate.options[j] = new Option(strMonth,(tDate.getMonth()+1) + "/1/" + tDate.getYear());
	j++;
}

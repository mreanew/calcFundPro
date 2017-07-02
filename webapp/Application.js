/****************************************************************************
 * DESC       Application
 * AUTHOR     zhouxianli
 * CREATEDATE 2003-05-04
 * MODIFYLIST    Name       Date            Reason/Contents
 *          ------------------------------------------------------
 *
 ************************************************************************************/
 /* --------------------------------Common.js 部分-------------------- */
 var DATE_DELIMITER = "-";
function setDateDelimiter(delimiter) {
    DATE_DELIMITER = delimiter;
}

function replace(str, strFind, strReplaceWith) {
    var strReturn;
    var re = new RegExp(strFind, "g");
    if (str == null) {
        return null;
    }
    strReturn = str.replace(re, strReplaceWith);
    return strReturn;
}

/* ---------------------------------------------------- */

function formatFloat(value,count,precision,delimiterChar)
{
  count = count==null?3:count;
  precision = precision==null?2:precision;
  delimiterChar = delimiterChar==null?",":delimiterChar;

  var strMinus = "";
  if(value<0)
  {
    strMinus = "-";
    value = -1*value;
  }

  var strReturn = "";
  var strValue = point(round(value,precision),precision);

  strReturn = strValue.substring(strValue.length-precision-1);
  strValue = strValue.substring(0,strValue.length-precision-1);
  while(strValue.length>count)
  {
    strReturn = delimiterChar + strValue.substring(strValue.length-count) + strReturn;
    strValue = strValue.substring(0,strValue.length-count);
  }

  strReturn = strMinus + strValue + strReturn;
  return strReturn;
}  
function pointTwo( s )
{
  return point(s,2);
}

function pointFour( s )
{
  return point(s,4);
}



//replace enter to tab
/*
function onkeydownHander(){
  if(   event.keyCode==13
     && event.srcElement.type!='button'
     && event.srcElement.type!='submit'
     && event.srcElement.type!='reset'
     && event.srcElement.type!='textarea')

     event.keyCode=9;
}
document.attachEvent("onkeydown",onkeydownHander);
*/


function functionReturnFalse()
{
  return false;
}

function functionReturnTrue()
{
  return true;
}

function functionDoNothing()
{
  //do nothing
}

function functionCancelFocus()
{
  this.blur();
  window.focus();
  return false;
}

function isDate(date,splitChar)
{
  var charSplit = (splitChar==null?"-":splitChar);
  var strValue = date.split(charSplit);

  if(strValue.length!=3) return false;
  if(!isInteger(strValue[0]) || !isInteger(strValue[1]) || !isInteger(strValue[2]) ) return false;

  var intYear  = parseInt(strValue[0],10);
  var intMonth = parseInt(strValue[1],10)-1;
  var intDay   = parseInt(strValue[2],10);

  var dt = new Date(intYear,intMonth,intDay);
  if( dt.getFullYear() != intYear ||
      dt.getMonth() != intMonth ||
      dt.getDate() != intDay
     )
  {
    return false;
  }
  return true;
}

/*初步认定为
MD D 判断日期差异(相差天数)； 为 M 判断月份差异
*/
function dateDiff(dateStart,dateEnd,MD)
{
  if(MD=="D")
  {
    var endTm = dateEnd.getTime();
    var startTm = dateStart.getTime();
    var diffDay = (endTm-startTm)/86400000+1;

    var diffDayTemp = "'" + diffDay + "'";
    if(diffDayTemp.indexOf(".") != -1){
      diffDay = parseInt(parseInt(diffDay, 10) + 1, 10);
    }

    return diffDay;
  }
  else
  {
    var endD = dateEnd.getDate();
    var endM = dateEnd.getMonth();
    var endY = dateEnd.getFullYear();
    var startD = dateStart.getDate();
    var startM = dateStart.getMonth();
    var startY = dateStart.getFullYear();

    if(endD>=startD)
    {
      return (endY-startY)*12+(endM-startM)+1;
    }
    else
    {
      return (endY-startY)*12+(endM-startM);
    }
  }
}

function isLeapYear(strCheckYear)
{
  var check4=strCheckYear%4==0?1:0;
  var check100=strCheckYear%100==0?-1:0;
  var check400=strCheckYear%400==0?1:0;
  var result=check4+check100+check400;
  if(result==1)
  {
    return true
  }
  return false
}
 

/*
get距离今天多天后的日期；
*/
function getNextDateFullDate(strDate,intCount)
{
  var tempDate = new Date(replace(strDate,"-","/"));
  if(intCount == null)
  {
    intCount =1;
  }

  var nextDateInMS = tempDate.getTime() + (intCount * 24 * 60 * 60 * 1000 );
  var strReturn = convertFullDateToString(new Date(nextDateInMS));
  return strReturn;
}

/*
get距离今天多月后的日期；
*/
function getNextMonthFullDate(strDate,intCount)
{
  var tempDate = new Date(replace(strDate,"-","/"));
  if(intCount == null)
  {
    intCount =1;
  }

  tempDate.setMonth(tempDate.getMonth() + intCount );
  var strReturn = convertFullDateToString(tempDate);
  return strReturn;
}
/*
get距离今天多年后的日期；
*/
function getNextYearFullDate(strDate,intCount)
{
  var tempDate = new Date(replace(strDate,"-","/"));
  if(intCount == null)
  {
    intCount =1;
  }

  tempDate.setFullYear(tempDate.getFullYear() + intCount );
  var strReturn = convertFullDateToString(tempDate);
  return strReturn;
}

/*
将日期date 转换为字符串 字符串显示到 天
*/
function convertFullDateToString(date) {
  if(date==null) {
    date = new Date();
  }

  var strDate = "";
  var year = "";
  var month = "";
  var day = "";
  year = date.getFullYear();
  if(parseInt(date.getMonth() + 1, 10) < 10) {
    month = "0" + parseInt(date.getMonth() + 1, 10)
  } else {
    month = parseInt(date.getMonth() + 1, 10);
  }
  if(parseInt(date.getDate(), 10) < 10) {
    day = "0" + parseInt(date.getDate(), 10)
  } else {
    day = parseInt(date.getDate(), 10);
  }
  strDate = year + DATE_DELIMITER + month + DATE_DELIMITER + day;
  return strDate;
}

function isNumeric(strValue)
{
  var result = regExpTest(strValue,/\d*[.]?\d*/g);
  return result;
}

function isInteger(strValue)
{
  var result = regExpTest(strValue,/\d+/g);
  return result;
}

function checkFullDate(field)
{
  field.value = trim(field.value);
  var strValue = field.value;
  if(strValue=="")
  {
    return false;
  }
  if(isNumeric(strValue))
  {
    if(strValue.length > 6 && strValue.length < 9)
    {
      strValue = strValue.substring(0,4) + DATE_DELIMITER + strValue.substring(4,6) + DATE_DELIMITER + strValue.substring(6);
      field.value = strValue;
    }
    else
    {
      errorMessage("The correct date format is yyyy-MM-dd.");
      field.value="";
      field.focus();
      field.select();
      return false;
    }
  }
  if( !isDate(strValue,DATE_DELIMITER) && !isDate(strValue)||strValue.substring(0,1)=="0")
  {
    errorMessage("The correct date format is yyyy-MM-dd.");
    field.value="";
    field.focus();
    field.select();
    return false;
  }
  return true;
}

function compareFullDate(date1,date2)
{
  var strValue1=date1.split(DATE_DELIMITER);
  var date1Temp=new Date(strValue1[0],parseInt(strValue1[1],10)-1,parseInt(strValue1[2],10));

  var strValue2=date2.split(DATE_DELIMITER);
  var date2Temp=new Date(strValue2[0],parseInt(strValue2[1],10)-1,parseInt(strValue2[2],10));

  if(date1Temp.getTime()==date2Temp.getTime())
    return 0;
  else if(date1Temp.getTime()>date2Temp.getTime())
    return 1;
  else
    return -1;
}


/**********************************************/
/************* Loading Bar  *******************/
/**********************************************/
/** deleteNode when page load*/
if (window.attachEvent) {   
   window.attachEvent("onload", delLoadingNode);   
} else if (window.addEventListener) {   
   window.addEventListener("load", delLoadingNode, false);    
}
/** deleteNode */
function  delLoadingNode(){   
  var nodeId = "loading";
  try{   
	  var div =document.getElementById(nodeId);  
	  if(div !==null){
		  document.body.removeChild(div);
		  div=null;    
 	  }  
  } catch(e){   
  	alert("delete node "+nodeId+" error");
  }   
}


// changestyle.js


function ExChgClsName(Btn,Obj){
	var obj=document.getElementById(Obj);
		obj.style.display =obj.style.display == "none" ? "" : "none";
if(obj.style.display==""){
		Btn.className='default';
   }else{
   Btn.className='down'
}		
}

function addLoadEvent(func) {
			var oldonload = window.onload;
			
			if (typeof window.onload != "function") {
				window.onload = func;
			} else {
				window.onload = function () {
					oldonload();
					func();
				}
			}
		}
		
		/*------------------------------------+
		 | Functions to run when window loads |
		 +------------------------------------*/
		addLoadEvent(function () {
			initChecklist();
			diffent();
		});
		
		/*----------------------------------------------------------+
		 | initChecklist: Add :hover functionality on labels for IE |
		 +----------------------------------------------------------*/
		function initChecklist() {
			if (document.all && document.getElementById) {
				// Get all unordered lists
				var lists = document.getElementsByTagName("input");
				
				for (i = 0; i < lists.length; i++) {
					var theList = lists[i];
					
					// Only work with those having the class "checklist"
					if (theList.className.indexOf("upload") > -1 ) {

							theList.onmouseover = function() { this.className="upload_over"; };
							theList.onmouseout = function() { this.className="upload"; };

					}
					if (theList.className.indexOf("download") > -1 ) {

							theList.onmouseover = function() { this.className="download_over"; };
							theList.onmouseout = function() { this.className="download"; };

					}
					if (theList.className.indexOf("btn_refresh") > -1 ) {

							theList.onmouseover = function() { this.className="btn_refresh_over"; };
							theList.onmouseout = function() { this.className="btn_refresh"; };

					}
					if (theList.className.indexOf("btn_zoom") > -1 ) {

							theList.onmouseover = function() { this.className="btn_zoom_over"; };
							theList.onmouseout = function() { this.className="btn_zoom"; };

					}
					if (theList.className.indexOf("btn_print") > -1 ) {

							theList.onmouseover = function() { this.className="btn_print_over"; };
							theList.onmouseout = function() { this.className="btn_print"; };

					}
					if (theList.className.indexOf("button_ty") > -1 ) {

							theList.onmouseover = function() { this.className="button_ty_over"; };
							theList.onmouseout = function() { this.className="button_ty"; };

					}
				}
			}
		}
		
function diffent(){
			var Ps = document.getElementsByTagName("p");
			for (i = 0; i < Ps.length; i++) {
			var theP = Ps[i];
            if (theP.className.indexOf("bd_out") > -1 ) {
							theP.onmouseover = function() { this.className="bd_over"; };
							theP.onmouseout = function() { this.className="bd_out"; };
					}
}
}

function checkedCheckBox(values,TreeLength,vGroupTree,userOrGroup){
  var value = new Array();
  value = values.split(",");
  for(var i=0;i<value.length;i++){//页面输入域的值 
    var checkValue = value[i];
	for(j=0;j<TreeLength;j++){//列表显示的值
	  if(userOrGroup == "user"){
		if(trim(checkValue) == trim(vGroupTree.data[j].userCode)){
		  fm.treeCheckBox[j+1].checked=true;
		}
	  }else{
		var id = vGroupTree.data[j].id;
		if(checkValue == vGroupTree.data[j].id){
		  fm.treeCheckBox[j+1].checked=true;
		}
	  }
	}
  }
}	





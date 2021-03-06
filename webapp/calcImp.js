/*  ----------------------------------------------------- begin */
// 文件名：calcImp.js
var FULL_YEAR_DAYS_IN_FUND = 365; //基金行业的1年默认年化收益天数为365天
var rate1,days1;
var fundNum = 0; //理财产品 序号；

// window.onload = addFund();
~function (){
	addFund();
	changeNotice();
	//注册句柄事件
	document.getElementById('confirmTime').onchange = changeNotice;

	var comfirmWayRadio = document.getElementsByName('comfirmWay');
	for(var k = 0; k < comfirmWayRadio.length ; k++ ){
		comfirmWayRadio[k].onclick = writeFrontMoneyDate;
	}
	var leaveWayRadio = document.getElementsByName('leaveWay');
	for(var k = 0; k < leaveWayRadio.length ; k++ ){
		leaveWayRadio[k].onclick = writeFrontMoneyDate;
	}
	
	document.getElementById('inTime').onchange = writeFrontMoneyDate;
	document.getElementById('outTime').onchange = writeFrontMoneyDate;
	document.getElementById('leaveTimeNormal').onchange = writeFrontMoneyDate;

}();


//增加理财产品
function addFund(){
	// console.log(document.getElementById('fm1'));
	fundNum++;
	var newNode = document.createElement('div');
	var calMoneyDays = document.getElementById('calMoneyDays').value ;
	calMoneyDays = calMoneyDays ? calMoneyDays : ''; //判空
	var tempHTML = 
	'<label>产品:1</label>投入资金<input id = "moneyIn:1" name = "moneyIn:1"  class = "middle" type="text"/>'+
	'利率(如0.03 年化利率3%)<input id = "rate:1" name = "rate:1" class = "short" type="text"/>'+
	'持有天数<input id = "days:1" name = "days:1" type="text" class = "short" value ="'+ calMoneyDays +'" />'+
	'<label>按日复利计算</label><input id = "isCalcDayByDay:1" type = "checkbox" />'+
	'每月定投时间: <input class = "middle" id="perMonInTime:1" name="perMonInTime:1" '+
	' onclick="WdatePicker({dateFmt:\'dd:HH:mm:ss\'});" type="text"/> '+
	'每月定投金额：<input id="perMonInMoney:1" name="perMonInMoney:1" class = "middle" type="text"/> '+
	'</div><input value = \'delete\' type = "button" onclick = "deleteRow(this)" />'
	
	newNode.innerHTML = tempHTML.replace(/:1/g,fundNum); //将:1替换为真正数字；
	// fm1.appendChild(newNode);  //在表单内部的结尾，增加一个子节点
	fm1.insertBefore(newNode,document.getElementById('calcButton'));  //在表单内部的结尾，增加一个子节点
	
}

function changeNotice () {	
	var cfTxtTime = document.getElementById('confirmTime').value;
	document.getElementById('noticeText').innerText = '基金行业工作天一至五'+ cfTxtTime + 
	'前转入确认当天份额，'+ cfTxtTime +'点后转入确认T+1天份额。周五'+ cfTxtTime +'后~下周一'
	+ cfTxtTime +' 前，确认周一的份额;';

	writeFrontMoneyDate();
	}


/* 计算收益函数 */
function calc() {
	var revenue = Number(0);
	var showResult = document.getElementById("resultDiv").getElementsByTagName('p')[0];

	var stringResult ='';
// 	showResult.innerHTML = null;
// 	var stringResult  = showResult.innerHTML;
	var brString = '\r\n';
	brString = '</br>';
	for(var i=1; i<=fundNum; i++){
		if(!document.getElementById('moneyIn'+i)){ continue;}  //不存在，则跳出本次循环；
		var moneyIn = Number(document.getElementById('moneyIn'+i).value); //本金
		var rate = Number(document.getElementById('rate'+i).value); // 0.03 年化利率3%
		var days = Number(document.getElementById('days'+i).value);
		var isCalcDayByDay =document.getElementById('isCalcDayByDay'+i).checked; //是否按日计算复利

		var perMonInTime = 	document.getElementById('perMonInTime'+i).value; 	//每月定投时间;
		var perMonInMoney =  document.getElementById('perMonInMoney'+i).value; 	 //每月定投金额
		if(perMonInMoney){perMonInMoney = Number(perMonInMoney);}
		
		if(isCalcDayByDay){  //复利计算逻辑
			stringResult +='产品'+i+'&nbsp;&nbsp;，按日复利，收益后本+息:';
			var lastMoneyIn = moneyIn; //上期本金
			var fundRevenue = 0; //累计利息
			var calMoneyDateMap = calperMonInCalMoneyDays(perMonInTime); //获取每月定投的起始日期Map

			while(days>0){
			    var fundRevenue1Day
			    if(calMoneyDateMap.has(days)){
			    	moneyIn += perMonInMoney; //记录累计投入本金
			    	lastMoneyIn = lastMoneyIn + perMonInMoney; //记录基金的累计份额
			    	}
			    fundRevenue1Day = lastMoneyIn*rate/FULL_YEAR_DAYS_IN_FUND  //每天利息
				lastMoneyIn = lastMoneyIn + fundRevenue1Day;
				fundRevenue += fundRevenue1Day; //计算累计利息
				days--;
			}
		}else{ //单利计算逻辑
			stringResult +='产品'+i+'&nbsp;&nbsp;，收益后本+息:';
			//  列出公式
			stringResult += moneyIn+'+'+moneyIn+"*"+rate+'/'+FULL_YEAR_DAYS_IN_FUND+'*'+days+'='; 
			var fundRevenue = moneyIn*rate/FULL_YEAR_DAYS_IN_FUND*days;  //利息收入
		}
        fundRevenue = Number(fundRevenue.toFixed(2)); //四舍五入，保留2位小数
        stringResult +='  '+ (moneyIn+fundRevenue)+ ' ,其中，本金为:'+moneyIn+'  ,'+'利息为： '+fundRevenue ;
        stringResult +=brString;
	    
	    // https://segmentfault.com/a/1190000000324193 网友提供的修复浮点型计算差异问题方案
// 	    revenue = revenue.add(fundRevenue);  
		revenue +=  fundRevenue;
	}

	//解决浮点数相加不准确问题  参考  http://www.iteye.com/problems/71491
	revenue = revenue.toFixed(2);  
	//输出总收益
	stringResult +='总收益：            '+revenue;
	showResult.innerHTML = stringResult; //只能识别html代码 作换行符、空格；
// 	showResult.innerText = stringResult;  //能识别换行符，多个空格会缩成一个字符
// 	showResult.textContent = stringResult;  // 换行符、br都不能识别，多个空格会缩成一个字符；
	console.log(stringResult);
}

/* 删除行数 */
function deleteRow(dom){
	console.log(dom);
	var divdom = dom.parentNode; //div
	fm1.removeChild(divdom);
}


	/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
};

/* 将收益开始结束日期\计算收益总天数 写到前端；
*/
function writeFrontMoneyDate(){
	document.getElementById('calMoneyDateSt').value = calcInDateTime();
	document.getElementById('calMoneyDateEnd').value = calcOutDateTime();
	var calMoneyDateSt =  document.getElementById('calMoneyDateSt').value;
	var calMoneyDateEnd =  document.getElementById('calMoneyDateEnd').value;
	//计算收益总天数
	if(calMoneyDateSt && calMoneyDateEnd){
		document.getElementById('calMoneyDays').value = dateDiff(new Date(calMoneyDateSt), new Date(calMoneyDateEnd), 'D');
	}
}

// var weekDayNum = [0,1,2,3,4,5,6]; // 6，0分别指周六、周日
// var workdayNum = [1,2,3,4,5] ;// 6，0分别指周六、周日
var weekendDayNum = [0,6]; //周末
// var nomalTPlus0DayNum = [1,2,3,4]; // 一般计算逻辑 1、2、3、4 周1~周4; 

/* 计算转入时间的实际计算收益的第一天
*/
function calcInDateTime(){
	console.log("enter calcInDateTime()");
	
	var intime = document.getElementById('inTime').value;
	if(intime){
		intime = new Date(intime);
	}
	//测试代码 -begin
	if(arguments.length>0){intime =new Date( arguments[0]); }
	//判断是否为空
	if(!intime){return '';}

	//测试代码 -end
	var calMoneyDate = null;      //确认份额日期
	var comfirmType = getRadioBoxValue('comfirmWay');  //确认份额的计算类型； 
	/*   T+1 计算收益起始日逻辑 1、15点前 当前工作日确认份额，下一个工作日获得收益；
			 2、15点后 T+1个工作日确认份额，T+2个工作日获得收益；
			 3、周末转入，（最近的工作日N）周1确认份额，（N日+1工作日）周2获得收益 (与逻辑1 可以归纳为同一个情况)

		 T+0 计算收益起始日逻辑 
		     1、15点前 当前工作日T确认份额，T工作日获得收益；
			 2、15点后 T+1工作日确认份额， T+1工作日获得收益；
			 3、周末转入，（最近的工作日N）周1确认份额+获得收益 (与逻辑1 可以归纳为同一个情况)

			  */
// 	switch()  // 判断是什么计算方式
	
			
	calMoneyDate = new Date(intime.toDateString());
	//确认份额日期截止时间 ；
	var time = document.getElementById('confirmTime').value.split(':');
	var confirmTime = new Date(intime).setHours(time[0],time[1],time[2]); //返回毫秒数

	if(comfirmType == 'T+1'){
		//t+1 方式
		if(intime.getTime() < confirmTime || containsInArray(weekendDayNum , calMoneyDate.getDay())){ 
			//15点之前 or //是否weekend
			calMoneyDate = postponeToNextWorkDay(calMoneyDate);
		} else{ //15点之后
			calMoneyDate = postponeToNextWorkDay(calMoneyDate);
			calMoneyDate = postponeToNextWorkDay(calMoneyDate);
			 } 		
	} else if(comfirmType == 'T+0'){
		//t+0 方式
		if(intime.getTime() < confirmTime || containsInArray(weekendDayNum , calMoneyDate.getDay())){ 
			//15点之前 or //是否weekend
			calMoneyDate = postponeFromWeekendToWorkDay(calMoneyDate);
		} else{ //15点之后
			calMoneyDate = postponeToNextWorkDay(calMoneyDate);
		} 	
	}


// 	console.log("intime");
// 	console.log(intime);
// 	console.log(calMoneyDate);
// 	console.log("leave calcInDateTime()");
	return calMoneyDate;
// 	intime.setHours(15,0,0,0); //计算  比较是15点前还是后；
}

/*
计算转出时间截止实际收益的那一天
*/
function calcOutDateTime(){
	console.log("enter calcOutDateTime()");
	

	var outtime = document.getElementById('outTime').value;
	if(outtime){
		outtime = new Date(outtime);
	}
	//测试代码 -begin
	if(arguments.length>0){outtime =new Date( arguments[0]); }

	//判断是否为空
	if(!outtime){return '';}

	//测试代码 -end
	var calMoneyDate = null;      //收益截止日
	var leaveType = getRadioBoxValue('leaveWay');  //确认份额的计算类型； 
	/*   R+0 快速取出(资金当天到账) 取出资金部分当天没有收益；
		R+1  百度定活盈/普通取出，资金下一个工作天到账。收益截止到下一个工作天的前一天；
		R+2  百度活期盈，收益截止到当前转出时间对应资金确认工作日的昨天；
		(etc.转出时间 周四15:00~周四14:59 资金到账日 下周一 收益截止 周四；转出时间 周五15:00-下周一 14:59 资金到账日 下周二 收益截止 周日 )
			  */
			
	calMoneyDate = new Date(outtime.toDateString());
	// 转出资金时间截止时间 ；
	var time = document.getElementById('leaveTimeNormal').value.split(':');
	var confirmTime = new Date(outtime).setHours(time[0],time[1],time[2]); //返回毫秒数

	switch(leaveType){  // 判断是什么计算方式
		case 'R+0' : calMoneyDate.setDate(calMoneyDate.getDate()-1); 
					 break;
		case 'R+1' : 		
			if(outtime.getTime() < confirmTime || containsInArray(weekendDayNum , calMoneyDate.getDay())){ 
				//15点之前 or //是否weekend
				calMoneyDate = postponeToNextWorkDay(calMoneyDate);
			} else{ //15点之后
				calMoneyDate = postponeToNextWorkDay(calMoneyDate);
				calMoneyDate = postponeToNextWorkDay(calMoneyDate);
				 }
				calMoneyDate.setDate(calMoneyDate.getDate()-1);
					 break;
		case 'R+2' : 
		//前半部分 与t+0 确认份额 方式 类似
		if(outtime.getTime() < confirmTime || containsInArray(weekendDayNum , calMoneyDate.getDay())){ 
			//15点之前 or //是否weekend
			calMoneyDate = postponeFromWeekendToWorkDay(calMoneyDate);
		} else{ //15点之后
			calMoneyDate = postponeToNextWorkDay(calMoneyDate);
		} 
		calMoneyDate.setDate(calMoneyDate.getDate()-1);
		break;	
 	}
	
// 	console.log("outtime");
// 	console.log(outtime);
// 	console.log(calMoneyDate);
// 	console.log("leave calcInDateTime()");
	return calMoneyDate;
// 	intime.setHours(15,0,0,0); //计算  比较是15点前还是后；
}

/**
根据定投日期,1、先计算每月定投日期，2、再计算每月投入后实际收益起始日
参数 perMonInTime 定投日期；
*/
function calperMonInCalMoneyDays(perMonInTime){
	//判空
	var perMonInDateMap  = new Map();
	if(!perMonInTime){return perMonInDateMap;}

	//转出距离投入的天数;
	var outDistanceIn ;
	
	var inTime =  document.getElementById('inTime').value;
	var outTime =  document.getElementById('outTime').value;
	//计算收益总天数
	if(inTime && outTime){
		inTime = new Date(inTime);
		outTime =  new Date(outTime);
		outDistanceIn = dateDiff( inTime, outTime, 'D');
	} else{
		return perMonInDateMap;
	}

	perMonInTime = perMonInTime.split(':');

	//收益截止距离收益起始的天数，即是收益天数
	var calMoneyDays = document.getElementById('calMoneyDays');
	
	for(var k=0;  ; k++ ){
			//每月定投日期
		var perMonInDate = new Date(inTime);
		var tempdate  =Number(perMonInTime[0]);	// (1~31)	 
		var tempHour  =perMonInTime[1]; // (0~23)
		var tempMin  =perMonInTime[2]; // (0~59)
		var tempSec  =perMonInTime[3];// (0~59)
		var tempMilliSec = 0; // (0~999)

		//取得k个月份之后的那个月的最后一天。
		var inTimeStandard = new Date(inTime.getFullYear(),inTime.getMonth() + k +1,0);
		//k个月份之后的那个月的日期不存在 29 、30、31 的情况。
		if(tempdate > inTimeStandard.getDate() ){
			perMonInDate = new Date(inTimeStandard.setDate(inTimeStandard.getDate() +1 ));
			perMonInDate.setHours( tempHour, tempMin, tempSec, tempMilliSec );
		} else {

			//每月都存在这天 
			perMonInDate.setMonth(perMonInDate.getMonth() + k, tempdate); 
			perMonInDate.setHours( tempHour, tempMin, tempSec, tempMilliSec );
		}
		//判断首次定投是否在 投入时间之前;
		if( k == 0 && inTime.getTime() - perMonInDate.getTime() >=0 ){ continue;}

		//判断最后一次定投是否在 转出时间之后;
		if( perMonInDate.getTime()- outTime.getTime()>0 ) {break;}

		perMonInDateMap.set(k, perMonInDate);
	}

	console.log('perMonInDateMap');
	console.log(perMonInDateMap);

	var resultMap = new Map();

// 	return perMonInDateMap;
	perMonInDateMap.forEach(function (value, key, map){  
	//收益截止日期
	var calMoneyDateEnd =  new Date(document.getElementById('calMoneyDateEnd').value);
	//每月定投日期对应收益起始日期；
	var calMoneyDatePMSt =  calcInDateTime(value);
		resultMap.set(dateDiff(calMoneyDatePMSt , calMoneyDateEnd, 'D') ,  calMoneyDatePMSt );  
		}
	)

	console.log('resultMap');
	console.log(resultMap);
	
	return resultMap;
	
}


/**
 找到下一个工作日
*/
function postponeToNextWorkDay(cdate){
	var ncdate = cdate;
	ncdate = postponeFromWeekendToWorkDay(ncdate); //判断是否weekend ，是则推到第一个工作天
	ncdate.setDate(ncdate.getDate()+1); //找到nextday
	ncdate = postponeFromWeekendToWorkDay(ncdate); //再判断是否weekend ，是则推到第一个工作天
	return ncdate;
}
/**

 非工作日的，找到下一个工作日(周1)
 判断是否周六日，否则，累加到下一个工作日(周1)
 cdate ---calcdate
*/
function postponeFromWeekendToWorkDay(cdate) {
// 	for(var i = 0; i<weekendDayNum.length; i++){
// 		if(cdate.getDay() == weekendDayNum[i]){
// 			cdate.setDate(cdate.getDate()+1);
// 			postponeFromWeekendToWorkDay(cdate);  // 递归 判读；
// 		}
// 	}
	//判断是否周六日，否则，累加到工作日
	if(containsInArray(weekendDayNum , cdate.getDay())){  
			cdate.setDate(cdate.getDate()+1);
			postponeFromWeekendToWorkDay(cdate);  // 递归 ；
	} 
	
	return cdate;
}

//获取 checkbox
function   getRadioBoxValue(radioName) 
{ 
            var obj = document.getElementsByName(radioName);  //这个是以标签的name来取控件
                 for( var i=0; i<obj.length;i++)    {

                  if(obj[i].checked)    { 
                          return   obj[i].value; 
                  } 
              }         
             return "undefined";       
}

/**
	判断简单类型 obj 是否存在于数组 Array；
**/
function containsInArray(array , obj){
	var i = array.length;
	while(i--){
		if(array[i] == obj){
			return true;
		}
	}
	return false;
}	



/*

//测试数据 时间
var timeArray = [
'2017-06-19 14:38:27',
'2017-06-20 14:38:27',
'2017-06-21 14:38:27',
'2017-06-22 14:38:27',
'2017-06-23 14:38:27',
'2017-06-24 14:38:27',
'2017-06-25 14:38:27',

'2017-06-19 15:38:27',
'2017-06-20 15:38:27',
'2017-06-21 15:38:27',
'2017-06-22 15:38:27',
'2017-06-23 15:38:27',
'2017-06-24 15:38:27',
'2017-06-25 15:38:27' ];

// console.log(timeArray);
//轮询 验证 是否正确；
for (var i = 0; i < timeArray.length ;i++){
    console.log(i);
//     console.log(timeArray[i]);
    var str = timeArray[i];
    calcOutDateTime(str);
}



//测试数据 时间
var intimeArray = [
'2017-06-19 14:38:27',
'2017-06-20 14:38:27',
'2017-06-21 14:38:27',
'2017-06-22 14:38:27',
'2017-06-23 14:38:27',
'2017-06-24 14:38:27',
'2017-06-25 14:38:27',

'2017-06-19 15:38:27',
'2017-06-20 15:38:27',
'2017-06-21 15:38:27',
'2017-06-22 15:38:27',
'2017-06-23 15:38:27',
'2017-06-24 15:38:27',
'2017-06-25 15:38:27' ];

// console.log(intimeArray);
//轮询 验证 是否正确；
for (var i = 0; i < intimeArray.length ;i++){
    console.log(i);
//     console.log(intimeArray[i]);
    var str = intimeArray[i];
    calcDateTime(str);
}

console.log('end');

switch('a'){
    case 'a':console.log('a');
    case 'b':console.log('b');
    default :console.log('default');
}


switch(1){
    case 1:console.log('a');
    case 2:console.log('b');
    default :console.log('default');
}
*/
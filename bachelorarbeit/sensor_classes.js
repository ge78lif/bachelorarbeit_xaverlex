
let sensors = new Set();
let template;
let numberOfGroups = 1;
let once = true;
let sensorsInLastGroup = [];
let arrowIsHidden = true;
let groupArrowIsHidden = false;



if(once){
   setTimeout(sensor_classes, 1000); //have to wait for the php connection
   once = false;
}

function sensor_classes() {
   createGroupBar("group1");
   sensors = getAllSensorNames();   
   sensors.forEach((sensor) => createSensorDiv(sensor));
   ready = true;
}

function createGroupBar(groupNumber) {
   template = document.getElementById("group_bar");
   document.getElementById(groupNumber).appendChild(template.content.cloneNode(true));

   document.getElementById("groupX_bar").id = groupNumber + "_bar";
   document.getElementById("groupX_checkbox").id = groupNumber + "_checkbox";
   document.getElementById("groupX_name").value = groupNumber;
   document.getElementById("groupX_name").id = groupNumber + "_name";   
   document.getElementById("groupX_arrow").id = groupNumber + "_arrow";

} 

function createSensorDiv(sensor) {
   if(sensor == "id"){
      return;
   }
   //creating the sensor selecting labels with the corresponding ids using the template ('sensors_template')
   template = document.getElementById('sensors_template');
   document.getElementById("group1").appendChild(template.content.cloneNode(true));
 
   document.getElementById('sensor_div').id = sensor + "_div";
   document.getElementById('sensor_check').id = sensor + "_check";
   document.getElementById('sensor_label').id = sensor + "_label";
   document.getElementById('sensor_minmaxcur').id= sensor + "_minmaxcur";
   document.getElementById(sensor + "_div").dataset.groupNumber = 1;
   document.getElementById(sensor + "_label").innerHTML = sensor + ": ";
   
   //adding EventListener for the selector
      //document.getElementById(sensor + '_select').addEventListener("change", sortSensorsToGroups, false);
}

function updateMinAndMaxInLabel(sensor, min, max, cur){   
   document.getElementById(sensor + "_label").innerHTML = sensor.bold();
   document.getElementById(sensor + "_minmaxcur").innerHTML = " (" + "Min: " +  min + " Max: " + max +  " Cur: " + cur + ")";
}

function clickingPlusButton() {
   numberOfGroups += 1;
   
   var div = document.createElement("div");
   div.id = "group" + numberOfGroups;
   div.className = "group";
   document.getElementById("sensor_classes").appendChild(div);
   createGroupBar("group" + numberOfGroups);
}

function clickingMinusButton() {
   if(numberOfGroups==1)
   {
      return;
   }

   const toDelete = document.getElementById("group" + numberOfGroups);
   sensorsInLastGroup = Array.from(toDelete.querySelectorAll('.sensor_div'))
   sensorsInLastGroup.forEach((sen) => putToLowerGroup(sen));

   document.getElementById("sensor_classes").removeChild(toDelete);
   
   numberOfGroups -= 1;
   
}

function putToLowerGroup(sen) {
   const groupTo = document.getElementById("group" + (numberOfGroups-1));
   groupTo.appendChild(sen);
   sen.dataset.groupNumber -= 1;
}


//könnte gelöscht werden ab hier: 
function addingSelectGroupToOptions(sensor) {
   if(sensor =="id"){
      return;
   }

   var sel = document.getElementById(sensor + "_select");
   var option = document.createElement("option");
   option.text = numberOfGroups;
   option.value = numberOfGroups;
   sel.add(option);
   
}

function sortSensorsToGroups(){
   var sensorDivs = Array.from(document.getElementsByClassName("sensor_div"));


   for(var i = 0; i < sensorDivs.length; i++){
      const group = sensorDivs[i].querySelector('.sensor_select').value;
      const groupDiv = document.getElementById("group" + group);
      groupDiv.appendChild(sensorDivs[i]);      
   }
}

//functions for the arrow to show the min max time range options
function showOptionsBox() {
   if(arrowIsHidden){
   document.getElementById('minmaxoptionsBox').style.display = 'block';
   document.getElementById('optionsArrow').innerHTML = "◀";
   arrowIsHidden= false;
   } else {
      hideOptionsBox();
      arrowIsHidden = true;
   }
 }

 function hideOptionsBox() {   
   document.getElementById('minmaxoptionsBox').style.display = 'none';
   document.getElementById('optionsArrow').innerHTML = "▼";
 }

 //functions for hovering the sensor labels

 function hoverSensorLabel(sensorLabel) {
   sensorLabel.style.backgroundColor = "grey";
   sensorLabel.dataset.hovered = "true";
 }

 function leaveSensorLabel(sensorLabel) {
   sensorLabel.style.backgroundColor = "white";
   sensorLabel.dataset.hovered = "false";
 }

 //functions for hovering the class bars

 function hoverClassBar(classBar) {
   classBar.style.backgroundColor = "grey";
   let nmber = classBar.id.charAt(5);
   let allsns = document.querySelectorAll(".sensor_div");
   for(let i = 0; i<allsns.length; i++){
      if(allsns[i].dataset.groupNumber == nmber){
         hoverSensorLabel(allsns[i]);
      }
   }   
 }

 function leaveClassBar(classBar) {
   classBar.style.backgroundColor = "#CCCDCC";
   let nmber = classBar.id.charAt(5);
   let allsns = document.querySelectorAll(".sensor_div");
   for(let i = 0; i<allsns.length; i++){
      if(allsns[i].dataset.groupNumber == nmber){
         leaveSensorLabel(allsns[i]);
      }
   }   
 }

 //functions for the group bars
 function clickingGroupCheckbox(chck){
   if(chck.checked == true){
      let hideGroup = chck.closest(".group");
      let checkboxesToCheck = hideGroup.querySelectorAll(".sensor_checkbox");      
      for(let i= 0; i<checkboxesToCheck.length; i++){
        checkboxesToCheck[i].checked = true;
      }
   }else {
      let hideGroup = chck.closest(".group");
      let checkboxesToCheck = hideGroup.querySelectorAll(".sensor_checkbox");      
      for(let i= 0; i<checkboxesToCheck.length; i++){
        checkboxesToCheck[i].checked = false;
      }
   }
 }

 function clickingGroupArrow(arr) {
   if(groupArrowIsHidden){
      whenArrowIsHidden(arr);
   }else{
      arr.innerHTML = "◀";
      let hideGroup = arr.closest(".group");
      let sensorsToHide = hideGroup.querySelectorAll(".sensor_div");
      for(let i= 0; i<sensorsToHide.length; i++){
         sensorsToHide[i].style.display='none';
      }
      groupArrowIsHidden = true;
   }
 }

 function whenArrowIsHidden(arr) {
   arr.innerHTML = "▼";
   let hideGroup = arr.closest(".group");
   let sensorsToHide = hideGroup.querySelectorAll(".sensor_div");
   for(let i= 0; i<sensorsToHide.length; i++){
      sensorsToHide[i].style.display='flex';
   }
   groupArrowIsHidden = false;
 }

 //functions for the menubar
 function switchMenu(toSwitch){
   document.getElementById("sensor_section").style.display = 'none';
   document.getElementById("timebar_section").style.display = 'none';

   document.getElementById("sensor_section_menubar").classList.remove('active');
   document.getElementById("timebar_section_menubar").classList.remove('active');

   document.getElementById(toSwitch).style.display = 'block';

   document.getElementById(toSwitch + "_menubar").classList.add('active');
 }
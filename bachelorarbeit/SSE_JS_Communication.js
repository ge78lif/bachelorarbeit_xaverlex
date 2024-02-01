//document.getElementById("data").innerHTML = getAllStorageItems(0, 3).toString();
let newObject;
let receivedData = [];
let time = 0;
let sensor_names = new Set();
let sensorTemp = [];
let ready = false;
//setting up the SSE connection
let source = new EventSource("SSE_PHP_Communication.php");
source.onmessage = function (event) {
    //saving the received data in the array; array[x][0] = "id"
        newObject=JSON.parse(event.data);
        receivedData.push(newObject);
        sensor_names = Object.keys(newObject);
        //document.getElementById("data").innerHTML = JSON.stringify(sensor_names);
        //document.getElementById("data").innerHTML += JSON.stringify(receivedData[receivedData.length-1]["temperature [C]"]);
        updateMinMaxCur();
        updateTimeline();
    };


//functions for the received data
function getReceivedItem(index) {
    return receivedData[index];
}

function getReceivedItemsFromTo (from, to) {
    return receivedData.slice(from, to +1);
}

function getAllReceivedItems () {
    return receivedData;
}

function getNumberOfReceivedData() {
    return receivedData.length;
}

function getAllSensorNames() {
    return sensor_names;
}

//updating timeline
function updateTimeline() {
    time = receivedData.length;    
    document.getElementById("endSlider").max = time-1;
    document.getElementById("startSlider").max = time-1;
    document.getElementById("startInput").max = time-1;
    document.getElementById("endInput").max = time-1;
    
    if(live==true){
       startSlider.value = parseInt(startSlider.value, 10) + 1;
       endSlider.value = parseInt(endSlider.value, 10) + 1;
    }
    controlStartSlider(startSlider, startInput, endSlider);
    controlEndSlider(startSlider, endInput, endSlider, true);
}

//updating minimum, maximum, current

function updateMinMaxCur() {
    if(!(ready==true)) {
        return;
    }
     //getting all sensors
     sensorList = getAllSensorNames();    

     //update for all sensors
     sensorList.forEach((sens) => {
       
            if(sens == "id"){
                return;
            }

            const [min, max] = getMinMax(sens);
            const cur = receivedData[receivedData.length -1][sens];
        
            updateMinAndMaxInLabel(sens, min, max, cur);            
        

       
     });
}

function getMinMax(sens) {
    if(document.getElementById("currentTimeRange").checked==true){
        const start = parseInt(document.getElementById("startSlider").value, 10);
        const end = parseInt(document.getElementById("endSlider").value,10);
        sensorTemp = [];

        for(var i = 0; i< (end-start); i++){
            sensorTemp[i] = receivedData[start+i][sens];
        }        
    }

    if(document.getElementById("completeTimeRange").checked==true){
        for (var i = 0; i < receivedData.length; i++) {
           sensorTemp[i] = receivedData[i][sens];
        }
    }

    //getting max, min
    const max = Math.max(...sensorTemp);
    const min = Math.min(...sensorTemp);
    return [min, max];
}
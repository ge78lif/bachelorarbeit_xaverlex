// Initializing x and y values
var x = new Array();
var temp = new Array();
var received = new Array();
var max = 180;
var min = -50;
var len = 0;
var timebarStart = 0;
var timebarEnd = 0;


const COLOR_BLACK = 600;
const COLOR_DARKGREY = 610;
const COLOR_GREY = 630;
const COLOR_BLACKPURPLE = 650;


var temp2 = new Array();
var sensorList = new Set();
var selectedGroup;

GR.ready(function() {
    var gr = new GR('example-canvas');

    function onFrame() {
        //update data
        received = getAllReceivedItems();
        
        // Update x 
        len = x.length;
       

        //debugging
            //document.getElementById("data").innerHTML = JSON.stringify(temp) + max + min;

        // Draw new frame
        gr.clearws();
        gr.setviewport(0.1, 0.95, 0.1, 0.95);
        

        
        
        //update time from the time bar
        [timebarStart, timebarEnd] = getStartEnd();
        
        //getting a running graph
         if(len <= 2){
            /*
            gr.grid(1, 10, 0, 0, 2, 2); //grid
            gr.setwindow(0, 20, 0-10, 100 + 10);
            gr.axes(1, 10, 0, 0 - 10, 5, 0, 0.005);
            gr.axes(1, 20, 20, 100 + 10, -2, -2, -0.005);
            */
        }else {
            
            gr.grid(Math.ceil((timebarEnd-timebarStart+1)/22), 10, 0, 0, 2, 2); //grid
            gr.setwindow(x[timebarStart], x[timebarEnd], 0 - 5, 100 + 10);
            gr.axes(Math.ceil((timebarEnd-timebarStart+1)/22), 10, x[timebarStart], 0 - 5, 5, 0, 0.005);
            gr.axes(Math.ceil((timebarEnd-timebarStart+1)/22), 10, x[timebarEnd], 100 + 10, -2, -2, -0.005);            
        }
        
        //getting all sensors
        sensorList = getAllSensorNames();
        
        //color of the polyline
        gr.setlinecolorind(COLOR_DARKGREY);
        
        //building the graphs for all sensors
        sensorList.forEach((sens) => createGraph(sens));
       
        function createGraph(sens){

            if(sens != "id" && document.getElementById(sens + "_check") != null && document.getElementById(sens + "_check").checked==true){
                for (var i = 0; i < received.length; i++) {
                    x[i] = i;
                    temp[i] = received[i][sens];
                    
                }
        
                //getting max, min
                [min, max] = getMinMax(sens);

                selectedGroup = document.getElementById(sens + "_div").dataset.groupNumber;

                
    
                for(let i=0; i<temp.length; i++){
                    temp2[i]=((temp[i]-min)*105)/(max-min);
                    temp2[i]= temp2[i]/numberOfGroups +(110*(numberOfGroups-selectedGroup)/numberOfGroups);
                }
                
                //setting polyline-style if hovered
                if(document.getElementById(sens + "_div").dataset.hovered == "true"){
                    gr.setlinecolorind(COLOR_BLACKPURPLE);
                    gr.setlinetype(2);
                    
                }
                

                //document.getElementById("data").innerHTML = JSON.stringify(temp2) + max + min;
                gr.polyline(len, x, temp2);

                //resetting polyline-style
                gr.setlinecolorind(COLOR_DARKGREY)
                gr.setlinetype(1);
                
            }
        }

       
        //descriptions
        //gr.textext(0.37, 0.97, "Title");
        gr.textext(0.5, 0.01, "[s]");
        gr.textext(0.01, 0.525, "");
        
        

        // Request to be called for the next frame
        window.requestAnimationFrame(onFrame);
    };
    window.requestAnimationFrame(onFrame);
});

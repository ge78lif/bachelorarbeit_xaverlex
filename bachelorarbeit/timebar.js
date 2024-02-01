    let live = false;
    const sliderColor = "#CCCDCC";
    const rangeColor = "#4CB9FA";

    function controlStartInput(startSlider, startInput, endInput, controlSlider) {
        const [start, end] = getParsed(startInput, endInput);
        fillSlider(startInput, endInput, controlSlider);
        if (start >= end) {
            startSlider.value = end-1;
            startInput.value = end-1;
        } else {
            startSlider.value = start;
        }
    }

    function controlEndInput(endSlider, endInput, startInput, controlSlider) {
        const [start, end] = getParsed(startInput, endInput);
        fillSlider(startInput, endInput, controlSlider);
        setToggleAccessible(endInput);
        if (start < end) {
            endSlider.value = end;
            endInput.value = end;
        } else {
            endInput.value = start+1;
        }

        if(live && end != endSlider.max){
            clickingLiveButton();
        }
    }

    function controlStartSlider(startSlider, startInput, endSlider) {
        const [start, end] = getParsed(startSlider, endSlider);
        fillSlider(startSlider, endSlider, endSlider);
        if (start >= end) {
            startSlider.value = end-1;
            startInput.value = end-1;
        } else {
            startInput.value = start;
        }
    }

    function controlEndSlider(startSlider, endInput, endSlider, fromLive) {
        const [start, end] = getParsed(startSlider, endSlider);
        fillSlider(startSlider, endSlider, endSlider);
        setToggleAccessible(endSlider);
        if (start < end) {
            endSlider.value = end;
            endInput.value = end;
        } else {
            endInput.value = start+1;
            endSlider.value = start+1;
        }

        if(!fromLive && live && end != endSlider.max-1){
            clickingLiveButton();
        }
    }

    function getParsed(currentFrom, currentTo) {
        const from = parseInt(currentFrom.value, 10);
        const to = parseInt(currentTo.value, 10);
        return [from, to];
    }

    function fillSlider(start, end, controlSlider){
        const rangeDistance = end.max - end.min;
        const startPosition = start.value - end.min;
        const endPosition = end.value - end.min;
        controlSlider.style.background = `linear-gradient(
            to right,
            ${sliderColor} 0%,
            ${sliderColor} ${(startPosition)/(rangeDistance)*100}%,
            ${rangeColor} ${((startPosition)/(rangeDistance))*100}%,
            ${rangeColor} ${(endPosition)/(rangeDistance)*100}%, 
            ${sliderColor} ${(endPosition)/(rangeDistance)*100}%, 
            ${sliderColor} 100%)`;
    }

    function setToggleAccessible(currentTarget) {
        const endSlider = document.getElementById("endSlider");
        if(Number(currentTarget.value) <= 0) {
            endSlider.style.zIndex = 2;
        } else {
            endSlider.style.zIndex = 0;
        }
    }

    const startSlider = document.getElementById("startSlider");
    const endSlider = document.getElementById("endSlider");
    const startInput = document.getElementById("startInput");
    const endInput = document.getElementById("endInput");

    fillSlider(startSlider, endSlider, endSlider);
    setToggleAccessible(endSlider);
    

    startSlider.oninput = () => controlStartSlider(startSlider, startInput, endSlider);
    endSlider.oninput = () => controlEndSlider(startSlider, endInput, endSlider);
    startInput.oninput = () => controlStartInput(startSlider, startInput, endInput, endSlider);
    endInput.oninput = () => controlEndInput(endSlider, endInput, startInput, endSlider);

   

    function clickingLiveButton(){
        let liveButton = document.getElementById("liveButton");
        if(live){
            live = false;
            liveButton.style.backgroundColor = "White";
        }else {
            live = true;
            liveButton.style.backgroundColor = "#CCCDCC";
            endSlider.value = endSlider.max -1;
            controlEndSlider(startSlider, endInput, endSlider);
        }
    }

    function clickingSaveButton(){
        let tmp = document.getElementById('savedTimebarsTemplate');
        document.getElementById("saved_timelines").appendChild(tmp.content.cloneNode(true));

        tmpElement = document.getElementById("savedStartInput");
        tmpElement.max = endSlider.max;
        tmpElement.value = startInput.value;
        tmpElement.removeAttribute('id');

        tmpElement = document.getElementById("savedEndInput");
        tmpElement.max = endSlider.max;
        tmpElement.value = endInput.value;
        tmpElement.removeAttribute('id');
    }

    function clickingDeleteButton(del){
        let toDelete = del.closest('.savedTemplate');
        toDelete.style = null;
        document.getElementById("saved_timelines").removeChild(toDelete);
    }

    function useTemplate(toUse){
        let useStartInput = toUse.querySelector(".savedStartInput");
        startInput.value = useStartInput.value;
        controlStartInput(startSlider, startInput, endInput, endSlider);

        let useEndInput = toUse.querySelector(".savedEndInput");
        endInput.value = useEndInput.value;
        controlEndInput(endSlider, endInput, startInput, endSlider);
    }

    function getStartEnd(){
        return [startSlider.value, endSlider.value];
    }

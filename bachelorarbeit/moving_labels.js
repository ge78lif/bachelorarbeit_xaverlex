let listContainer;
let draggableItem;
let pointerStartY;
let items = [];
let lines = [];
let nearestGroup;

function setup() {
    listContainer = document.getElementById('sensor_classes');
     if(!listContainer){
        return;
     }

     listContainer.addEventListener('mousedown', dragStart);

     document.addEventListener('mouseup', sortToGroups);
     document.addEventListener('mouseup', dragEnd);
}

function dragStart(e){
    if(e.target.classList.contains('drag-handle')){
        draggableItem = e.target.closest('.sensor_div');
    }

    if(!draggableItem) return;

    pointerStartY = e.clientY;

    initDraggableItem();

    document.addEventListener('mousemove', drag)
}

function drag(e) {
    if(!draggableItem) return

    const currentPositionY = e.clientY;

    const pointerOffsetY = currentPositionY -  pointerStartY;

    draggableItem.style.top = pointerOffsetY + "px";

    
}

function sortToGroups(e) {
    if(!draggableItem) return;

    currentPositionY = e.clientY;

    lines = Array.from(listContainer.querySelectorAll('.bar'));
    if(!document.getElementById('group1').contains(draggableItem)){
        nearestGroup = document.getElementById('group1');
    }
    for(let i = 0; i< lines.length; i++){
        if(currentPositionY > lines[i].getBoundingClientRect().top){
            nearestGroup = lines[i].closest('.group');
            draggableItem.dataset.groupNumber = i+1;
        }
    }
    if(nearestGroup){
    nearestGroup.appendChild(draggableItem);
    }
    if(nearestGroup === document.getElementById('group1')){
        draggableItem.dataset.groupNumber = 1;
    }

}

function dragEnd(){
    if(!draggableItem) return;
    
    
    cleanup();
}

function initDraggableItem() {
    draggableItem.classList.remove('is-idle');
    draggableItem.classList.add('is-draggable');
}

function cleanup() {
    items = [];
    unsetDraggableItem();


    document.removeEventListener('mousemove', drag);
}

function unsetDraggableItem() {
    draggableItem.style = null;
    draggableItem.classList.remove('is-draggable');
    draggableItem.classList.add('is-idle');
    draggableItem = null;
}

function getAllItems() {
    if (!items?.length) {
        items = Array.from(listContainer.querySelectorAll('.sensor_div'));
      }
      return items;
}

setup();
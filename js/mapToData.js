/*
Goals and Notes (statuses):

    *************COMPLETE****************************************************************************
    *    - DEBUG the constant onclick handler. The a consecutive feature will be interfered with    *
    *    a previous feature, even with on and off flags I have set for them. Going to fix this      *
    *    by rewriting the functions that implement this.                                            *
    *************************************************************************************************
            -- DEBUG: CLICK and drag position of the node changes the nodes.
        *** Status:
                    -
    
    - IMPLEMENT a modal upon loading where ITS is asked for a form input. They will be asked
    what building they wish to work with and what floor they want to populate. This will then
    interact with jQuery/Javascript that will run on CASE or IF conditions where it will recognize
    what blueprint image to load. The building name and floor name will be fed as the names of the
    arrays that the information will be stored in.
         *** Status:
                    -
    
    - UPLOAD all of the blueprints to the images folder. Perhaps rename the images folder to 
    "Blueprints".
         *** Status:
                    -
    
    - DEVELOP function to extract from JSON or our SQL tables to automatically populate the blueprints
    we or ITS has already configured. THIS CAN BE DUPLICATED FOR THE USER MODE!
         *** Status:
                    -
    - Implement UNDO function that removes node or hall that was just made from the canvas and the JSON
        *** Status:
                    -
    
*/


var features = [];
var nodeID = 0;
var lineID = 0;
var pathGen = false;
var cPushArray = new Array();
var cStep = -1;


$( document ).ready(function() {
    $('#myCanvas').attr('height', $('#myCanvas').css('height'));
    $('#myCanvas').attr('width', $('#myCanvas').css('width'));
 
  getActiveCoordinates();
  
  activeFeature();
  
  handleCanvasClick();
  
  outputJSON();

});
//Function that constantly displays where the mouse is.
function getActiveCoordinates(){
     $('#myCanvas').mousemove( function(event) {
        window.current_x = Math.round(event.pageX - $('#myCanvas').offset().left);
        window.current_y = Math.round(event.pageY - $('#myCanvas').offset().top);
        window.current_coords = window.current_x + ', ' + window.current_y;
        $('#image_coords_now').html('Current: ' + window.current_coords + '.');
    }).mouseleave( function() {
         $('#image_coords_now').html('&nbsp;');
        });
}

/*Function determines what feature is currently being used for the creation of nodes
and lines [features]*/
function activeFeature() {
     $('.feature-list').on('click', function() {
       var clickedOn = $(this).attr("id");
        $('.feature-list').removeClass('featureSelect');
        $('#'+clickedOn).addClass('featureSelect');
     });
}

/*REWRITE ATTEMPT TO SQUASH BUG (Outline 1)*/
function handleCanvasClick() {
     var mouse = {
        x: -1,
        y: -1
        };
    $('#myCanvas').on('click', function(e) {
        var featureSettings = getFeatureSettings();
    if (!featureSettings) {
      console.log('Select something from the features menu!');
      return;
    }

    if (featureSettings.name == 'hallway') {
        /*Function that generates a path on the screen!*/
        var cvs = $("#myCanvas")[0].getContext("2d");
            if(mouse.x != -1 && mouse.y != -1){
                cvs.beginPath();
                cvs.moveTo(mouse.x, mouse.y);
                cvs.lineTo(e.pageX, e.pageY);
                cvs.closePath();
                 pathGen = true;
                cvs.lineWidth = 14;
                cvs.strokeStyle = '#7D26CD';
                cvs.stroke();
                // Store data to JSON
                features.push({
                   node_id : 'Hallway' + lineID,
                   feat_name: featureSettings.name,
                   feat_id : featureSettings.name + lineID,
                   x_cord1 : mouse.x,
                   y_cord1 : mouse.y,
                   x_cord2 : e.pageX,
                   y_cord2 : e.pageY,
               });
                
                mouse.x = -1;
                mouse.y = -1;
            }else{
                mouse.x = e.pageX;
                mouse.y = e.pageY;
            }
            console.log('features after push: \n');
            console.log(JSON.stringify(features));
    }
    else {
       /*Function that actually adds the nodes to the canvas. It intakes what feature it is adding,
        the color for that node (each feature has its own color (except some) and if the feature is 
        accessible. It will then input that information into the array of objects.*/
            nodeID++;
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop; 
    
            
            var ctx= this.getContext("2d");
            ctx.fillStyle = featureSettings.color;
            if (pathGen) {
                ctx.strokeStyle = featureSettings.color;
                ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.arc(x, y, 6,0, 2*Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
            console.log('nodeID adding why?!' + nodeID);
            var featID = prompt('What ID number would you like to give this feature?');
            var access = featureSettings.accessibility;
            if (access == null) {
             access = prompt('Is this accessible? Please type y or n.');
            }
            
               features.push({
                   node_id : 'node' + nodeID,
                   feat_name: featureSettings.name,
                   feat_id : featureSettings.name + featID,
                   x_cord : window.current_x,
                   y_cord : window.current_y,
                   accessible : access
               });
               console.log('features after push: \n');
               console.log(JSON.stringify(features));
       
    }
  });
    
}
/*Function that fills the information necessary to create a NODE or a HALLWAY by
identifying what feature was selected from the drop down menu*/
function getFeatureSettings() {
    var itemActive = $('.featureSelect').attr("id");
    if (!itemActive) return null;
    
    switch (itemActive) {
    case "feat-room":
      return { name: "room", color: "#000000", accessibility: null };
    
    case "feat-office":
        return { name: "office", color: "#000000", accessibility: null };
        
    case "feat-bathroom":
        return { name: "bathroom", color: "#FFFF00", accessibility: null };
        
    case "feat-water":
      return { name: "water_fountain", color: "#1E90FF", accessibility: 'y' };
      
    case "feat-staircase":
        return { name: "stair", color: "#00FF00", accessibility: 'n' };
        
    case "feat-entrance":
        return { name: "entrance", color: "#00FF00", accessibility: 'y' };
        
    case "feat-ramp":
        return { name: "ramp", color: "#0000FF", accessibility: 'y' };
        
    case "feat-elevator":
        return { name: "elevator", color: "#0000FF", accessibility: 'y' };
        
    case "feat-construction":
        return { name: "construction", color: "#808080", accessibility: 'y' };
        
    case "feat-aed":
        return { name: "aed", color: "#FF0000", accessibility: null };
    
    case "feat-hallway":
        return { name: "hallway", color: "#7D26CD", accessibility: 'y' };
    default: 
        return { name: "hallway", color: "#7D26CD", accessibility: 'y' };
  } 
}

// All of the below function will help contribute to the UNDO / REDO capabilities
function undoAndRedo() {
    var ctx = $('#myCanvas').getContext("2d");
    function pushOrderArray() {
        cStep++;
        if (cStep < cPushArray.length) { cPushArray.length = cStep; }
        cPushArray.push(document.getElementById('myCanvas').toDataURL());
    }
    
    function undoDrawing() {
        $('#undoButton').on('click', function() {
            if (cStep > 0) {
                cStep--;
                var canvasPic = new Image();
                canvasPic.src = cPushArray[cStep];
                canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
            }
        });
    }
    
    function redoDrawing() {
        $('#redoButton').on('click', function() {
             if (cStep < cPushArray.length-1) {
                cStep++;
                var canvasPic = new Image();
                canvasPic.src = cPushArray[cStep];
                canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
            }
        });
    }
}

/****************************************************************************/

function outputJSON() {
    $('#JSONClick').on('click', function() {
        var myWindow = window.open("", "JSON Output", "width=600, height=400");
        myWindow.document.write(JSON.stringify(features));
    })
}

/*MAY NEED TO REWRITE THIS SINCE CANVAS ELEMENTS DO NOT HAVE ID's or ELEMENTS*/
function hoverNode(nodeID) {
    console.log('nodeID in start of hoverMode: ' + nodeID);
    for ( var i=0; i < features.length; i++) {
        $('#' + features[i].node_id).data('feature-ptr', features[i]);
    };
    
    $('#myCanvas').mouseover(function (e) {
          var feature_data = $(this).data('feature-ptr');
          $('<div class="info">' 
            + feature_data.feat_id 
            + '<br>' 
            + '(' + feature_data.x_cord + ', ' + feature_data.y_cord + ')'
            + '<br>'
            + 'Accessibility: ' 
            + feature_data.accessible.toLocaleString("en-US")
            + '</div>').appendTo('body');
    }).mouseleave(function () {
        $('.info').remove();
        }).mousemove(function(e) {
            var mouseX = e.pageX, // X coordinates of mouse
                mouseY = e.pageY; // Y coordinates of mouse
        
             $('.info').css({
                top: mouseY - 70,
                left: mouseX - 30
            });
            });
}


// IMPLEMENT CODE TO GRAB FROM ARRAY TO PHP TO SQL!!!!!!!
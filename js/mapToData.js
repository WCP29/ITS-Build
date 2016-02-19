/*
Goals and Notes (statuses):

    *************COMPLETE****************************************************************************
    *    - DEBUG the constant onclick handler. The a consecutive feature will be interfered with    *
    *    a previous feature, even with on and off flags I have set for them. Going to fix this      *
    *    by rewriting the functions that implement this.                                            *    
    *                                                                                               *
    *        -- DEBUG: CLICK and drag position of the node changes the nodes.                       *
    *                                                                       *
    *                                                                                               *
    * - Implement UNDO function that removes node or hall that was just made from the canvas        *
    * and the JSON                                                                                  *
    *                                                                     *
    *                                                                                               *
    *                                                                                               *
    *************************************************************************************************
    
    - IMPLEMENT a modal upon loading where ITS is asked for a form input. They will be asked
    what building they wish to work with and what floor they want to populate. This will then
    interact with jQuery/Javascript that will run on CASE or IF conditions where it will recognize
    what blueprint image to load. The building name and floor name will be fed as the names of the
    arrays that the information will be stored in.
         *** Status: 90% Complete
                    -
    
    - UPLOAD all of the blueprints to the images folder. Perhaps rename the images folder to 
    "Blueprints".
         *** Status: Security Precaution necessary.
                    -
    
    - DEVELOP function to extract from JSON or our SQL tables to automatically populate the blueprints
    we or ITS has already configured. THIS CAN BE DUPLICATED FOR THE USER MODE!
         *** Status:
    
*/


var features = [];
var temp = []; // For undo and redo
var nodeID = 0;
var lineID = 0;
var pathGen = false;
var restorePoints = []; // For undo function
var tempFeatureLength = 0;
var AJAXBuilding = '';
var AJAXFloor = '';

//var featID = null;
//var access = null;


$( document ).ready(function() {
    
    
    $('#myCanvas').attr('height', $('#myCanvas').css('height'));
    $('#myCanvas').attr('width', $('#myCanvas').css('width'));
    
    $('#modal').hide();
    
   startModal();
    exitModal();
    
    $('#inputAccess, #inputID').hide();

  getActiveCoordinates();
  
  activeFeature();
  
  handleCanvasClick();
  
  undoDrawing();
  
  outputJSON();
  

});

/* This is the modal that will fade in when faculty opens the application. It will feature a
searchable dropdown that will allow faculty to choose what building they will interact with.
After they select the floor of the building they searched for and found, the menu will disappear
and load the blueprint of the respective floor of the building respected as the background image 
of the Canvas.

 FUNCTION STATUS: INCOMPLETE!
*/
function startModal() {
    $("#whatFloor, #floorOptions, #OKButton, #buildingOptions").hide();
    $(".overlay").fadeIn(1000);
    $("#menu, #myCanvas").hide();
    $('#whatBuilding').on('focus click', function () {
        $('#whatFloor, #OKButton').fadeOut();
        $("#buildingOptions").fadeIn('slow');
    });
    searchBuilding();
    searchFloor();
    
    /*****
    Currently a template of the opening modal, but has 90% functionality.
    ******/
}

function searchBuilding() {
	$('#whatBuilding').keyup(function() {
    	var searchforitem = $(this).val();
    		if(searchforitem != null) {
    		    $('#buildingOptions').children().each(function(){
    		    	if ($(this).text().search(new RegExp(searchforitem, "i")) < 0) {
    			    	$(this).fadeOut();
    			    }
    			    else {
    			    	$(this).show();
    		    	}
    		    })
    		}
		})
	$("#buildingOptions li").on('click', function(e) {
	    e.preventDefault();
	    var selectedBuilding = $(this).children().text();
	    
	    //Take SelectedBuilding and compare it with the Building values to assign the correct AJAXBuilding code for the GET call!
	    function setAJAXBuilding() {
            switch (selectedBuilding) {
                case "Academic A":
                  return "academic_a";
                
                case "Old Union":
                    return "old_union";
                    
                case "West Union":
                    return "west_union";
                    
                case "Engineering Building":
                  return "engineering_building";
                  
                case "Fine Arts":
                    return "fine_arts";
                    
                default: 
                    return '';
              } 
        }
        /*Display what building was selected so it can be pushed as part of the data that needs to be organized for the GET and POST calls.*/
        AJAXBuilding  = setAJAXBuilding();
	    
	    
	    
	    $('#whatBuilding').val('');
	    $('#whatBuilding').attr("placeholder", selectedBuilding);
	    $("#buildingOptions").fadeOut(1000, function () {
	         $("#whatFloor").fadeIn();
	    });
	})
}

function searchFloor() {
     $('#whatFloor').on('focus click', function () {
        $("#floorOptions").fadeIn('slow');
    });
    $('#whatFloor').keyup(function() {
    	var searchforitem = $(this).val();
    		if(searchforitem != null) {
    		    $('#floorOptions').children().each(function(){
    		    	if ($(this).text().search(new RegExp(searchforitem, "i")) < 0) {
    			    	$(this).fadeOut();
    			    }
    			    else {
    			    	$(this).show();
    		    	}
    		    })
    		}
		})
	$("#floorOptions li").on('click', function(e) {
	    e.preventDefault();
	    var selectedFloor = $(this).children().text();
	    
	    
	    //Take SelectedFloor and compare it with the Building values to assign the correct AJAXFloor code for the GET call!
        function setAJAXFloor() {
            switch (selectedFloor) {
                case "Basement":
                  return "Basement";
                
                case "1":
                    return "1";
                    
                case "2":
                    return "2";
                    
                case "3":
                  return "3";
                  
                case "4":
                    return "4";
                    
                case "5":
                    return "5";
                    
                default: 
                    return '';
              } 
        }
        /*Display what floor was selected so it can be pushed as part of the data that needs to be organized for the GET and POST calls.*/
        AJAXFloor  = setAJAXFloor();
	    
	    
	    $('#whatFloor').val('');
	    $('#whatFloor').attr("placeholder", selectedFloor);
	    $("#floorOptions").fadeOut(1000, function () {
	         $("#OKButton").fadeIn();
	    });
	})
}
function exitModal() {
    $('#OKButton').on('click', function () {
        $('#myCanvas, #menu').show();
        $('#modal').fadeOut();
        
        // LOAD THE IMAGE OF THE SELECTED BLUEPRINT AS THE BACKGROUND OF CANVAS!!
        
        /*AJAX GET REQUEST FOR DATA that already exists.*/
        drawData();
    })
}

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
     $('.feature-list').on('click', function(e) {
       e.preventDefault();    
       var clickedOn = $(this).attr("id");
        $('.feature-list').removeClass('featureSelect');
        $('#'+clickedOn).addClass('featureSelect');
    
        function outputMe() {
            switch (clickedOn) {
                case "feat-room":
                  return { name: "Room" };
                
                case "feat-office":
                    return { name: "Office"};
                    
                case "feat-bathroom":
                    return { name: "Bathroom"};
                    
                case "feat-water":
                  return { name: "Water Fountain"};
                  
                case "feat-staircase":
                    return { name: "Stairway"};
                    
                case "feat-entrance":
                    return { name: "Entrance"};
                    
                case "feat-ramp":
                    return { name: "Ramp"};
                    
                case "feat-elevator":
                    return { name: "Elevator"};
                    
                case "feat-construction":
                    return { name: "Construction"};
                    
                case "feat-aed":
                    return { name: "AED"};
                
                case "feat-hallway":
                    return { name: "Hallway"};
                default: 
                    return { name: ""};
              } 
        }
        /*Display what feature was selected*/
        var showMe = outputMe();
        $('#showFeature').remove();
        $('#JSONClick').parent().after('<li id="showFeature"><p>Feature Selected: ' + showMe.name + '</p></li>');
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
          alert('Select something from the features menu!');
          return;
        }
        
        if (featureSettings.name == 'hallway') {
            
            /*Function that generates a path on the screen!*/
            var cvs = $("#myCanvas")[0].getContext("2d");
                if(mouse.x != -1 && mouse.y != -1){
                     //Store for temporary restore point for Undo function:
                    var imgSrc = this.toDataURL("image/png");
                    restorePoints.push(imgSrc);
                    cvs.beginPath();
                    cvs.moveTo(mouse.x, mouse.y);
                    cvs.lineTo(e.pageX, e.pageY);
                    cvs.closePath();
                     pathGen = true;
                    cvs.lineWidth = 14;
                    cvs.strokeStyle = '#7D26CD';
                    cvs.stroke();
                    lineID++;
                    
                    // Store data to JSON
                 var d = Math.sqrt((e.pageX -= mouse.x)*e.pageX + (e.pageY-= mouse.y)*e.pageY);
                    features.push({
                       building : AJAXBuilding,
                       floor: AJAXFloor,
                       node_id : 'Hallway' + lineID,
                       feat_name: featureSettings.name,
                       feat_id : featureSettings.name + lineID,
                       x_cord1 : mouse.x,
                       y_cord1 : mouse.y,
                       x_cord2 : e.pageX,
                       y_cord2 : e.pageY,
                       distance : d,
                   });
                   temp.unshift({
                       building : AJAXBuilding,
                       floor: AJAXFloor,
                       node_id : 'Hallway' + lineID,
                       feat_name: featureSettings.name,
                       feat_id : featureSettings.name + lineID,
                       x_cord1 : mouse.x,
                       y_cord1 : mouse.y,
                       x_cord2 : e.pageX,
                       y_cord2 : e.pageY,
                       distance : d,
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
            
              //Store for temporary restore point for Undo function:
                var imgSrc = this.toDataURL("image/png");
                restorePoints.push(imgSrc);
            
            
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
                /*
                    var featID;
                    $('#inputID').fadeIn();
                    if (!featID) {
                         $('#inputID').focus();
                    }
                    $('#inputID').keydown(function(e) {
		            if (e.which == 13) {
			            e.preventDefault(); // Do not reload on submission
			            featID = $('#inputID').val();
			            console.log('featID: ' + featID);
			            $('#inputID').fadeOut();
			            //$('#inputAccess').focus();
		            } 
                })
            */
                var featID = prompt('What ID number would you like to give this feature (' + (featureSettings.name).toUpperCase() +') ?');
                var access = featureSettings.accessibility;
                if (access == null) {
                 access = prompt('Is this feature (' + featureSettings.name + ') accessible? Please type y or n.');
                 /*
                    $('#inputAccess').fadeIn();
                    $('#inputAccess').focus();
                    $('#inputAccess').keydown(function(e) {
		                if (e.which == 13) {
			                e.preventDefault(); // Do not reload on submission
			                access = $('#inputAccess').val();
			                console.log('access: ' + access);
			                $('#inputAccess').fadeOut();
		                } 
                    }) 
                 */
                }
                   features.push({
                       building : AJAXBuilding,
                       floor: AJAXFloor,
                       node_id : 'node' + nodeID,
                       feat_name: featureSettings.name,
                       feat_id : featureSettings.name + featID,
                       x_cord : window.current_x,
                       y_cord : window.current_y,
                       accessible : access
                   });
                   temp.unshift({
                       building : AJAXBuilding,
                       floor: AJAXFloor,
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
function undoDrawing() {
    var undoButton = $('#undoButton');
    
        undoButton.on('mousedown', function(e) {
            //Grab from the last element of features and delete it.
            e.preventDefault();
            var lastElement = features[(features.length - 1)];
                if (lastElement.feat_name == 'hallway') {
                    lineID--;
                }
                else {
                    nodeID--;
                }
                var removedFeature = features.pop();
                console.log('Removed:' + removedFeature);
                console.log('features after POP: \n');
                console.log(JSON.stringify(features));
                
                var oImg = new Image();
                oImg.onload = function() {
                    var canvas = document.getElementById('myCanvas');
                    var ctx= canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(oImg, 0, 0);
                }
                oImg.src = restorePoints.pop();
        });
   // }
}
    
function redoDrawing() {
     var ctx = $('#myCanvas')[0].getContext("2d");
     var redoButton = $('#redoButton');
    if (features == '') {
        console.log('empty');
        redoButton.css(
        {
            "cursor": "not-allowed"
        });
    }
    else {
          redoButton.css(
        {
            "background-color": "#31B0D5",
            "border": "1px solid #31B0D5",
            "cursor": "pointer"
        });
    }
    redoButton.on('click', function() {
             
    });
}

/****************************************************************************/

function outputJSON() {
    $('#JSONClick').on('click', function(e) {
        pushToServer(features);
        
        e.preventDefault();
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

function pushToServer(jsonStuff) {
   // var JSONStuff =  JSON.stringify(jsonStuff);
    var JSONStuff = jsonStuff;
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var date = (month + "/" + day + "/" + year);
    
    var data = 
        {
            date: date,
            map: JSONStuff,
        };
    
    $.post("Pusher.php", data, function(returnData) {
        //If successful, do this:
        console.log(returnData);
    });
 
}

function drawData() {
        console.log('executing draw data.');
         $.ajax({    //create an ajax request to load_page.php
            type: "GET",
            url: "Pusher.php",             
            data: { building_info : AJAXBuilding, floor_info : AJAXFloor},
            success: function(response){                    
                 console.log(response);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
            }  
        });
}
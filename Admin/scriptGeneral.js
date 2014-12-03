$().ready(function(){
 
    $("#btnNewRoute").click(function(){
        $("#divEditRoute").hide();
        $("#ulNewRoute").show();
    });
    $("#btnEditRoute").click(function(){
        $("#divEditRoute").show();
        $("#ulNewRoute").hide();
    });
    $("#btnCancelRoute").click(function(){
        $("#divEditRoute").hide();
        $("#ulNewRoute").hide();
    });
    $("#btnSaveNewRoute").click(function()
    {
       fnSaveNewRoute(); 
    });
    fnAjustar();
   $(window).resize(function(){fnAjustar();});

   //fnLoadRoutes();
   $("#selEditRoute").change(function()
   {
       fnLoadWayPoints($(this).find("option:selected").attr("vid"));
   });
   /*$("#divOpenRoutes").mouseover(function(){
       $("#divSelRoutes").css("left","-220px");
   });
   $("#divOpenRoutes").mouseleave(function(){
       $("#divSelRoutes").css("left","-225px");
   });*/
   $("#divOpenRoutes").click(function(){
       if($(this).attr("val") == "open")
       {
           $(this).attr("val","closed");
           $("#divSelRoutes").css("left","-225px");
       }
       else
       {
           $(this).attr("val","open");
           $("#divSelRoutes").css("left","0px");
       }
   });
});
function fnLoadWayPoints(TH)
{
    fnShowRoute(parseInt(TH));
}
function fnCargarEventoDrag()
{
    $(".divDeleteWayPoint").dblclick(function(){
       $("li[name='li"+$(this).attr("vid")+"']").remove();
       var i = 1;
       $("#ulList li").each(function(){
            $(this).find("span").html(i);
            i++;
       });
    });
    var THDragged;
    $( "#ulList li" ).draggable({ 
        containment: "#ulList" ,
        axis: "y" ,
        drag: function(e) {
            THDragged = $( this );
            THDragged.css("z-index","2");
            $("#ulList").attr("dragging","yes");
        },
        stop: function() {
            $( "#ulList li" ).each(function(){$(this).css("top","0");});
            $( this ).css("z-index","1");
            $("#ulList li").mouseover(function(e){
                if($("#ulList").attr("dragging") == "yes")
                {
                    var offset = $( this ).offset();
                    e.stopPropagation();
                    var newSpan = parseInt($(this).find("span").text());
                    THDragged.attr("vid",newSpan + "-top:" + offset.top);
                    var oldSpan = parseInt(THDragged.find("span").text());
                    if(oldSpan != newSpan)
                    {
                        $("#ulList li").each(function(){
                           var span = parseInt($(this).find("span").text());
                           if(oldSpan > newSpan)
                           {
                                if(span >= newSpan && span <= oldSpan) 
                                {
                                    $(this).find("span").text(span+1);
                                }
                           }
                           if(oldSpan < newSpan)
                           {
                                if(span >= oldSpan && span <= newSpan) 
                                {
                                    $(this).find("span").text(span-1);
                                }
                           }
                        });
                    }
                    THDragged.find("span").text(newSpan);
                    $("#ulList").attr("dragging","no");
                    fnOrderList();
                }
            });
        }
    });
}
function fnOrderList()
{
    var i = 1;
    var lsHTML = "";
    var max = 0;
    $("#ulList li").each(function(){
        max++;
    });
    for(;i <= max; i++)
    {
        var name = $("#ulList li").find("span:contains("+i+")").attr("name");
        lsHTML += "<li name='"+name+"'>" +$("li[name='"+name+"']").html() + "</li>";
    }
    $("#ulList").html(lsHTML);
    fnCargarEventoDrag();
}
function fnAjustar()
{
    var hei = parseInt($(document).height());
    hei = hei * .7;
    $("#map_canvas").css("height",hei);
    $("#divSelRoutes").css("height",hei);
}
function getWayPoints()
{
    var lsJSON = '';
    var lsHeader = 'Route_callback({' +
                    '"origin": {"Coordinates":[@@@ORIGIN]},' +
                    '"destination": {"Coordinates":[@@@DESTINATION]},' +
                    '"observation": "@@@STATUS"';
    var lsWayPoint = ',"waypoints": [' +
                        '{' +
                          '"location" : {"Coordinates":[@@@LOCATION]},' +
                          '"stopover" : false,' +
                          '"description" : "@@@DESCRIPTION"' +
                        '}';
    var lsFooter = ']' +
                '});';
    var lsCoor = '';
    var lsDes = '';
    var i = 1;
    $("#ulList li").each(function()
    {
       lsCoor = $(this).find(".divLocation").html();
       lsDes = $(this).find(".divDescription").html();
       if(i == 1)//Origin
       {
           lsJSON += lsHeader;
           lsJSON = lsJSON.replace('@@@ORIGIN',lsCoor);
           lsJSON = lsJSON.replace('@@@STATUS',$("#inRouteStatus").val());
           i++;
       }
       else
       {
           lsJSON += lsWayPoint;
           lsJSON = lsJSON.replace('@@@LOCATION',lsCoor);
           lsJSON = lsJSON.replace('@@@DESCRIPTION',lsDes);
       }
    });
    lsJSON += lsFooter;
    lsJSON = lsJSON.replace(/\@@@DESTINATION/g,lsCoor);
    return lsJSON;
}
function fnSaveNewRoute()
{
    var NoRoute = $("#NoRouteTxt").val().replace(' ','');
    var NameRoute = $("#NameRouteTxt").val();
    var Color1Route = $("#color1Txt").val();
    var Color2Route = $("#color2Txt").val();
    var ColorTxtRoute = $("#colorTxt").val();
    var Orig = "";
    var Dest = "";
    var Markers = "";
    var count = 0;
    $("#ulList li").each(function()
    {
        var name = $(this).attr("name");
        count = $(this).find("span[name='"+name+"']").text();
        var desc = $(this).find(".divDescription").html();
        var coor = $(this).find(".divLocation").html();
        
        Markers += "\t-" + desc + " - [" + coor + "]\n";
        
        if(count == 1) Orig = "[" + coor + "]";
        else Dest = "[" + coor + "]";
    });

    var msg = "Guardar Ruta: " + NoRoute + " - " + NameRoute + "\n"+
                "\t-Color 1: " + Color1Route  + "\n"+
                "\t-Color 2: " + Color2Route  + "\n"+
                "\t-Color del Texto: " + ColorTxtRoute  + "\n"+
                "\t-Origen: " + Orig  + "\n"+
                "\t-Destino: " + Dest  + "\n\n\t\tMARKERS:"+
                Markers;
                
    if(confirm(msg))
    {
        var file = getWayPoints();
        $.ajax({
            type: "POST",
            url: "saveFile.php",
            data: { file: file, description: "Boston" }
        })
        .success(function( msg ) {
            alert( "Data Saved: " + msg );
        })
        .error(function( msg ) {
            alert( "Error: " + msg );
        });
    }
}
var map; 
var rendererOptions;
var directionDisplays = new Array();
var directionsService;
var stepDisplay;
var markerArray = new Array();//Markers in Map
var arrowArray = new Array();//Arrows in Map
var wayptsCount = 0; //Way points in Route
var wayptsTimes = 0; //Times will calculate route (wayptsCount / 9), > 0  if waypts exceeds from 9
var positionA;
var markersA = new Array();
var positionB;
function initialize() {
   // google.load("maps","3.9", {"other_params":"client=gme-1074733164596.project.googleusercontent.com&sensor=false"});
    map = new google.maps.Map(document.getElementById('map_canvas'), {
      zoom: 14,
      center: new google.maps.LatLng(25.678211, -100.320073),
      mapTypeId: google.maps.MapTypeId.ROADMAP 
    });

    directionsService = new google.maps.DirectionsService();


    //directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    stepDisplay = new google.maps.InfoWindow();

    fnLoadRoutesFile();//Load every Route from file, and set it in <select>
    google.maps.event.addListener(map, "rightclick",function(event){showContextMenu(event.latLng);})
    google.maps.event.addListener(map, "click",function(event){hideContextMenu();})
}

 function showContextMenu(currentLatLng) {
    var projection;
    var contextmenuDir;
    projection = map.getProjection() ;
    $('.contextmenu').remove();
     contextmenuDir = document.createElement("div");
      contextmenuDir.className  = 'contextmenu';
      contextmenuDir.innerHTML = '<span style="text-align: center; display: inherit;">Descripción del punto<\/span>'
                              + '<input id="inDescriptionWayPoint" placeholder="Bénito Juarez vuelta a 5 de Mayo, Centro" type="text" style="width: 95%;" \/>'
                              + '<span style="text-align: center; display: inherit;">Coordenadas<\/span>'
                              + '<span style="text-align: center; display: inherit;">x:<div id="divLat">'+currentLatLng.lat()+'</div><\/span>'
                              + '<span style="text-align: center; display: inherit;">y:<div id="divLng">'+currentLatLng.lng()+'</div><\/span>'
                              + '<div class="btnNormal" id="btnAddWayPoint" style="width: 45%; position:relative;float:left">Agregar +<\/div>' 
                              + '<div class="btnNormal" id="btnCancelWayPoint" style="width: 45%; display: table-cell;">Cancelar<\/div>' ;

    $(map.getDiv()).append(contextmenuDir);
    fnEventsMenu();
    setMenuXY(currentLatLng);

    contextmenuDir.style.visibility = "visible";

    $("#menu1").click(function(){
        fnCleanThisFromMap(markersA);
        $(".contextmenu").hide();
        positionA = caurrentLatLng;
        var marker = new google.maps.Marker({
          position: positionA,
          map: map
        });
        markersA.push(marker);
        map.panTo(positionA);
        fnFindNearestStop();
    });
}
function fnEventsMenu()
{
    $("#btnAddWayPoint").click(function()
    {
        var lsDes = $("#inDescriptionWayPoint").val();
        var lsCoor = $("#divLat").html() + ", " + $("#divLng").html();
        if(lsDes.length > 0)
        {
            $(".contextmenu").hide();
            var liNextWP = 1;
            var liNextID = 1;
            $("#ulList li").each(function()
            {
                var TH = parseInt($(this).attr("name").replace('li',''));
                var ID = parseInt($(this).find("span").html());
                if(liNextWP <= TH)liNextWP = TH + 1;
                if(liNextID <= ID)liNextID = ID + 1;
            });
            $("#ulList").append(' <li class="ui-draggable" name="li'+liNextWP+'" style="position: relative;">' +
                                '<div class="divLeft">' +
                                    '<span name="li'+liNextWP+'">'+liNextID+'</span>' +
                                '</div>' +
                                '<div class="divRight">' +
                                    '<div class="divDescription">'+lsDes+'</div>' +
                                    '<div class="divLocation">'+lsCoor+'</div>' +
                                '</div>' +
                                '<div class="divDeleteWayPoint" title="Doble click para eliminar." vid="'+liNextWP+'">x</div>' +
                            '</li>');
            fnCargarEventoDrag();
        }
        else
        {
            alert("Falta escribir la descripción de la coordenada.");
        }
    });
    $("#btnCancelWayPoint").click(function()
    {
        $(".contextmenu").hide();
        $("#inDescriptionWayPoint").val("");
    });
}
function getCanvasXY(caurrentLatLng){
    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );
    var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = map.getProjection().fromLatLngToPoint(caurrentLatLng);
    var caurrentLatLngOffset = new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    return caurrentLatLngOffset;
}
function setMenuXY(caurrentLatLng){
    var mapWidth = $('#map_canvas').width();
    var mapHeight = $('#map_canvas').height();
    var menuWidth = $('.contextmenu').width();
    var menuHeight = $('.contextmenu').height();
    var clickedPosition = getCanvasXY(caurrentLatLng);
    var x = clickedPosition.x ;
    var y = clickedPosition.y ;

     if((mapWidth - x ) < menuWidth)//if to close to the map border, decrease x position
         x = x - menuWidth;
    if((mapHeight - y ) < menuHeight)//if to close to the map border, decrease y position
        y = y - menuHeight;

    $('.contextmenu').css('left',x  );
    $('.contextmenu').css('top',y );
}

/*Encontrar parada mas cercana al punto*/
function fnFindNearestStop(){
    var script = document.createElement('script');
    script.src = 'Routes/stops.js';
    document.getElementsByTagName('head')[0].appendChild(script);
}

function hideContextMenu(){

    //if($(".contextmenu").lenght > 0)
    //{
        $(".contextmenu").hide();
   // }
}
/*Encontrar parada más cercana al punto*/
function Stops_callback(results){
    var nearest;
    var distance;
    var buses;
    for (var i = 0; i < results.stops.length; i++) {
        if(i == 0){
            nearest = results.stops[i].location.Coordinates;
            buses = results.stops[i].buses;
            distance = fnGetDistanceBetween2Points(nearest[0],nearest[1],positionA.k,positionA.A);
        }
        else
        {
            var thisStop = results.stops[i].location.Coordinates;
            var thisDistance = fnGetDistanceBetween2Points(thisStop[0],thisStop[1],positionA.k,positionA.A);
            if(distance > thisDistance)
            {
                distance = thisDistance;
                nearest = thisStop;
                buses = results.stops[i].buses;
            }
        }
    }
    var res = "";
    fnClearRoutesInMap();
    for(x = 0;x < buses.length;x++){
        res += "-" + buses[x] + "\n";
        fnShowRoute(buses[x]);
    }
}

function fnGetDistanceBetween2Points(lat_a,lng_a,lat_b,lng_b)
{
    var pk = 180/3.14169;

    var a1 = lat_a / pk;
    var a2 = lng_a / pk;
    var b1 = lat_b / pk;
    var b2 = lng_b / pk;

    var t1 = Math.cos(a1)*Math.cos(a2)*Math.cos(b1)*Math.cos(b2);
    var t2 = Math.cos(a1)*Math.sin(a2)*Math.cos(b1)*Math.sin(b2);
    var t3 = Math.sin(a1)*Math.sin(b1);
    var tt = Math.acos(t1 + t2 + t3);

    return 6366000*tt;
}

/**/
function fnLoadRoutesFile(){
  var script = document.createElement('script');
  script.src = 'suben-export.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}

/**/
function Routes_callback(results){
  var lsHtmlRutas ="";
  var lsSelHtmlRutas = "";
  for (var i = 0; i < results.Buses.length; i++) {
    var Bus = results.Buses[i];
  
      lsHtmlRutas += "<div class='optRuta'><img src='imgs/off_mini.png'vid='off' class='btnSelRoute' val='"+Bus.ID+"'/>"+Bus.Route + " - "+Bus.WayName +"</div>";
     lsSelHtmlRutas += "<option vid='"+Bus.ID+"'>" + Bus.Route + " - " + Bus.WayName+"</option>";
     

  }
  $("#selEditRoute").html(lsSelHtmlRutas);
  $("#divRoutes").html(lsHtmlRutas);
  $(".btnSelRoute").click(function()
  {
      $(".btnSelRoute[vid='on']").attr("src","imgs/off_mini.png");
      $(".btnSelRoute[vid='on']").attr("vid","off");
      $(this).attr("src","imgs/on_mini.png");
      $(this).attr("vid","on");
    
     showRouteSel($(this).attr("val"));
  });
  $(".btnSelRoute").mouseover(function()
  {
       $(this).attr("src","imgs/" + $(this).attr("vid") + "_hover_mini.png");
  });
  $(".btnSelRoute").mouseleave(function()
  {
       $(this).attr("src","imgs/" + $(this).attr("vid") + "_mini.png");
  });
 
}

/*Mostrar las rutas disponibles en el <select>*/
function showRouteSel(idRoute) {
  if(idRoute != "0")
  {
    fnClearRoutesInMap();
    fnShowRoute(idRoute);
  }
}

function fnShowRoute(idRoute){   
    var script = document.createElement('script');
      script.src = 'Routes/' + idRoute + '.js';
      document.getElementsByTagName('head')[0].appendChild(script);
      wayptsCount = 0;
      wayptsTimes = 0;
}

/*Limpiar todas las rutas del mapa*/
function fnClearRoutesInMap(){
    for (var i = 0; i < directionDisplays.length; i++ ) {
        directionDisplays[i].setMap(null);
      }
    directionDisplays.length = 0;
}

/*Limpiar markers especificados del mapa*/
function fnCleanThisFromMap(MarkersInMap) {
      for (i = 0; i < MarkersInMap.length; i++) {
        MarkersInMap[i].setMap(null);
      } 
}

/*Manda llamar el archivo JSON de la ruta seleccionada*/
function calcRoute(start,end) {




// Retrieve the start and end locations and create
// a DirectionsRequest using WALKING directions.
// var start = document.getElementById("start").value;
//var end = document.getElementById("end").value;
// Create a <script> tag and set the USGS URL as the source.
var script = document.createElement('script');
script.src = 'Routes/1.json';
document.getElementsByTagName('head')[0].appendChild(script);
}

/*Función llamada desde archivo JSON para traer información de ruta*/
function Route_callback(results){
    showRoute(results);
  }

/*Muestra la ruta seleccionada*/
function showRoute(results) {
    fnCleanThisFromMap(markerArray);
    fnCleanThisFromMap(arrowArray);
    var CoorOrig = results.origin.Coordinates;
    var CoorDest = results.destination.Coordinates;
    var origin = new google.maps.LatLng(CoorOrig[0],CoorOrig[1]);
    var Coor;
    wayptsTimes++;
    var wayptsCant = results.waypoints.length;

    fnDraw8WayPts(origin,wayptsCant,results);

}

/*Dibujar ruta con 8 Waypoints*/
function fnDraw8WayPts(origin,wayptsCant,results){
    wayptsCount = 0;
    var WayPts = [];
    var destination = new google.maps.LatLng();
    for(var i = (wayptsTimes -1) * 8; i < wayptsCant; i++)
    {
        if(wayptsCount < 8)
        {
            Coor = results.waypoints[i].location.Coordinates;
            WayPts.push({
                    location: new google.maps.LatLng(Coor[0],Coor[1]),
                    stopover:results.waypoints[i].stopover});
                var x = i + 1;
                $("#ulList").append("<li  name='li"+x+"'>"+
                        "<div class='divLeft'>"+
                                "<span  name='li"+x+"'>"+x+"</span>"+
                        "</div>"+
                        "<div class='divRight'>"+
                                "<div class='divDescription'>"+results.waypoints[i].description+"</div>"+
                                "<div class='divLocation'>"+Coor[0]+","+Coor[1]+"</div>"+
                        "</div>"+
                        "<div class='divDeleteWayPoint' vid='"+x+"' title='Doble click para eliminar.'>x</div>"+
                "</li>");
            /*if (results.waypoints[i].selected == true) {
                WayPts.push({
                    location:results.waypoints[i].value,
                    stopover:false});
            }*/
            wayptsCount++;
        }
    }
    fnCargarEventoDrag();
    var lastWayPoint = (wayptsTimes - 1) * 8 - 1 + wayptsCount;
    destination = new google.maps.LatLng(results.waypoints[lastWayPoint].location.Coordinates[0],results.waypoints[lastWayPoint].location.Coordinates[1]);

    var request = {
          origin: origin,
          destination: destination,
          waypoints: WayPts ,
          //optimizeWaypoints: false,
          //provideRouteAlternatives: false,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL

    };
    var icons = {
      start: new google.maps.MarkerImage(
       // URL
       'Markers/marker1.png',
       // (width,height)
       new google.maps.Size( 71, 71 ),
       // The origin point (x,y)
       new google.maps.Point( 0, 0 ),
       // The anchor point (x,y)
       new google.maps.Point( 17, 34 ),
       new google.maps.Size(34, 40)
      ),
      end: new google.maps.MarkerImage(
       // URL
       'Markers/marker2.png',
       // (width,height)
       new google.maps.Size(71, 71 ),
       // The origin point (x,y)
       new google.maps.Point( 0, 0 ),
       // The anchor point (x,y)
       new google.maps.Point( 17, 34 ),
       new google.maps.Size(34, 40)
      )
     };

     rendererOptions= {
                        map: map,
                        suppressMarkers: true,//quitar los markers default del API
                        strokeColor:'#FF00FF'
                      };
     var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    directionsDisplay.setMap(map);
    directionDisplays.push(directionsDisplay);
    // Route the directions and pass the response to a
    // function to create markers for each step.
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
            var warnings = document.getElementById("warnings_panel");
            warnings.innerHTML = "" + response.routes[0].warnings + "";
            directionsDisplay.setDirections(response);
            var leg = response.routes[ 0 ].legs[ 0 ];
            if(wayptsCant <= 8)
            {
                //makeMarker( leg.start_location, icons.start, "Inicio" );
                //makeMarker( leg.end_location, icons.end, 'Fin' );
            }
            else
            {
                if((wayptsTimes -1) * 8 + wayptsCount == 8)
                {
                    //makeMarker( leg.start_location, icons.start, "Inicio" );
                }
                if((wayptsTimes -1) * 8 + wayptsCount == wayptsCant)
                {
                    //makeMarker( leg.end_location, icons.end, 'Fin' );
                }
            }
            fx(response.routes[0]);
        //showSteps(response);
      }
      var msg ="Ruta cargada con &eacute;xito!";
      switch(status){
          case "ZERO_RESULTS":
              msg ="La codificacion geografica se ha realizado correctamente pero no ha devuelto ningun resultado. "+
                       "Esto puede ocurrir si en la codificacion geografica se incluye una direccion (address) inexistente o un valor latlng en una ubicacion remota."
              break;     
          case "OVER_QUERY_LIMIT" :
              msg = "Se ha excedido el cupo de solicitudes.";
              break;
          case "REQUEST_DENIED":
              msg = "La solicitud se ha denegado; normalmente se debe a la ausencia de un parametro sensor."
              break;
          case "INVALID_REQUEST" :
              msg = "No se ha especificado la solicitud (address o latlng).";
              break;
      }
      document.getElementById("ErrorMsg").innerHTML= msg;
    });

    if((wayptsTimes -1) * 8 + wayptsCount < wayptsCant)
    {
        //showRoute(results);
    }

    if((wayptsTimes -1) * 8 + wayptsCount < wayptsCant){
        wayptsTimes++;
        //destination = new google.maps.LatLng(results.waypoints[i - 1].location.Coordinates[0],results.waypoints[i - 1].location.Coordinates[1]);
        fnDraw8WayPts(destination,wayptsCant,results);
    }
}

/*Posicionar marker en posicion especifica*/
function makeMarker( position, icon, title ) {
    var marker = new google.maps.Marker({
     position: position,
     map: map,
     icon: icon,
     title: title
    });
    markerArray.push(marker);
  }

/*Crear pasos del recorrido de la ruta*/
function showSteps(directionResult) {
  // For each step, place a marker, and add the text to the marker's
  // info window. Also attach the marker to an array so we
  // can keep track of it and remove it when calculating new
  // routes.
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = new google.maps.Marker({
        //position: myRoute.steps[i].start_point, ///////////ESTO MUESTRA LOS MARKERS DE LAS DIRECCIONES
        map: map
      });
      attachInstructionText(marker, myRoute.steps[i].instructions);
      markerArray[i] = marker;
  }
}

/*Mostrar los pasos de la funcion showSteps()*/
function attachInstructionText(marker, text) {
  google.maps.event.addListener(marker, 'click', function() {
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}

/*Dibujar flechas de la ruta*/
function fx(o){
    if(o && o.legs)
    {
        var markersArrow = new Array();
      for(l=0;l<o.legs.length;++l)
      {
        var leg=o.legs[l];
        for(var s=0;s<leg.steps.length;++s)
        {
          var step=leg.steps[s],
              a=(step.lat_lngs.length)?step.lat_lngs[0]:step.start_point,
              z=(step.lat_lngs.length)?step.lat_lngs[1]:step.end_point,
              dir=((Math.atan2(z.lng()-a.lng(),z.lat()-a.lat())*180)/Math.PI)+360,
              ico=((dir-(dir%3))%120);
             markersArrow = new google.maps.Marker({
                position: a,
                icon: new google.maps.MarkerImage('http://maps.google.com/mapfiles/dir_'+ico+'.png',
                                            new google.maps.Size(24,24),
                                            new google.maps.Point(0,0),
                                            new google.maps.Point(12,12)
                                           ),
          map: map,
          title: Math.round((dir>360)?dir-360:dir)+'°'
        });
        arrowArray.push(markersArrow);
        }
      }
    }
}

    google.maps.event.addDomListener(window, 'load', initialize);
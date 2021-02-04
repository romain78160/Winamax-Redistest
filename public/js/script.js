var map ;
var zoom ;
var center ;

var arret = [];
var isClicked = false;
var focusedZone= "France";

// $(document).ready(function () {
//   $(window).scroll(function () { 		//run on scroll
//       var windowpos = $(window).scrollTop();
// $('#segelaicon').css({ 'top': windowpos });
// // $('#nob_rouleur').css({ 'top': windowpos });
//   });
// });

function afficherMasquer(id)
{
  if(document.getElementById(id).style.display === "block")
    document.getElementById(id).style.display = "none";
  else
    document.getElementById(id).style.display = "block";
}


function newLocation(newLat,newLng,zoom){     												// center map on location via (lat,lng)			
  map.setView({  lat : newLat,lng : newLng },zoom);	
}


function timeConverter(UNIX_timestamp){
  UNIX_timestamp=parseInt(UNIX_timestamp);
 var a = new Date(UNIX_timestamp );
 var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 var year = a.getFullYear();
 var month = months[a.getMonth()];
 var date = a.getDate();
 var hour = a.getHours();
 var min = a.getMinutes();
 var sec = a.getSeconds();

 if (hour<10)
 {hour = '0'+hour}
 if (min<10)
 {min = '0'+min}
 if (sec<10)
 {sec = '0'+sec}

 var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
 return time;
}

function centerMap() {  

  $(document).ready(function () {  

    $("#fr").on('click', function (){ 
        focusedZone="France";
        newLocation(48.1293954,2.556663,6); 
        clearTimeout(rot) ; 
        isClicked = false;
        for (var i = 0; i < 5 ; i++) { 
            clearTimeout(arret[i]);
        } 
    });
    
    $("#pr").on('click', function (){ 
        focusedZone="Paris";
        newLocation(48.866667,2.333333,10); 
        clearTimeout(rot) ; 
        isClicked = false;
        for (var i = 0; i < 5 ; i++) { 
            clearTimeout(arret[i]);
        } 
    });

    $("#fv").on('click', function (){ 
        focusedZone="Ferté Vidame";
        newLocation(48.591934, 0.890153,14); 
        clearTimeout(rot) ; 
        isClicked = false;
        for (var i = 0; i < 5 ; i++) { 
            clearTimeout(arret[i]);
        } 
    });

    $("#bp").on('click', function (){ 
        focusedZone="Belchamp";
        newLocation(47.484504, 6.803817,14); 
        clearTimeout(rot) ; 
        isClicked = false;
        for (var i = 0; i < 5 ; i++) { 
            clearTimeout(arret[i]);
        } 
    });

    $("#mt").on('click', function (){ 
      focusedZone="Montlhéry";
      newLocation(48.643343, 2.270193,14);   
      clearTimeout(rot) ; 
      isClicked = false;
      for (var i = 0; i < 5 ; i++) { 
          clearTimeout(arret[i]);
      } 
    });
  
    $("#rot").on('click', function (){  
      if (isClicked) {
          // Do nothing
      } 
      else {              
        isClicked = true;
        var rotation = function(){  
          arret[0]=setTimeout(function() { newLocation(48.1293954,2.556663,6); },1000);        
          arret[1]=setTimeout(function() { newLocation(48.866667,2.333333,10); },5000);    
          arret[2]=setTimeout(function() { newLocation(48.591934, 0.890153,14); },9000);
          arret[3]=setTimeout(function() { newLocation(47.484504, 6.803817,14); },13000);
          arret[4]=setTimeout(function() { newLocation(48.643343, 2.270193,14); },17000);
        }
        rotation();

        rot=setInterval(function(){  
            rotation();
        },21000); 
      }
    });
  });
}
  
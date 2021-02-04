// JavaScript source code
function addreports(url) {
    $.get(url,function(data) {
    alert( data );
    });

}

$(document).on({
    ajaxStart: function () { $("body").addClass("loading"); },
    ajaxStop: function () {
        $("body").removeClass("loading");}
    
});
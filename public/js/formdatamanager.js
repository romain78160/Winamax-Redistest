function savedata() {


    var site = document.getElementsByName("site");
    sessionStorage.setItem("site", site[0].value);

    var dateR = document.getElementsByName("dateR");
    sessionStorage.setItem("dateR", dateR[0].value);

    var shift = document.getElementsByName("shift");
    sessionStorage.setItem("shift", shift[0].value);

    var RU = document.getElementsByName("RU");
    sessionStorage.setItem("RU", RU[0].value);

    var nom = document.getElementsByName("nom");
    sessionStorage.setItem("nom", nom[0].value);

    var prenom = document.getElementsByName("prenom");
    sessionStorage.setItem("prenom", prenom[0].value);



    return true;
}
window.onload = function () {

    var site = sessionStorage.getItem("site");
    if (site !== 'undefined') $("[name='site']").val(site);

    var dateR = sessionStorage.getItem("dateR");
    if (dateR !== 'undefined') $("[name='dateR']").val(dateR);

    var shift = sessionStorage.getItem("shift");
    if (shift !== 'undefined') $("[name='shift']").val(shift);

    var RU = sessionStorage.getItem("RU");
    if (RU !== 'undefined') $("[name='RU']").val(RU);

    var nom = sessionStorage.getItem("nom");
    if (nom !== 'undefined') $("[name='nom']").val(nom);

    var prenom = sessionStorage.getItem("prenom");
    if (prenom !== 'undefined') $("[name='prenom']").val(prenom);
}
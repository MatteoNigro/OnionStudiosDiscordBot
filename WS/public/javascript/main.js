//#region TOGGLE MEMBER SECTIONS

let membersH = [];
$("[id*=memberH]").each(function () {
    membersH.push(this);
});



let membersQ = [];
$("[id*=memberQ]").each(function () {
    membersQ.push(this);
});


for (let i = 0; i < membersH.length; i++) {
    let header = membersH[i];
    let div = membersQ[i];

    header.onmousedown = function () {
        div.style.display == "none" ? div.style.display = "block" : div.style.display = "none";
    }

}







/*
var member1 = document.getElementById("member");

member1.onmousedown = function () {
    var div = document.getElementById("memberDiv");
    div.style.display == "none" ? div.style.display = "block" : div.style.display = "none";
}



var member2 = document.getElementById("member2")

member2.onmousedown = function () {
    var div = document.getElementById("member2Div");
    div.style.display == "none" ? div.style.display = "block" : div.style.display = "none";
}

var member3 = document.getElementById("member3")

member3.onmousedown = function () {
    var div = document.getElementById("member3Div");
    div.style.display == "none" ? div.style.display = "block" : div.style.display = "none";
}

var member4 = document.getElementById("member4")

member4.onmousedown = function () {
    var div = document.getElementById("member4Div");
    div.style.display == "none" ? div.style.display = "block" : div.style.display = "none";
}*/
//#endregion
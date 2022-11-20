function getCookie(name){
    var value = "";
    try{
        value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1];
        return value;
    }catch(err){
        return false
    }
}
function checkCookie() {
    var username = "";
    if(getCookie("username") == false)
    {
        window.location = "login.html";
    }
}

checkCookie();
window.onload = pageLoad;

function pageLoad(){
    document.getElementById("displayPic") = fileUpload;
    document.getElementById("fileField").onchange = fileSubmit
    ;
    var username = getCookie("username");
    document.getElementById("username").innerHTML = username;

    console.log(getCookie('img'));
    showImg('img/'+ getCookie('img'));


}

function fileUpload(){
    document.getElementById("fileField").click();
}

function fileSubmit(){
    document.forms.namedItem("formId").submit();
}

function showImg(filename){
    if(filename !==""){
        var showpic = document.getElementById('displayPic');
        showpic.innerHTML ="";
        var temp = document.createElement('img');
        temp.src = filename;
        showpic.appendChild(temp);
    }
}
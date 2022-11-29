function getCookie(name){
    var value = "";
    try{
        value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1];
        return value;
    }catch(err){
        return false
    }
}
window.onload = pageLoad;

function pageLoad(){
    var name = getCookie('username');
    document.getElementById('username').innerHTML = name;
    showImg('img/'+ getCookie('img'));
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

function username(){
    
}
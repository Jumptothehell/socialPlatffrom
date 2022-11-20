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
    alert("Hi");
    document.getElementById("displayPic").onclick = fileUpload;
    document.getElementById("fileField").onchange = fileSubmit;

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

async function readPost(){
    let read_ = await fetch('/readPost')
    let content = await read_.json();
    showPost(content);
}

function showPost(data){
	var keys = Object.keys(data);
	var divTag = document.getElementById("feed-container");
	divTag.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) {
		var temp = document.createElement("div");
		temp.className = "newsfeed";
		divTag.appendChild(temp);
		var temp1 = document.createElement("div");
		temp1.className = "postmsg";
		temp1.innerHTML = data[keys[i]].post;
		// console.log(data[keys[i]].post);
		// console.log(data[i].post);
		temp.appendChild(temp1);
		var temp1 = document.createElement("div");
		temp1.className = "postuser";
		
		temp1.innerHTML = "Posted by: "+ data[keys[i]].username;
		// console.log(data[keys[i]].username);
		temp.appendChild(temp1);
		
	}
}
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
    document.getElementById("postbutton").onclick = getData;

    document.getElementById("displayPic").onclick = fileUpload;
    document.getElementById("fileField").onchange = fileSubmit;

    var username = getCookie("username");
    document.getElementById("username").innerHTML = username;

    console.log(getCookie('img'));
    showImg('img/'+ getCookie('img'));
    readPost();
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

function getData(){
    var msg = document.getElementById("textmsg").value;
    document.getElementById("textmsg").value = "";
    writePost(msg);
}

async function readPost(){
    let read_ = await fetch('/readPost')
    let content = await read_.json();
    showPost(content);
}

async function writePost(msg){
    let datetime = new Date();

    let postout = await fetch('/writePost', {
        method: "POST",
        headers: {
            'Accept': 'application/sjson',
			'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: getCookie("username"),
            msg: msg,
            time: datetime
        })
    });
    let content = await postout.json();
    showPost(content);
    console.log(content)
}

function showPost(data){
	var keys = Object.keys(data);
	var divTag = document.getElementById("feed-container");
	divTag.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) {
		var temp = document.createElement("form");
		temp.className = "form";
        temp.action = "/lovedPost";
        temp.method = "post";
        temp.acceptCharset = "utf-8";
        temp.id = "newsfeed" + [i];
		divTag.appendChild(temp);

		var temp1 = document.createElement("div");
		temp1.className = "postmsg";
		temp1.innerHTML = data[keys[i]].msg;
		temp.appendChild(temp1);
		var temp1 = document.createElement("div");
		temp1.className = "postuser";
		temp1.innerHTML = "Posted by: "+ data[keys[i]].username;
		temp.appendChild(temp1);

        var isoDate = data[keys[i]].time;
        var date = new Date(isoDate);
        var options = {
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        };
        var d = date.toLocaleDateString('en-US', options);
        var temp2 = document.createElement("div");
        temp2.className = "posttime";        
        temp2.innerHTML = d;
        temp.appendChild(temp2);

		var temp3 = document.createElement("button");
        temp3.type = "submit";
        temp3.classList.add("nav_", "unloved");
        temp3.id = "nav-love" + [i];
        temp3.setAttribute("onclick", "IsClicked(this.id)");

        var temp4 = document.createElement("div");
        temp4.id = "Icon-love";
        temp4.innerHTML = '<i class="ri-heart-line"></i>' + " ";
        temp3.appendChild(temp4);
        
        temp.appendChild(temp3);
	}
}

function IsClicked(clickedID){
    let name = "#" + clickedID;

    let getLoved = document.querySelector(name);
    let countloved = getLoved.querySelector("#Icon-love");
    // console.log(getLoved.parentNode.id);

    getLoved.classList.toggle("loved");

    if(getLoved.className == "nav_ unloved")
    {
        countloved.innerHTML = '<i class="ri-heart-line"></i>'
    }else{
        countloved.innerHTML = '<i class="ri-heart-fill"></i>'
    }
}
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
    let options = {
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    };
    let d = datetime.toLocaleDateString('en-US', options);
    // console.log(d);
    let postout = await fetch('/writePost', {
        method: "POST",
        headers: {
            'Accept': 'application/sjson',
			'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: getCookie("username"),
            msg: msg,
            time: d
        })
    });
    let content = await postout.json();

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
		temp1.innerHTML = data[keys[i]].msg;
		temp.appendChild(temp1);
		var temp1 = document.createElement("div");
		temp1.className = "postuser";
		temp1.innerHTML = "Posted by: "+ data[keys[i]].username;
		temp.appendChild(temp1);

        let isoDate = data[keys[i]].time;
        let date = new Date(isoDate);
        let options = {
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        };
        let d = date.toLocaleDateString('en-US', options);
        console.log(d);
        var temp2 = document.createElement("div");
        temp2.className = "posttime";        
        temp2.innerHTML = d;
        temp.appendChild(temp2);

		var temp3 = document.createElement("div");
		temp3.className = "likebt"
		
	}
}
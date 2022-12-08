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

    var navMenu = document.getElementById('nav-menu')
    var navToggle = document.getElementById('nav-toggle')
    var navClose = document.getElementById('nav-close')

    ShowMenu(navToggle, navMenu);
    HiddenMenu (navClose, navMenu);

    var navLink = document.querySelectorAll('.nav__link')

    const linkAction = () =>{
        const navMenu = document.getElementById('nav-menu')
        // When we click on each nav__link, we remove the show-menu class
        navMenu.classList.remove('show-menu')
    }
    navLink.forEach(n => n.addEventListener('click', linkAction))
    
    console.log(getCookie('img'));
    showImg('img/'+ getCookie('img'));
    readPost();
}
/*===== MENU SHOW =====*/
function ShowMenu (navToggle, navMenu) {
    if(navToggle){
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu')        
        })
    }
}

/*===== MENU HIDDEN =====*/
function HiddenMenu (navClose, navMenu) {
    if(navClose){
        navClose.addEventListener('click', () =>{
            navMenu.classList.remove('show-menu')
        })
    }
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

    let favcontent =  await readfavPost();
    showPost(content, favcontent);
}

async function readfavPost(){
    let readfav_ = await fetch('/readlovePost')
    let content = await readfav_.json();

    return content;
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
    let favcontent = await readfavPost();

    showPost(content, favcontent);
}


async function favPost(postid, loved){
    await fetch('/lovePost', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
		    'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                userid: getCookie('userid'),
                postid: postid,
                loved: loved
            }
        )
    })
    // let lovedPost = await fetch('/lovePost', {
    //     method: "POST",
    //     headers: {
    //         'Accept': 'application/json',
	// 	    'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(
    //         {
    //             userid: getCookie('userid'),
    //             postid: postid,
    //             loved: loved
    //         }
    //     )
    // });
    // let favcontent = await lovedPost.json();
    // let content = await postout.json();
}

function showPost(data, favdata){
	var keys = Object.keys(data);
	var divTag = document.getElementById("feed-container");
	divTag.innerHTML = "";
    for (var i = keys.length-1; i >=0 ; i--){
        var feeds = document.createElement('div');
        feeds.className ='newfeeds'
        feeds.id = 'newfeeds__' + [i];
        divTag.appendChild(feeds);

        var posteruser = document.createElement('span');
        posteruser.className = 'postuser';
        posteruser.innerHTML = "Poster: " + data[keys[i]].username;
        feeds.appendChild(posteruser);

        var msg = document.createElement('div');
        msg.className = 'poster__msg';
        msg.innerHTML = data[keys[i]].msg;
        feeds.appendChild(msg);

        var isoDate = data[keys[i]].time;
        var d = new Date(isoDate);
        var options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        var datetime = d.toLocaleDateString('en-US', options);
        var time = document.createElement('div');
        time.className = 'posttime';
        time.innerHTML = datetime;
        feeds.appendChild(time);

        var heart = document.createElement('button');
        heart.className = 'fav__';
        heart.id = 'loved' + i;
        heart.value = i + 1;
        heart.setAttribute("onclick", "IsClicked(this.id, this.value)");
        if(favdata[i].userid == getCookie('userid')){
            if(favdata[i].loved == 0){
                heart.innerHTML = '<img height="26" width="26" src="img/heart-3-line.svg">';
            }
            else {
                heart.innerHTML = '<img height="26" width="26" src="img/heart-3-fill.svg">';
            }
        }else{
            heart.innerHTML = '<img height="26" width="26" src="img/heart-3-line.svg">';

        }
        feeds.appendChild(heart);
    }
}

function IsClicked(clickedID, postid){
    let name = "#" + clickedID;
    let loved = new Boolean();

    let getLoved = document.querySelector(name);

    getLoved.classList.toggle('loved');
    if(getLoved.className == "fav__")
    {
        loved = 0; //false;
        getLoved.innerHTML = '<img height="26" width="26" src="img/heart-3-line.svg">';
        favPost(postid, loved);
    }else{
        loved = 1; //true;
        getLoved.innerHTML = '<img height="26" width="26" src="img/heart-3-fill.svg">';
        favPost(postid, loved);
    }
}
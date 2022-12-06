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
    var username = getCookie("username");
    document.getElementById("user-name").innerHTML = username;

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
    readdata();
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

function showImg(filename){
    if(filename !==""){
        console.log("show");
        var showpic = document.getElementById('profile-pic');
        showpic.innerHTML ="";
        var temp = document.createElement('img');
        temp.src = filename;
        showpic.appendChild(temp);
    }
}

async function readdata(){
    let read_ = await fetch('/userdata')
    let content = await read_.json();

    showdata(content);
}

async function showdata(data){
    var keys = Object.keys(data);
    console.log(keys.length);
    console.log(data[keys[0]]);
    var firstname = document.getElementById('firstname')
    firstname.innerHTML = data[keys[0]].firstname;
    var lastname = document.getElementById('lastname')
    lastname.innerHTML = data[keys[0]].lastname;

    var isoDate = data[keys[0]].birthday;
    var d = new Date(isoDate);
    var options = {
        day: 'numeric',
        year: 'numeric',
        month: 'long'
    };
    var datetime = d.toLocaleDateString('en-US', options);
    var birthday = document.getElementById('birthday')
    birthday.innerHTML = datetime;
}
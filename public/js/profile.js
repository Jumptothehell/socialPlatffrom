window.onload = pageLoad;

function pageLoad(){
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
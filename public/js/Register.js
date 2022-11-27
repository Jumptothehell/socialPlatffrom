window.onload = pageLoad;
function pageLoad(){
	var form = document.getElementById("myForm");
    form.onsubmit = validateForm;
}

var person = {
    firstname: "" ,
    lastname: "" ,
    gender: "" ,
    birth: "" ,
    email: "" ,
    username: "" ,
    password: "" ,
    password_RE: "" ,
};

function validateForm() {
    SetPerson();
    if(person.firstname == "" || person.lastname == "")
    {
        alert("your firstname bro?");
        return false;
    }
    else if( password != password_RE)
    {
        alert("your password wrong bro");
        return false
    }
    else
    {
        alert("All complete");
        return true;
    }
    //ถ้าตรวจสอบแล้วว่ามีการ register ไม่ถูกต้องให้ return false ด้วย
}

/*function FormDocument(){
    SetPerson();
}*/

function SetPerson(){
    person.firstname = document.forms["myForm"]["firstname"].value;
    person.lastname = document.forms["myForm"]["lastname"].value;
    person.gender = document.forms["myForm"]["gender"].value;
    person.birth = document.forms["myForm"]["birth"].value;
    person.email = document.forms["myForm"]["email"].value;
    person.username = document.forms["myForm"]["username"].value;
    person.password = document.forms["myForm"]["password"].value;
    person.password_RE = document.forms["myForm"]["REpassword"].value;
}
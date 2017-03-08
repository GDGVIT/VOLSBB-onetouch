
function login(username, passcode) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST","http://phc.prontonetworks.com/cgi-bin/authlogin",true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("userId="+username+"&password="+passcode+"&serviceName=ProntoAuthentication&Submit22=Login");
    xmlhttp.onreadystatechange=() => {

    }
  console.log(xmlhttp.status)
}

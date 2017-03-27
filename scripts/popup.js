
var regno=document.getElementById('regno');
var pass=document.getElementById('pass');

function statusCheck() {
    return new Promise((resolve, reject) => {
            let xmlhttp = new XMLHttpRequest()
            xmlhttp.open('GET', 'http://phc.prontonetworks.com/cgi-bin/authlogin', true)
    xmlhttp.send()
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.status == 200) {
            let status = new RegExp(/You are already logged in/i)
            console.log(xmlhttp.responseText);
            console.log(status.test(xmlhttp.responseText));
            resolve(status.test(xmlhttp.responseText) === true)
        } else {
            reject('something went wrong')
        }
    }
})
}
var port = chrome.runtime.connect({name: "OneTouch"});
port.onMessage.addListener(function(msg) {
    var processFormStatus=function(d,type){
        return $('<p style="line-height: 15px;font-size: 15px;" class="center-align"><i style="line-height: 15px;font-size:18px;" class="material-icons">'+type+'</i>'+d+'</p>');
    };
    if (msg.isData)
    {
    	if(msg.status)
        $('.loading_wrapper').addClass('hide');
        $('.logout_wrapper').removeClass('hide');
        $('#heading').text('Logged in');
    }
    else if (msg.isData==false)
    {
        console.log(msg.reason);
        $('#graph').addClass('hide');
        $('.loading_wrapper').addClass('hide');
        if(msg.reason!='logout'&&msg.reason!=undefined)
            Materialize.toast(processFormStatus(msg.reason,msg.type), 2000,'center-align');
        else if(msg.Reg!=undefined&&msg.Pwd!=undefined){
            document.getElementById('regno').value=msg.Reg;
            document.getElementById('pass').value=msg.Pwd;
        }
        $('.login_wrapper').removeClass('hide');
        $('#heading').text("My VIT - Login");
        $('#status').text("Logging In");
    }
});



$('#lbutton').click(function () {
    $('.login_wrapper').addClass('hide');
    $('.loading_wrapper').removeClass('hide');
    $('#heading').text('');
	login(regno,pass).then(function (resDat) {
		if(resDat.status==1||resDat.status==4){
            $('.loading_wrapper').addClass('hide');
            $('.logout_wrapper').removeClass('hide');
            $('#heading').text('Logged in');
		}
		else if(resDat.status==2){
            $('.loading_wrapper').addClass('hide');
            $('.logout_wrapper').removeClass('hide');
            $('#heading').text('Quota is over !');
		}
    });
});
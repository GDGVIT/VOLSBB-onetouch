var isdata,Data,Port,portStat=false,text = '';
var getData=function () {
    chrome.storage.local.get(function (result) {
        isdata = !$.isEmptyObject(result);
        var reg = result.Reg;
        var pass = result.Pwd;
        if (isdata) login(reg, pass).then(function (resDat) {
            if (resDat.status == 1 || resDat.status == 4 || resDat.status == 3) {
                Data = 'Logged in';
                if (portStat) {
                    Port.postMessage({isData: isdata, msg: Data});
                }
            }
            else if (resDat.status == 2) {
                if (portStat) {
                    Port.postMessage({isData: isdata, msg: 'Quota is over !'});
                }
            }
        });
    });
};
var setData=function (r,p) {
    chrome.storage.local.set({'Reg':r,'Pwd':p});
};
var clearData=function() {
    chrome.storage.local.clear();
    Data=undefined;
    isdata=undefined;
};

$(function () {
    getData();
});

function login(username, passcode) {
   return new Promise(function(resolve, reject) {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.open('POST','http://phc.prontonetworks.com/cgi-bin/authlogin',true)
        xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded')
        xmlhttp.send('userId='+username+'&password='+passcode+'&serviceName=ProntoAuthentication&Submit22=Login')
        xmlhttp.onreadystatechange=() => {
            if (xmlhttp.readyState==4 && xmlhttp.status == 200) {
                let congratulation = new RegExp(/Successful Pronto Authentication/i)
                let quotaOver = new RegExp(/quota is over/i)
                let alreadyLogged = new RegExp(/already logged/i)
                text = xmlhttp.responseText
                console.log(congratulation.test(text));
                if (congratulation.test(text)) {
                     resolve({status: 1})
                } else if (quotaOver.test(xmlhttp.responseText)) {
                    resolve({status: 2})
                } else if(alreadyLogged.test(xmlhttp.responseText)) {
                    resolve({status: 3})
                } else {
                    resolve({status: 4})
                }
            }
        }
   })
}
function logout() {
    return new Promise(function(resolve, reject) {
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.open('GET','http://phc.prontonetworks.com/cgi-bin/authlogout',true)
        xmlhttp.send()
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.status == 200) {
                resolve(true)
            } else {
                resolve(false)
            }
        }
    })
}

chrome.runtime.onConnect.addListener(function(port) {
    if(port.name == "OneTouch")
    {
        Port=port;
        portStat=true;
        port.postMessage({isData:isdata,msg:Data});
        port.onMessage.addListener(function(msg){
            if (msg.req=="Set-Reg-Pass")
            {
                setData(msg.Reg,msg.Pwd);
                getData();
            }
            else if (msg.req == "logout")
            {
                clearData();
                logout().then(function (status) {
                    if(status)
                        port.postMessage({isData:false,reason:'logout'});
                });
            }
        });
    }
});

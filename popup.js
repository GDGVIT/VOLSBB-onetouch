let text = ''
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

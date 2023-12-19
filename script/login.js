var tst = null;
document.getElementById('form').onsubmit = function(event) {
    console.log('ログイン試行中');
    var btn = document.getElementById('btn');
    btn.textContent = "ログイン試行中";
    btn.disabled = true;
    const request = new XMLHttpRequest();

    const BASE_URL = 'http://54.64.10.17:8080/api';
    const form = document.getElementById('form');

    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(form.pw.value + "@alckrt");
    var hashed_pw = shaObj.getHash("HEX");

    request.open('post', BASE_URL + '/users/login/');

    var obj = {
        login_id: form.id.value,
        password: hashed_pw
    }

    var json = JSON.stringify(obj);

    console.log(json);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(json);

    request.addEventListener('readystatechange', () => {
        if(request.readyState === 4) {
            resJson = JSON.parse(request.response);
            if(request.status !== 200) {
                console.log(resJson);
                console.log(resJson['err']['msg']);
                document.getElementById('msg').textContent = resJson['err']['msg'];
                btn.textContent = "ログイン";
                btn.disabled = false;            
            } else {
                console.log(resJson);
                console.log('Hello, ' + resJson['displayname']);
                localStorage.setItem('u_id', resJson.id);
                localStorage.setItem('u_loginid', resJson.login_id);
                localStorage.setItem('u_displayname', resJson.displayname);
                localStorage.setItem('u_icon', resJson.icon);
                window.location.href = "./userpage.html";
            }
        }
    })
    event.preventDefault();
}
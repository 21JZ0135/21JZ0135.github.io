window.addEventListener("load", () => {
    if(localStorage.getItem('u_id') === null) {
        window.location.href = "./login.html";
    } else {
        document.getElementById('username').textContent = localStorage.getItem('u_loginid') + 'を編集中';
    }
});

document.getElementById('delicon').onchange = function() {
    var delIcon = document.getElementById('delicon');
    if (delIcon.checked) {
        document.getElementById('icon').disabled = true;
    } else {
        document.getElementById('icon').disabled = false;
    }
}

function btnChange() {
    var icon = document.getElementById('icon');
    var resIcon = document.getElementById('delicon');
    if(typeof icon.files[0] !== 'undefined' && !resIcon.checked && icon.files[0].type.indexOf('image/') === -1) {
        btn.textContent = 'アイコンファイルは画像を指定してください';
        btn.disabled = true;
    } else {
        btn.textContent = '編集確定';
        btn.disabled = false;
    }
}

document.getElementById('icon').onchange = btnChange();
document.getElementById('delicon').onchange = btnChange();

document.getElementById('edit').onsubmit = function(event) {
    event.preventDefault();
    console.log('ユーザー' + localStorage.getItem('u_loginid') + 'の情報を変更開始');
    var form = document.getElementById('edit');
    var btn = document.getElementById('btn');
    btn.textContent = '情報変更処理中';
    btn.disabled = true;

    var editobj = {};
    base64 = '';
    
    if (form.loginid.value !== '') {
        editobj.login_id = form.loginid.value;
    }

    if (form.pw.value !== '') {
        var shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.update(form.pw.value + '@alckrt');
        editobj.password = shaObj.getHash('HEX');
    }

    if (form.dpname.value !== '') {
        editobj.displayname = form.dpname.value;
    }

    if (form.delicon.checked) {
        editobj.icon = ''
    } else if (form.icon.value !== '') {
        const file = form.icon.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', e => {
            baseContent = reader.result;
            base64 = baseContent.split(',')[1];
            editobj.icon = base64;
            console.log(editobj);
            console.log('リーダー処理終了');
            putUpdate(editobj);
        });
        reader.readAsDataURL(file);
    }

    if (form.mail.value !== '') {
        editobj.mailaddress = form.mail.value;
    }
    if (form.delicon.checked || form.icon.value === '') {
        console.log(editobj);
        putUpdate(editobj);
    }
    console.log('処理終了');
}

function resetIcon() {
    document.getElementById('edit').icon.value = '';
    btn.textContent = '編集確定';
    btn.disabled = false;
}

function putUpdate(obj) {
    console.log('putUpdate 実行');
    const request = new XMLHttpRequest();

    const BASE_URL = 'http://54.64.10.17:8080/api';
    var json = JSON.stringify(obj);

    request.open('put', BASE_URL + '/users/update/' + localStorage.getItem('u_loginid'));
    console.log('送信先: ' + BASE_URL + '/users/update/' + localStorage.getItem('u_loginid'));

    console.log(json);
    request.setRequestHeader('Content-Type', 'application/json');
    console.log('通信開始');
    request.send(json);

    request.addEventListener('readystatechange', () => {
        if(request.readyState === 4) {
            resJson = JSON.parse(request.response);
            if(request.status !== 200) {
                console.log('通信失敗');
                console.log(resJson['err']['msg']);
                document.getElementById('msg').textContent = resJson['err']['msg'];
                document.getElementById('btn').textContent = '編集確定';
                document.getElementById('btn').disabled = false;
            } else {
                console.log('通信成功');
                localStorage.setItem('u_loginid', resJson.login_id);
                localStorage.setItem('u_displayname', resJson.displayname);
                localStorage.setItem('u_icon', resJson.icon);
                document.getElementById('username').textContent = localStorage.getItem('u_loginid') + 'を編集中';
                document.getElementById('msg').textContent = 'UPDATE COMPLETED.';
                document.getElementById('btn').textContent = '編集確定';
                document.getElementById('btn').disabled = false;
            }
        }
    })
}
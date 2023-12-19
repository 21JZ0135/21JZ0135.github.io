document.getElementById('img').onchange = function() {
    if(typeof pic.files[0] !== 'undefined' && pic.files[0].type.indexOf('image/') === -1) {
        btn.textContent = '正しい画像ファイルを選択してください';
        btn.disabled = true;
    } else {
        btn.textContent = '編集確定';
        btn.disabled = false;
    }
};

function resetImg() {
    document.getElementById('edit').img.value = '';
    btn.textContent = '編集確定';
    btn.disabled = false;
}

document.getElementById('noedit').onchange = function() {
    var noedit = document.getElementById('noedit');
    if(noedit.checked) {
        document.getElementById('memo').disabled = true;
    } else {
        document.getElementById('memo').disabled = false;
    }
}

function htmlEscape(str) {
    if(str !== null) {
        return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/`/g, '&#x60;')
        .replace(/'/g, "&#039;");
    } else {
        return str;
    }
}

window.addEventListener("load", () => {
    if(localStorage.getItem('u_id') === null) {
        window.location.href = "./login.html";
    } else {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const id = params.get('id');

        if(id === null) {
            document.getElementById('msg').textContent = 'クエリパラメータが存在しません。検索できませんでした。';
            formAllDisabled();            
        } else {
            const request = new XMLHttpRequest();
    
            const ADDRESS = 'http://54.64.10.17:8080/';
            const BASE_URL = ADDRESS + 'api';
    
            request.open('get', BASE_URL + '/mylist/search?id=' + localStorage.getItem('u_loginid'));
    
            console.log('通信開始');
            console.log('通信先：' + BASE_URL + '/mylist/search?id=' + localStorage.getItem('u_loginid'));
    
            request.send();
    
            request.addEventListener('readystatechange', () => {
                if(request.readyState === 4) {
                    resJson = JSON.parse(request.response);
                    if(request.status !== 200) {
                        console.log(resJson);
                        console.log(resJson['err']['title']);
                        document.getElementById('msg').textContent = '検索中にエラーが発生しました';
                        formAllDisabled();
                    } else {
                        document.getElementById('msg').textContent = '変更対象：';
                        console.log(resJson);
                        console.log(Object.keys(resJson).length);
                        var table = document.getElementById('target');
                        for (let i = 0; i < Object.keys(resJson).length; i++) {
                            if(resJson[i]['id'] == id) {
                                if(resJson[i]['user_id'] == localStorage.getItem('u_id')) {
                                    var row = table.insertRow(-1);
                                    row.id = resJson[i]['id'];
                                    
                                    var name = row.insertCell(-1);
                                    var image = row.insertCell(-1);
                                    var memo = row.insertCell(-1);
                                    
                                    name.innerHTML = htmlEscape(resJson[i]['name']);
                                    image.innerHTML = `<img src="` + ADDRESS + 'storage/images/' + resJson[i]['image'] + `" alt="Alcohol Image" width="100" height="100">`;
                                    memo.innerHTML = htmlEscape(resJson[i]['memo']);
                                } else {
                                    document.getElementById('msg').textContent = '変更対象IDの持ち主が現在ログイン中のユーザではありません。検索できませんでした。';
                                    formAllDisabled();
                                }
                                break;
                            }

                            if(i === Object.keys(resJson).length - 1) {
                                formAllDisabled();
                                document.getElementById('msg').textContent = '対象のマイリストが見つかりませんでした。';
                            }
                        }
                    }
                }
            })
        }
    }
});

document.getElementById('edit').onsubmit = function(event) {
    event.preventDefault();
    const url = new URL(window.location.href);
    const params = url.searchParams;

    var form = document.getElementById('edit');
    var btn = document.getElementById('btn');
    btn.textContent = '変更処理中';
    btn.disabled = true;

    var editobj = {
        "id": params.get('id')
    };
    base64 = '';

    if(form.name.value !== '') {
        editobj.name = form.name.value;
    }

    if(!form.noedit.checked) {
        if(form.memo.value === '') {
            editobj.memo = null;
        } else {
            editobj.memo = form.memo.value;
        }
    }

    if (form.img.value !== '') {
        const file = form.img.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', e => {
            baseContent = reader.result;
            base64 = baseContent.split(',')[1];
            editobj.img = base64;
            console.log(editobj);
            console.log('リーダー処理終了');
            putUpdate(editobj);
        });
        reader.readAsDataURL(file);
    }

    if (form.img.value === '') {
        console.log(editobj);
        putUpdate(editobj);
    }
}

function putUpdate(obj) {
    console.log('putUpdate 実行');
    const request = new XMLHttpRequest();

    const BASE_URL = 'http://54.64.10.17:8080/api';
    var json = JSON.stringify(obj);

    request.open('put', BASE_URL + '/mylist/update/');
    console.log('送信先: ' + BASE_URL + '/mylist/update/');

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
                document.getElementById('msg').textContent = 'UPDATE COMPLETED.';
                document.getElementById('btn').textContent = '編集確定';
                document.getElementById('btn').disabled = false;
            }
        }
    })
}

function formAllDisabled() {
    const formForquery = document.querySelectorAll('#edit input,#edit button');

    formForquery.forEach(e => {
        e.disabled = true;
    });
}
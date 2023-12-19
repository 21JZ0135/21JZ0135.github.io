function editBtnClicked(obj) {
    id = obj.parentNode.parentNode.id;
    window.location.href = "./editHistory.html?id=" + id;
}

function deleteBtnClicked(obj) {
    if(window.confirm("この履歴を削除します。\n本当によろしいですか？")) {
        const request = new XMLHttpRequest();
        const BASE_URL = 'http://54.64.10.17:8080/api';
        const id = obj.parentNode.parentNode.id;

        var delObj = {
            "history_id" : id,
            "user_id" : localStorage.getItem('u_loginid')
        }
        var json = JSON.stringify(delObj);

        request.open('delete', BASE_URL + '/history/destroy');
        console.log('送信先: ' + BASE_URL + '/history/destroy');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(json);

        request.addEventListener('readystatechange', () => {
            if(request.readyState === 4) {
                if(request.status !== 204) {
                    resJson = JSON.parse(request.response);
                    console.log('通信失敗');
                    console.log(resJson['err']['msg']);
                    window.alert('以下の理由でエラーが発生しました：\n' + resJson['err']['msg']);
                } else {
                    location.reload();
                }
            }
        })
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
        document.getElementById('title').textContent = localStorage.getItem('u_loginid') + 'の飲酒履歴を取得中です\nしばらくお待ちください・・・';
        const request = new XMLHttpRequest();

        const ADDRESS = 'http://54.64.10.17:8080/';
        const BASE_URL = ADDRESS + 'api';

        request.open('get', BASE_URL + '/history/search?id=' + localStorage.getItem('u_loginid'));

        console.log('通信開始');
        console.log('通信先：' + BASE_URL + '/history/search?id=' + localStorage.getItem('u_loginid'));

        request.send();

        request.addEventListener('readystatechange', () => {
            if(request.readyState === 4) {
                resJson = JSON.parse(request.response);
                if(request.status !== 200) {
                    console.log(resJson);
                    console.log(resJson['err']['title']);
                    document.getElementById('msg').textContent = '飲酒履歴取得中にエラーが発生しました';
                } else {
                    console.log(resJson);
                    console.log(Object.keys(resJson).length);
                    var table = document.getElementById('history');
                    for (let i = 0; i < Object.keys(resJson).length; i++) {
                        var row = table.insertRow(-1);
                        row.id = resJson[i]['id'];
                        
                        var name = row.insertCell(-1);
                        var image = row.insertCell(-1);
                        var memo = row.insertCell(-1);
                        var date = row.insertCell(-1);
                        var editbtn = row.insertCell(-1);

                        name.innerHTML = htmlEscape(resJson[i]['name']);
                        image.innerHTML = `<img src="` + ADDRESS + 'storage/images/' + resJson[i]['image'] + `" alt="Alcohol Image" width="100" height="100">`;
                        memo.innerHTML = htmlEscape(resJson[i]['memo']);
                        date.innerHTML = resJson[i]['date'];
                        editbtn.innerHTML = `<button type="button" onclick="editBtnClicked(this)">編集</button><button type="button" onclick="deleteBtnClicked(this)">削除</button>`
                        document.getElementById('title').textContent = localStorage.getItem('u_loginid') + 'の飲酒履歴';
                    }
                }
            }
        })
    }
});
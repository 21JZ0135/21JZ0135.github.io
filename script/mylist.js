function editBtnClicked(obj) {
    id = obj.parentNode.parentNode.id;
    window.location.href = "./editMylist.html?id=" + id;
}

function deleteBtnClicked(obj) {
    if(window.confirm("このマイリストを削除します。\n本当によろしいですか？")) {
        const request = new XMLHttpRequest();
        const BASE_URL = 'http://54.64.10.17:8080/api';
        const id = obj.parentNode.parentNode.id;

        var delObj = {
            "mylist_id" : id,
            "user_id" : localStorage.getItem('u_loginid')
        }
        var json = JSON.stringify(delObj);

        request.open('delete', BASE_URL + '/mylist/destroy');
        console.log('送信先: ' + BASE_URL + '/mylist/destroy');
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

function searching() {
    var tbl = document.getElementById('mylist');
    var search_value = document.getElementById('search').value
    var search_type = document.getElementById('search_type').value

    if(search_value !== '') {
        switch(search_type){
            case 'include':
                for(let i = 1; i < tbl.rows.length; i++) {
                    if(tbl.rows[i].cells[0].textContent.includes(search_value)) {
                        tbl.rows[i].style.display = '';
                    } else {
                        tbl.rows[i].style.display = 'none';
                    }
                }
                break;
            case 'start':
                for(let i = 1; i < tbl.rows.length; i++) {
                    if(tbl.rows[i].cells[0].textContent.startsWith(search_value)) {
                        tbl.rows[i].style.display = '';
                    } else {
                        tbl.rows[i].style.display = 'none';
                    }
                }
                break;
            case 'end':
                for(let i = 1; i < tbl.rows.length; i++) {
                    if(tbl.rows[i].cells[0].textContent.endsWith(search_value)) {
                        tbl.rows[i].style.display = '';
                    } else {
                        tbl.rows[i].style.display = 'none';
                    }
                }
                break;
            default:
                for(let i = 1; i < tbl.rows.length; i++) {
                    tbl.rows[i].style.display = '';
                }
                break;
        }
    } else {
        for(let i = 1; i < tbl.rows.length; i++) {
            tbl.rows[i].style.display = '';
        }
    }
}

document.getElementById('search').addEventListener('input', searching);
document.getElementById('search_type').addEventListener('change', searching);

window.addEventListener("load", () => {
    if(localStorage.getItem('u_id') === null) {
        window.location.href = "./login.html";
    } else {
        document.getElementById('title').textContent = localStorage.getItem('u_loginid') + 'のマイリストを取得中です\nしばらくお待ちください・・・';
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
                    document.getElementById('msg').textContent = 'マイリスト取得中にエラーが発生しました';
                } else {
                    console.log(resJson);
                    console.log(Object.keys(resJson).length);
                    var table = document.getElementById('mylist');
                    for (let i = 0; i < Object.keys(resJson).length; i++) {
                        var row = table.insertRow(-1);
                        row.id = resJson[i]['id'];
                        
                        var name = row.insertCell(-1);
                        var image = row.insertCell(-1);
                        var memo = row.insertCell(-1);
                        var editbtn = row.insertCell(-1);

                        // name.innerHTML = htmlEscape(resJson[i]['name']);
                        name.innerHTML = `<a href="addHistory.html?id=` + resJson[i]['id'] + `" onclick="window.open('addHistory.html?id=` + resJson[i]['id'] + `', '_blank', 'popup=yes'); return false;">` + htmlEscape(resJson[i]['name']) + `</a>`;
                        image.innerHTML = `<img src="` + ADDRESS + 'storage/images/' + resJson[i]['image'] + `" alt="Alcohol Image" width="100" height="100">`;
                        memo.innerHTML = htmlEscape(resJson[i]['memo']);
                        editbtn.innerHTML = `<button type="button" onclick="editBtnClicked(this)">編集</button><button type="button" onclick="deleteBtnClicked(this)">削除</button>`
                        document.getElementById('title').innerHTML = localStorage.getItem('u_loginid') + 'のマイリスト<br>マイリスト名をクリックで履歴登録画面へ遷移';
                        document.getElementById('search').disabled = false;
                        document.getElementById('search_type').disabled = false;
                    }
                }
            }
        })
    }
});
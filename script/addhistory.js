window.addEventListener("load", () => {
    if(localStorage.getItem('u_id') === null) {
        window.location.href = "./login.html";
    } else {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const id = params.get('id');

        if(id === null) {
            document.getElementById('title').textContent = 'クエリパラメータが存在しません。検索できませんでした。';
            // formAllDisabled();            
        } else {
            const request = new XMLHttpRequest();
    
            const ADDRESS = 'http://54.64.10.17:8080/';
            const BASE_URL = ADDRESS + 'api';

            const form = document.getElementById('form');

            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            now.setSeconds(0);
            now.setMilliseconds(0);
            document.getElementById('datetime').value = now.toISOString().slice(0, -1);
    
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
                        // formAllDisabled();
                    } else {
                        console.log(resJson);
                        console.log(Object.keys(resJson).length);
                        for (let i = 0; i < Object.keys(resJson).length; i++) {
                            if(resJson[i]['id'] == id) {
                                if(resJson[i]['user_id'] == localStorage.getItem('u_id')) {
                                    form.name.value = resJson[i]['name'];
                                    form.img.value = resJson[i]['image'];
                                } else {
                                    document.getElementById('msg').textContent = '変更対象IDの持ち主が現在ログイン中のユーザではありません。検索できませんでした。';
                                    // formAllDisabled();
                                }
                                break;
                            }

                            if(i === Object.keys(resJson).length - 1) {
                                // formAllDisabled();
                                document.getElementById('msg').textContent = '対象のマイリストが見つかりませんでした。';
                            }
                        }
                    }
                }
            })
        }
    }
});

document.getElementById('form').onsubmit = function (event) {
    event.preventDefault();
    var form = document.getElementById('form');
    var btn = document.getElementById('btn');
    btn.textContent = '追加処理中';
    btn.disabled = true;
    var historyobj = {};

    historyobj.name = form.name.value;
    historyobj.image = form.img.value;
    historyobj.date = form.datetime.value;

    if(form.memo.value !== '') {
        historyobj.memo = form.memo.value;
    }

    console.log(historyobj);

    console.log('処理開始');
    const request = new XMLHttpRequest();
    const BASE_URL = 'http://54.64.10.17:8080/api';
    var json = JSON.stringify(historyobj);

    request.open('post', BASE_URL + '/history/store/' + localStorage.getItem('u_loginid'));
    console.log('送信先: ' + BASE_URL + '/history/store/' + localStorage.getItem('u_loginid'));

    console.log(json);
    request.setRequestHeader('Content-Type', 'application/json');
    console.log('通信開始');
    request.send(json);

    request.addEventListener('readystatechange', () => {
        if(request.readyState === 4) {
            resJson = JSON.parse(request.response);
            if(request.status !== 201) {
                console.log('通信失敗');
                console.log(resJson['err']['msg']);
                document.getElementById('msg').textContent = resJson['err']['msg'];
            } else {
                document.getElementById('msg').textContent = 'CREATED!';
            }
            btn.textContent = '登録';
            btn.disabled = false;
        }
    });
}
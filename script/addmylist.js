window.addEventListener("load", () => {
    if(localStorage.getItem('u_id') === null) {
        window.location.href = "./login.html";
    } else {
        document.getElementById('username').textContent = localStorage.getItem('u_loginid') + 'のマイリストにデータを追加します';
    }
});

document.getElementById('pic').onchange = function() {
    var pic = document.getElementById('pic');
    if(typeof pic.files[0] !== 'undefined' && pic.files[0].type.indexOf('image/') === -1) {
        btn.textContent = '正しい画像ファイルを選択してください';
        btn.disabled = true;
    } else {
        btn.textContent = 'マイリストに登録';
        btn.disabled = false;
    }
};

document.getElementById('form').onsubmit = function (event) {
    event.preventDefault();
    console.log(localStorage.getItem('u_loginid') + 'のマイリストに追加を開始');
    var form = document.getElementById('form');
    var btn = document.getElementById('btn');
    btn.textContent = '追加処理中';
    btn.disabled = true;
    var mylistobj = {};

    const file = form.pic.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', e => {
        var baseContent = reader.result;
        var base64 = baseContent.split(',')[1];
        mylistobj.image = base64;
        
        mylistobj.name = form.name.value;
        if(form.memo.value !== '') {
            mylistobj.memo = form.memo.value;
        }

        console.log(mylistobj);

        console.log('処理開始');
        const request = new XMLHttpRequest();
        const BASE_URL = 'http://54.64.10.17:8080/api';
        var json = JSON.stringify(mylistobj);

        request.open('post', BASE_URL + '/mylist/store/' + localStorage.getItem('u_loginid'));
        console.log('送信先: ' + BASE_URL + '/mylist/store/' + localStorage.getItem('u_loginid'));

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
                btn.textContent = 'マイリストに追加';
                btn.disabled = false;
            }
        });
    });
    reader.readAsDataURL(file);
}
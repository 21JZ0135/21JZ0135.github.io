var tst = null;
document.getElementById('form').onsubmit = function(event) {
    const request = new XMLHttpRequest();

    const BASE_URL = 'http://54.64.10.17:8080/api';
    const form = document.getElementById('form');

    request.open('post', BASE_URL + '/test');

    var base64;

    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener('load', e => {
        base64 = reader.result;
        var base64_split = base64.split(',');

        var obj = {
            img: base64_split[1]
        }
    
        var json = JSON.stringify(obj);
        request.setRequestHeader('Content-Type', 'application/json');

        console.log(json);
        request.send(json);

        request.addEventListener('readystatechange', () => {
            if(request.readyState === 4) {
                if(request.status === 200) {
                    console.log('通信成功');
                } else {
                    console.log('通信失敗');
                }
            }
        })
    });
    reader.readAsDataURL(file);
    event.preventDefault();
}
window.addEventListener("load", () => {
    if(localStorage.getItem('u_id') === null) {
        window.location.href = "./login.html";
    } else {
        const STORAGE_URL = 'http://54.64.10.17:8080/storage/images/'
        var icon = document.getElementById('icon');
        document.getElementById('username').textContent = localStorage.getItem('u_displayname') + "さん、こんにちは！";
        if (localStorage.getItem('u_icon') == 'null') {
            icon.src = STORAGE_URL + 'default.png';
        } else {
            icon.src = STORAGE_URL + localStorage.getItem('u_icon');
        }
    }
})

function logout(){
    localStorage.clear();
    window.location.href = "./login.html";
}
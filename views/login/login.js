const token = $.cookie("token");

// 이미 로그인된 상태
if (token !== undefined && token !== "null") {
    location.href = "/";
}

function enterKey() {
    if (window.event.keyCode === 13) {
        login($("#id").val(), $("#password").val());
    }
}

//로그인버튼
$("#login").click(function () {
    login($("#id").val(), $("#password").val());
});

function login(id, password) {
    if (isEmpty(id)) {
        alert('아이디를 입력해주세요.');
        return;
    } else if (isEmpty(password)) {
        alert('비밀번호를 입력해주세요.');
        return;
    }

    let loginData = {};
    loginData.memberId = id;
    loginData.password = password;

    requestWithData('POST','account/login', loginData, loginRequest);
}

function loginRequest(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'LI001') {
        $.cookie('token', 'Bearer ' + res.tokenDto.accessToken, {expires: 1, path: '/'});
        $.cookie('id', $("#id").val());
        $.cookie('authority', res.tokenDto.authority);
        location.href = '/';
    } else if (res.code === 'LI002') {
        alert('등록되지 않은 아이디이거나, 잘못된 비밀번호입니다.');
    }
}

function isEmpty(val) {
    return val == null || val === '';
}
getBrowserType();

//브라우저 체크
function getBrowserType() {
    let agent = navigator.userAgent.toLowerCase();
    if ((navigator.appName === 'Netscape' &&
        navigator.userAgent.search('Trident') !== -1) || (agent.indexOf("msie") !== -1)) {
        alert("이 홈페이지는 Internet Explorer를 지원하지 않습니다.\nChrome이나 Edge를 이용해주세요.");
        self.close();
    }
}

const token = $.cookie("token");
const id = $.cookie("id");

// 이미 로그인된 상태
if (!isEmpty(token)) {
    $(".title-bar").hide();
    location.href = "/";
}

//아이디 저장 폼 셋팅
if (!isEmpty(id)) {
    $("#id").val(id);
    $("input:checkbox[id='saveId']").prop("checked", true);
}

function enterKey() {
    if (window.event.keyCode === 13) {
        loginMember();
    }
}

//로그인버튼
// $("#login").click(function () {
//     login($("#id").val(), $("#password").val());
// });

function loginMember() {
    let id = $("#id").val()
    let password = $("#password").val()

    if (isEmpty(id)) {
        alert("아이디를 입력해주세요.");
        return;
    } else if (isEmpty(password)) {
        alert("비밀번호를 입력해주세요.");
        return;
    } else if (password.length < 4) {
        alert("아이디와 비밀번호를 정확히 입력해 주세요.")
        return;
    }

    let loginData = {};
    loginData.memberId = id;
    loginData.password = password;

    requestWithData('POST', 'account/login', loginData, loginRequest, true);
}

function loginRequest(res) {
    if (res.code === 'A2000') {
        let date = new Date();
        let m = 600;
        date.setTime(date.getTime() + (m * 60 * 1000));
        $.cookie('token', 'Bearer ' + res.data.tokenDto.accessToken, {expires: date});
        if ($("#saveId").is(":checked")) {
            $.cookie('id', $("#id").val(), 7);
        } else {
            $.removeCookie('id');
            $.cookie('id', $("#id").val(), {expires: date});
        }
        $.cookie('authority', res.data.tokenDto.authority, {expires: date});
        $.cookie('name', res.data.memberName, {expires: date});
        location.href = '/';
    }
}



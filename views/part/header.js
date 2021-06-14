
//메뉴 효과
$(document).ready(function () {
    $("#nav ul.sub").show();
    // $("#nav ul.menu li").hover(function () {
    //     $("ul", this).stop().slideToggle();
    // });
});

const token = $.cookie('token');
// 로그인이 안되어있으면 로그인으로
if (token === undefined || token == "null") {
    $(".title-bar").hide();
    location.href = "/login";
}

//로그아웃
function logout() {
    $.cookie('token', null, {path: '/'});
    let cookies = $.cookie();
    for (let cookie in cookies) {
        $.removeCookie(cookie);
    }
    location.href = "/login";
}

//내 정보
$("#myPage").click(function () {
    location.href = "/my-page";
    return false;
});
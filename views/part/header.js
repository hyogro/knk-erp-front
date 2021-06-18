//메뉴 효과
$(document).ready(function () {
    $("#nav ul.sub").show();
    $("#nav ul.menu li").click(function () {
        $("ul", this).stop().slideToggle();
    });
    //해당 메뉴 표시
    let menuId = location.pathname.split("/")[1];
    menuId = menuId === "" ? "home" : menuId;
    $("#" + menuId + "Menu > a").addClass("main-menu-active");

    let subMenuId = location.pathname.split("/")[2];
    if (subMenuId !== undefined) {
        console.log(subMenuId);
        $("#" + subMenuId + "Menu > a").addClass("side-menu-active");
    }
});

const token = $.cookie('token');
// 로그인이 안되어있으면 로그인으로
if (token === undefined || token === "null") {
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

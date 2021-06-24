if (getBrowserType() === "etc") {
    alert("이 홈페이지는 크롬과 엣지에 최적화되어있습니다.\n다른 브라우저를 이용해주세요.");
    self.close();
}

//메뉴 효과
$(document).ready(function () {
    $("#nav ul.sub").show();
    $("#nav ul.menu li").click(function () {
        $("ul", this).stop().slideToggle();
    });

    let authority = $.cookie('authority');
    if (authority === "LVL1" || authority === "LVL2") {
        $("#approveMenu").hide();
        $("#manageMenu").hide();
    } else {
        $("#approveMenu").show();
        $("#manageMenu").show();
    }

    //해당 메뉴 표시
    let menuId = location.pathname.split("/")[1];
    menuId = menuId === "" ? "home" : menuId;
    $("#" + menuId + "Menu > a").addClass("main-menu-active");

    let subMenuId = location.pathname.split("/")[2];
    if (subMenuId !== undefined) {
        $("#" + subMenuId + "SubMenu > a").addClass("side-menu-active");
    }
});

const token = $.cookie('token');
// 로그인이 안되어있으면 로그인으로
if (isEmpty(token)) {
    $(".title-bar").hide();
    location.href = "/login";
}

//로그아웃
function logout() {
    // $.cookie('token', null);
    $.removeCookie('token');
    $.removeCookie('authority');

    // let cookies = $.cookie();
    // for (let cookie in cookies) {
    //     $.removeCookie(cookie);
    // }
    location.href = "/login";
}

//내 정보
$("#myPage").click(function () {
    location.href = "/my-page";
    return false;
});
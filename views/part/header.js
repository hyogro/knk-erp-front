//메뉴 효과
$(document).ready(function () {
    $("#nav ul.sub").show();
    // $("#nav ul.menu li").click(function () {
    //     $("ul", this).stop().slideToggle();
    // });

    let authority = $.cookie('authority');
    if (authority === "LVL1") {
        $("#approveMenu").hide();
        $("#manageMenu").hide();
        $("#manageSubMenu").hide();
    } else if (authority === "LVL2") {
        $("#approveMenu").show();
        $("#manageMenu").hide();
        $("#manageSubMenu").hide();
    } else if (authority === "MANAGE") {
        $("#approveMenu").hide();
        $("#manageMenu").show();
        $("#manageSubMenu").show();
    } else {
        $("#approveMenu").show();
        $("#manageMenu").show();
        $("#manageSubMenu").show();
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

    $.cookie("token", null, { path: '/' });
    $.cookie("authority", null, { path: '/' });

    alert("로그아웃 되었습니다.");
    location.href = "/login";
}

//내 정보
$("#myPage").click(function () {
    location.href = "/my-page";
    return false;
});

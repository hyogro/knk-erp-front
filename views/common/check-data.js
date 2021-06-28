//브라우저 체크
function getBrowserType() {
    let agent = navigator.userAgent.toLowerCase();

    if ((navigator.appName === 'Netscape' &&
        navigator.userAgent.search('Trident') !== -1) ||
        (agent.indexOf("msie") !== -1)) {
        alert("이 홈페이지는 크롬과 엣지에 최적화되어있습니다.\n다른 브라우저를 이용해주세요.");
        self.close();
    }
}

//빈값 체크
function isEmpty(val) {
    return val == null || val === '' || val === undefined || val === "null";
}

//날짜 년, 월, 일 배열
function getTodayArr(date) {
    let dateArr = [];

    dateArr[0] = date.getFullYear();
    dateArr[1] = ("0" + (1 + date.getMonth())).slice(-2);
    dateArr[2] = ("0" + date.getDate()).slice(-2);
    dateArr[3] = date.getHours();
    dateArr[4] = date.getMinutes();
    dateArr[5] = date.getSeconds();

    let week = new Array('일', '월', '화', '수', '목', '금', '토');
    dateArr[6] = week[date.getDay()];

    return dateArr;
}

//yyyy-mm-dd 형식
function getYYYYMMDD(date) {
    let dateArr = [];

    dateArr[0] = date.getFullYear();
    dateArr[1] = ("0" + (1 + date.getMonth())).slice(-2);
    dateArr[2] = ("0" + date.getDate()).slice(-2);

    return dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];
}

//날짜
function getToday(date) {
    return date.split("T")[0].replaceAll("-", ".");
}

//날짜 오차 체크
function chkDate(start, end) {
    let startDate = new Date(start);
    let endDate = new Date(end);

    return (startDate > endDate);
}

//분 -> 일 시간 단위로
function makeDateForm(min) {
    var days = Math.floor(min / 60 / 8)
    var hours = Math.floor((min - (days * 60 * 8)) / 60);
    var mins = min - (days * 60 * 8) - (hours * 60);

    var daysStr = days;
    var hourStr = hours;
    var minStr = (mins > 9) ? mins : '0' + mins

    return daysStr + '일 ' + hourStr + '시간 ' + minStr + '분';
}

//엔터 br로 바꾸기
function enterToBr(text) {
    return text.replaceAll("\n", "<br>");
}

//글자수 세기
function countTextLength(id, text, length) {
    $('#' + id).html("(" + $(text).val().length + " / " + length + ")");

    if ($(text).val().length > length) {
        $(text).val($(text).val().substring(0, length));
        $('#' + id).html("(" + length + " / " + length + ")");
    }
}

//Object -> FormData
function getURL(url, data) {
    if (typeof data === 'object') {
        let urlParams = [];
        Object.keys(data).forEach(key => urlParams.push(key + '=' + data[key]));
        if (urlParams.length > 0) url = url + "?" + urlParams.join("&");
    } else if (typeof data === 'string') {
        url = url + '/' + data;
    } else if (typeof data === 'number') {
        url = url + '/' + data;
    } else {
        console.log(typeof data);
    }

    return url;
}

//get 파라미터 가져오기
function getQuery() {
    var url = document.location.search;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0, result = {}; i < qs.length; i++) {
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}

//비밀번호 유효성 체크
function chkPW(pass1, text) {
    let num = pass1.search(/[0-9]/g);
    let eng = pass1.search(/[a-z]/ig);
    let spe = pass1.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    if (pass1 === "") {
        return true;
    } else if (pass1.length < 8 || pass1.length > 16) {
        $("#" + text).text("8자리 ~ 16자리 이내로 입력해주세요.");
        return false;
    } else if (pass1.search(/\s/) !== -1) {
        $("#" + text).text("비밀번호는 공백 없이 입력해주세요.");
        return false;
    } else if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
        $("#" + text).text("영문, 숫자, 특수문자 중 2가지 이상을 조합하여 입력해주세요.");
        return false;
    } else {
        $("#" + text).empty();
        return true;
    }
}

//비밀번호 확인
function matchPW(pass1, pass2, text) {
    if (pass1 !== pass2) {
        $("#" + text).text("비밀번호가 일치하지 않습니다.");
        return false;
    } else {
        $("#" + text).empty();
        return true;
    }
}

//이메일 유효성 체크
function chkEmail(email) {
    const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(email)) {
        return false;
    } else {
        return true;
    }
}

//아이디 유효성 체크
function chkId(id) {
    var idReg = /^[a-z]+[a-z0-9]{5,14}$/g;
    if (!idReg.test(id)) {
        return false;
    } else {
        return true;
    }
}
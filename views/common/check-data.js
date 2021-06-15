//빈값 체크
function isEmpty(val) {
    return val == null || val === '' || val === undefined;
}

//날짜 년, 월, 일 배열
function getTodayArr(date) {
    let dateArr = [];

    dateArr[0] = date.getFullYear();
    dateArr[1] = (1 + date.getMonth());
    dateArr[2] = date.getDate();
    dateArr[3] = date.getHours();
    dateArr[4] = date.getMinutes();
    dateArr[5] = date.getSeconds();

    let week = new Array('일', '월', '화', '수', '목', '금', '토');
    dateArr[6] = week[date.getDay()];

    return dateArr;
}

//날짜
function getToday(date) {
    return date.split("T")[0].replaceAll("-", ".");
}


//Object -> FormData
function getURL(url, data) {
    if(typeof data === 'object'){
        let urlParams = [];
        Object.keys(data).forEach(key => urlParams.push(key+'='+data[key]));
        if(urlParams.length > 0) url = url+"?"+urlParams.join("&");
    }
    else if(typeof data === 'string'){
        url = url + '/' + data;
    }
    else if(typeof data === 'number'){
        url = url + '/' + data;
    }
    else alert(typeof data);

    return url;
}
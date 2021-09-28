//api 통신 전 로딩 숨기기
// $("#loading").hide();

//api 요청
function request(method, url, processFunc) {
    $.ajax({
        type: method,
        headers: {'token': $.cookie('token')},
        url: '<%= api %>' + url,
        success: function (res) {
            processFunc(res);
        },
        beforeSend: function () { //로딩이미지 보여주기
            $("#loading").show();
        },
        complete: function () { //로딩이미지 숨기기
            $("#loading").hide();
        },
        error: function (err) {
            console.log(err)
            alert("잘못된 접근입니다.\n");
        }
    });
}

//api 요청 (data 포함)
function requestWithData(method, url, data, processFunc) {
    $.ajax({
        type: method,
        url: '<%= api %>' + url,
        headers: {'token': $.cookie('token')},
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (res) {
            processFunc(res);
        },
        beforeSend: function () { //로딩이미지 보여주기
            $("#loading").show();
        },
        complete: function () { //로딩이미지 숨기기
            $("#loading").hide();
        },
        error: function (err) {
            alert("잘못된 접근입니다.\n");
        }
    });
}

//api 요청 (파일)
function requestWithFile(method, url, data, processFunc) {
    $.ajax({
        type: method,
        url: '<%= api %>' + url,
        headers: {'token': $.cookie('token')},
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        data: data,
        success: function (res) {
            processFunc(res);
        },
        beforeSend: function () { //로딩이미지 보여주기
            $("#loading").show();
        },
        complete: function () { //로딩이미지 숨기기
            $("#loading").hide();
        },
        error: function (err) {
            alert("잘못된 접근입니다.\n");
        }
    });
}
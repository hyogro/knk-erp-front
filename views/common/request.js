//api 통신 전 로딩 숨기기
// $("#loading").hide();

//api 요청
function request(method, url, processFunc, warning) {
    $.ajax({
        type: method,
        headers: {'token': $.cookie('token')},
        url: '<%= api %>' + url,
        success: function (res) {
            processFunc(res);
        },
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        error: function (err) {
            alertErrorMessage(warning, errorCode(err.responseJSON.code))
        }
    });
}

//api 요청 (data 포함)
function requestWithData(method, url, data, processFunc, warning) {
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
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        error: function (err) {
            alertErrorMessage(warning, errorCode(err.responseJSON.code))
        }
    });
}

//api 요청 (파일)
function requestWithFile(method, url, data, processFunc, warning) {
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
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        error: function (err) {
            alertErrorMessage(warning, errorCode(err.responseJSON.code))
        }
    });
}
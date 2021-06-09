//api 요청
function request(url, processFunc) {
    $.ajax({
        type: "POST",
        headers: {'token': $.cookie('token')},
        url: '<%= api %>' + url,
        success: function (res) {
            processFunc(res);
        },
        beforeSend: function() { //로딩이미지 보여주기
            $("#loading").show();
        },
        complete: function() { //로딩이미지 숨기기
            $("#loading").hide();
        },
        error: function (err) {
            processFunc(err);
        }
    });
}

//api 요청 (data 포함)
function requestWithData(url, data, processFunc) {
    $.ajax({
        type: "POST",
        url: '<%= api %>' + url,
        headers: {'token': $.cookie('token')},
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (res) {
            processFunc(res);
        },
        beforeSend: function() { //로딩이미지 보여주기
            $("#loading").show();
        },
        complete: function() { //로딩이미지 숨기기
            $("#loading").hide();
        },
        error: function (err) {
            processFunc(err);
        }
    });
}
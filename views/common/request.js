//api 요청
function request(url, processFunc) {
    $.ajax({
        type: "POST",
        headers: {'token': $.cookie('token')},
        url: '<%= api %>' + url,
        success: function (res) {
            processFunc(res);
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
        error: function (err) {
            processFunc(err);
        }
    });
}
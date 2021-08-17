$(function () {
    let set = {
        dateFormat: 'yy-mm-dd',
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        showMonthAfterYear: true,
        yearSuffix: '년',
        beforeShowDay: disableSomeDay
    }
    $("#startDate").datepicker(set);
    $("#endDate").datepicker(set);
});

// 특정날짜들 배열
let disabledDays = ["2021-1-1",
    "2021-2-11", "2021-2-12", "2021-2-13",
    "2021-3-1",
    "2021-5-5", "2021-5-19",
    "2021-6-6",
    "2021-8-15", "2021-8-16",
    "2021-9-20", "2021-9-21", "2021-9-22",
    "2021-10-3", "2021-10-4", "2021-10-9", "2021-10-11",
    "2021-12-25"];

// 주말, 공휴일 제외
function disableSomeDay(date) {
    let m = date.getMonth(), d = date.getDate(), y = date.getFullYear();
    for (let i = 0; i < disabledDays.length; i++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, disabledDays) !== -1) {
            return [false, 'holiday', 'holiday'];
        }
    }
    return [date.getDay() !== 0 && date.getDay() !== 6];
}


$('input[type="checkbox"][name="vacation"]').click(function () {
    if ($(this).prop('checked')) {
        $('input[type="checkbox"][name="vacation"]').prop('checked', false);
        $(this).prop('checked', true);
    }

    //시간제 선택
    if ($('#etc').is(":checked") === true) {
        $('#startTime3').attr('disabled', false);
        $('#end3').attr('disabled', false);
        $('.time').attr('disabled', false);
        $('select').attr('disabled', false);
    } else {
        $('#startTime3').attr('disabled', true);
        $('#end3').attr('disabled', true);
        $('.time').attr('disabled', true);
        $('select').attr('disabled', true);
        $('input[type="time"]').val("");
    }

    //연차, 공가 선택
    if ($('#full').is(":checked") === true ||
        $('#official').is(":checked") === true) {
        $('#endView').show();
    } else {
        $('#endView').hide();
        $('#endDate').val("");
    }
});

function unableToChooseDate() {
    let listDate = getDatesStartToLast($("#startDate").val(), $("#endDate").val());

    for (let i = 0; i < listDate.length; i++) {
        let date = new Date(listDate[i]);

        for (let j = 0; j < disabledDays.length; j++) {
            let day = getYYYYMMDD(new Date(disabledDays[j]))
            if (listDate[i] === day) {
                return false;
            }
        }

        if (getTodayArr(date)[6] === '일' || getTodayArr(date)[6] === '토') {
            return false;
        }
    }

    return true;
}

function getDatesStartToLast(startDate, lastDate) {
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (!(regex.test(startDate) && regex.test(lastDate))) return "Not Date Format";
    var result = [];
    var curDate = new Date(startDate);
    while (curDate <= new Date(lastDate)) {
        result.push(curDate.toISOString().split("T")[0]);
        curDate.setDate(curDate.getDate() + 1);
    }
    return result;
}

//휴가 신청
function createVacation() {
    let saveData = {};
    saveData.type = $("input:checkbox[name='vacation']:checked").val();
    saveData.memo = $("#memo").val();

    let startTime = "09:00:00";
    let endTime = "18:00:00";

    if (saveData.type === "오전반차") {
        endTime = "13:00:00";
    } else if (saveData.type === "오후반차") {
        startTime = "14:00:00";
    } else if (saveData.type === "시간제") {
        startTime = conversionTimeSet($("#startTime1").val(), $("#startTime2").val(), $("#startTime3").val());
        endTime = conversionTimeSet($("#endTime1").val(), $("#endTime2").val(), $("#endTime3").val());
    }

    if (saveData.type !== "연차" && saveData.type !== "공가") {
        $('#endDate').val($('#startDate').val());
    }

    saveData.startDate = $("#startDate").val() + "T" + startTime;
    saveData.endDate = $("#endDate").val() + "T" + endTime;

    if (isEmpty(saveData.type)) {
        alert("휴가 유형을 선택해주세요.");
    } else if (isEmpty(saveData.memo)) {
        alert("사유를 작성해주세요.");
    } else if ($('#etc').is(":checked") &&
        isEmpty($("#startTime3").val()) || isEmpty($("#endTime3").val())) {
        alert("휴가기간을 선택해주세요.");
    } else if (!unableToChooseDate()) {
        alert("휴가 기간에 주말 혹은 공휴일을 포함할 수 없습니다.\n올바른 휴가 기간을 선택해주세요.");
    } else if (($('#etc').is(":checked") &&
        parseInt($("#startTime3").val()) > 59 ||
        parseInt($("#endTime3").val()) > 59)) {
        alert("올바른 휴가기간을 선택해주세요.");
    } else if (new Date(saveData.startDate) >= new Date(saveData.endDate)) {
        alert("올바른 휴가기간을 선택해주세요.")
    } else {
        console.log(saveData)
        requestWithData("POST", "vacation", saveData, alertCreateVacation)
    }
}

function alertCreateVacation(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'CV001') {
        alert("제출되었습니다.");
        location.href = '/vacation';
    } else if (res.code === 'CV002') {
        alert("휴가신청 실패");
    }
}
$('input[type="checkbox"][name="vacation"]').click(function () {
    if ($(this).prop('checked')) {
        $('input[type="checkbox"][name="vacation"]').prop('checked', false);
        $(this).prop('checked', true);
    }

    //기타 선택
    if ($('#etc').is(":checked") === true) {
        $('input[type="time"]').prop('readonly', false);
    } else {
        $('input[type="time"]').prop('readonly', true);
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
    } else if (saveData.type === "기타") {
        startTime = $("#startTime").val();
        endTime = $("#endTime").val();
    }

    if (saveData.type !== "연차" && saveData.type !== "공가") {
        $('#endDate').val($('#startDate').val());
    }

    saveData.startDate = $("#startDate").val() + "T" + startTime;
    saveData.endDate = $("#endDate").val() + "T" + endTime;

    console.log(saveData);

    if (isEmpty(saveData.type)) {
        alert("휴가 유형을 선택해주세요.");
    } else if (isEmpty(saveData.memo)) {
        alert("사유를 작성해주세요.");
    } else if ($('#etc').is(":checked") && (isEmpty(startTime)) || (isEmpty(endTime))) {
        alert("휴가기간을 선택해주세요.");
    } else if (isEmpty(saveData.startDate) || isEmpty(saveData.endDate)) {
        alert("휴가기간을 선택해주세요.");
    } else if (new Date(saveData.startDate) > new Date(saveData.endDate)) {
        alert("올바른 휴가기간을 선택해주세요.")
    } else {
        requestWithData("POST", "vacation", saveData, alertCreateVacation)
    }
}

function alertCreateVacation(res) {
    console.log(res)
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
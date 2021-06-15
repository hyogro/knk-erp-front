$('input[type="checkbox"][name="vacation"]').click(function () {
    if ($(this).prop('checked')) {
        $('input[type="checkbox"][name="vacation"]').prop('checked', false);
        $(this).prop('checked', true);
    }
});

function createVacation() {
    let saveData = new Object();
    saveData.type = $("input:checkbox[name='vacation']:checked").val();
    saveData.memo = $("#memo").val();

    let startTime = "09:00:00";
    let endTime = "18:00:00";
    if (saveData.title === "오전반차") {
        endTime = "14:00:00";
    } else if (saveData.title === "오후반차") {
        startTime = "14:00:00";
    }

    saveData.startDate = $("#startDate").val() + "T" + startTime;
    saveData.endDate = $("#endDate").val() + "T" + endTime;

    if (isEmpty(saveData.type)) {
        alert("휴가 유형을 선택해주세요.");
    } else if (isEmpty(saveData.memo)) {
        alert("사유를 작성해주세요.");
    } else if (isEmpty(saveData.startDate) || isEmpty(saveData.endDate)) {
        alert("휴가기간을 선택해주세요.")
    } else if (new Date(saveData.startDate) > new Date(saveData.endDate)) {
        alert("올바른 휴가기간을 선택해주세요.")
    }

    requestWithData("POST", "vacation", saveData, alertCreateVacation)
}

function alertCreateVacation(res) {
    if (res.code === null) {
        return;
    }
    if (res.code === 'CV001') {
        alert("제출되었습니다.");
        location.href = '/schedule/manage-vacation';
    } else if (res.code === 'CV002') {
        alert("휴가신청 실패");
    }
}
// //출퇴근 관리 다운로드
// function downloadAttendance() {
//     let sendData = {};
//     sendData.startDate = '2021-05-12';
//     sendData.endDate = '2021-06-28';
//
//     request('GET', getURL('file/download/excel/attendance', sendData), consoleLogFunc);
// }
//
// function consoleLogFunc(res){
//     if (res.code === null) {
//         return;
//     }
//     if (res.code === 'ES001') {
//         location.href = '<%= fileApi %>' + res.message;
//         console.log(res.message);
//     } else {
//         alert("출퇴근 기록 다운로드 실패");
//     }
// }
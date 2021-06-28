
function downloadAttendance() {
    let sendData = {};
    sendData.startDate = '2021-05-12';
    sendData.endDate = '2021-06-28';

    request('GET', getURL('file/download/excel/attendance', sendData), consoleLogFunc);
}
function consoleLogFunc(res){
    if(res.code === 'ES001'){
        location.href = '<%= fileApi %>' + res.message;
        console.log(res.message);
    }else alert("오류~");
}
let today = getYYYYMMDD(new Date());
searchAttendanceRecord(today);
$("#searchDate").val(today)

function searchAttendanceRecord(date) {
    let sendData = {};
    sendData.date = date;
    request('GET', getURL('attendance/duplicate', sendData), detailAppliedAttendanceRecord, false);
}

function detailAppliedAttendanceRecord(res) {
    if (res.code === 'A5510') {
        $("#recordList").empty();

        let data = res.data;

        let uuidList = []
        for (let i = 0; i < data.length; i++) {
            uuidList.push(data[i].uuid);
        }
        let uuidMap = getMap(uuidList)

        let reduplicationUuid = []
        for (let uuid in uuidMap) {
            if (uuidMap[uuid] > 1) {
                reduplicationUuid.push(uuid)
            }
        }

        let count = 0;

        for (let i = 0; i < reduplicationUuid.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (data[j].uuid === reduplicationUuid[i]) {
                    let html = '';

                    if (i % 2 === 0) {
                        html += '<tr style="background-color: #fffaf6">';
                    } else {
                        html += '<tr style="background-color: #fff7fc">';
                    }

                    html += '<td class="record-num">' + (i + 1) + '</td>' +
                        '<td>' + data[j].memberName + '(' + data[j].memberId + ')</td>' +
                        '<td>' + getToday(data[j].attendanceDate) + '</td>' +
                        '<td>' + data[j].uuid + '</td>' +
                        '</tr>';
                    $("#recordList").append(html);

                    count += 1;
                }
            }
        }

        if (count === 0) {
            let html = '<tr><td colspan="4">중복되는 명단이 없습니다.</td></tr>';
            $("#recordList").append(html);
        }
    }
}

// 중복값 추출
function getMap(arr) {
    return arr.reduce((t, a) => {
        t[a] = (t[a] || 0) + 1
        return t
    }, {})
}
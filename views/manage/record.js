let today = getYYYYMMDD(new Date());
searchAttendanceRecord(today);

function searchAttendanceRecord(date) {
    let sendData = {};
    sendData.date = date;
    request('GET', getURL('attendance/duplicate', sendData), detailAppliedAttendanceRecord);
}

function detailAppliedAttendanceRecord(res) {
    console.log(res)
    if (res.code === null) {
        return;
    }
    if (res.code === 'RAUL001') {
        $("#recordList").empty();

        // let data = res.data.sort(function (a, b) {
        //     let x = a.uuid.toLowerCase();
        //     let y = b.uuid.toLowerCase();
        //     if (x < y) {
        //         return -1;
        //     }
        //     if (x > y) {
        //         return 1;
        //     }
        //     return 0;
        // });

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

                    html += '<td>' + (j + 1) + '</td>' +
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

    } else if (res.code === 'RAUL002') {
        console.log("출근 기록 읽어오기 실패");
    }
}

// 중복값 추출
function getMap(arr) {
    return arr.reduce((t, a) => {
        t[a] = (t[a] || 0) + 1
        return t
    }, {})
}
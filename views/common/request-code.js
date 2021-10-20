function errorCode(code) {
    switch (code) {
        // 공통
        case 'E9000' :
            return "서버 오류"
        case 'E9100' :
            return "요청한 데이터가 없습니다."
        case 'E9800' :
            return "필수 입력정보를 입력하지 않았거나 입력한 정보가 길이 제한 범위를 벗어납니다."
        case 'E9900' :
            return "권한이 없습니다."

        // Schedule Attendance
        case 'E5501' :
            return "출근 기록이 이미 존재합니다."
        case 'E5502' :
            return "근태 정보가 존재하지 않습니다."
        case 'E5503' :
            return "근태 정정요청이 이미 존재합니다."
        case 'E5504' :
            return "근태 정정요청이 존재하지 않습니다."
        case 'E5505' :
            return "퇴근 기록이 이미 존재합니다."

        // File
        case 'E6001':
            return "파일 업로드에 실패했습니다.(파일 오류)"
    }
}

function alertErrorMessage(warning, message) {
    if (warning) {
        alert(message)
    } else {
        console.log(message)
    }
}
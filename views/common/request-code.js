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

        // Account
        case 'E1100':
            return "이미 존재하는 아이디입니다."
        case 'E1200':
            return "대상이 부서의 파트장이므로 권한이 없습니다."
        case 'E3100':
            return "EXPIRED_TOKEN"
        case 'E3110':
            return "Wrong Type Token"
        case 'E3120':
            return "Unsupported Token"
        case 'E3130':
            return "Illegal Argument"
        case 'E3140':
            return "아이디 또는 비밀번호가 일치하지 않습니다."

        // Department
        case 'E1600':
            return "삭제되었거나 존재하지 않는 부서입니다."
        case 'E1601':
            return "이미 존재하는 부서입니다."
        case 'E1602':
            return "해당 부서에 소속되지 않은 멤버입니다."
        case 'E1603':
            return "해당 부서에 소속된 멤버가 존재합니다."

        // Fixtures
        case 'E4100':
            return "삭제되었거나 존재하지 않는 요청서입니다."
        case 'E4101':
            return "해당 요청서 작성자가 아닙니다."
        case 'E4102':
            return "삭제되었거나 존재하지 않는 요청서입니다."
        case 'E4110':
            return "이미 처리된 요청서입니다."

        // Board
        case 'E4500':
            return "삭제되었거나 존재하지 않는 게시글입니다."
        case 'E4501':
            return "해당 게시글 작성자가 아닙니다."

    }
}

function alertErrorMessage(warning, message) {
    if (warning) {
        alert(message)
    } else {
        console.log(message)
    }
}
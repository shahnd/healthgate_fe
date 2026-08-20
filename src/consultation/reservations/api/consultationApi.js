import axios from "axios";

const BASE_URL = "http://localhost:8006/healthgate/consultation";


// 예약 목록 조회
function selectAllReservationApi(dateStr) {
    const response = axios({
        url : `${BASE_URL}/reservations/list`,
        method : "get",
        params : {consultationScheduledDate : dateStr}
    });
    return response;
}

// 예약 상세 조회
function selectReservationApi(id) {

    const response = axios({
        url : `${BASE_URL}/reservations/details/${id}`,
        method : "get"
    });
    return response;
}

// 예약 신청

// 예약 수정

// 예약 취소
export { selectAllReservationApi, selectReservationApi };
import axios from "axios";

const BASE_URL = "http://localhost:8006/healthgate/consultation/reservations";


// 예약 목록 조회
function selectAllReservationApi(scheduledDate) {
    const response = axios({
        url : `${BASE_URL}/list`,
        method : "get",
        params : { scheduledDate }
    });
    return response;
}

// 예약 상세 조회
function selectReservationApi(id) {

    const response = axios({
        url : `${BASE_URL}/details/${id}`,
        method : "get"
    });
    return response;
}

// 예약 신청 전 조회
function selectDateApi (scheduledDate) {
    const response = axios({
        url : `${BASE_URL}/views`,
        method : "get",
        params : { scheduledDate }
    });
    return response;
}

// 예약 신청
function saveReservationApi (consultation) {
    const response = axios({
        url : `${BASE_URL}/save`,
        method : "post",
        data : consultation
    });
    return response;
}
// 예약 수정
function updateReservationApi (id, consultation) {
    const response = axios({
        url : `${BASE_URL}/save/${id}`,
        method : "put",
        data : consultation
    });
    return response;
}

// 예약 취소
function cancelReservationApi (id) {
    const response = axios({
        url : `${BASE_URL}/${id}`,
        method : "delete"
    });
    return response;
}

export { selectAllReservationApi, selectReservationApi, selectDateApi, saveReservationApi,
         updateReservationApi, cancelReservationApi };
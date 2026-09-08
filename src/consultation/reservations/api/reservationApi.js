import axios from "axios";

const BASE_URL = "/healthgate/consultation/reservations";

// 인가 체크
const getAuthConfig = () => {
    const token = localStorage.getItem("access_token");

    return {
        headers : { Authorization : `Bearer ${token}`}
    };
};

// 로그인 유저 정보 조회
function LoginUserApi(id){
    const response = axios({
        url : `/healthgate/employees/${id}`,
        method : "get",
        ...getAuthConfig()
    });

    return response;
}
// 예약 목록 조회
function selectAllReservationApi(year, month) {
    const response = axios({
        url : `${BASE_URL}`,
        method : "get",
        params : { year, month },
        ...getAuthConfig()
    });
    return response;
}

// 예약 상세 조회
function selectReservationApi(id) {

    const response = axios({
        url : `${BASE_URL}/${id}`,
        method : "get",
        ...getAuthConfig()
    });
    return response;
}

// 예약 신청 전 조회
function selectDateApi (scheduledDate) {
    const response = axios({
        url : `${BASE_URL}`,
        method : "get",
        params : { scheduledDate },
        ...getAuthConfig()
    });
    return response;
}

// 예약 신청
function insertReservationApi (consultation) {
    const response = axios({
        url : `${BASE_URL}`,
        method : "post",
        data : consultation,
        ...getAuthConfig()
    });
    return response;
}
// 예약 수정
function updateReservationApi (id, consultation) {
    const response = axios({
        url : `${BASE_URL}/${id}`,
        method : "put",
        data : consultation,
        ...getAuthConfig()
    });
    return response;
}

// 예약 취소
function cancelReservationApi (id) {
    const response = axios({
        url : `${BASE_URL}/${id}`,
        method : "delete",
        ...getAuthConfig()
    });
    return response;
}

export { selectAllReservationApi, selectReservationApi, selectDateApi, insertReservationApi,
         updateReservationApi, cancelReservationApi, LoginUserApi };

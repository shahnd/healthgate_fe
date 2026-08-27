import axios from "axios";

const BASE_URL = `http://localhost:8006/healthgate/consultation/consultations`;

// 인가 체크
const getAuthConfig = () => {
    const token = localStorage.getItem("access_token");

    return {
        headers : { Authorization : `Bearer ${token}`}
    };
};

// 목록 조회
function selectConsultationListApi(startMonth, endMonth) {

    const response = axios ({
        url : `${ BASE_URL }/list`,
        method : "get",
        params : { startMonth, endMonth },
        ...getAuthConfig()
    });

    return response
}

// 단건 조회
function selectConsultationApi(id) {

    const response = axios({
        url : `${ BASE_URL }/detail/${ id }`,
        method : "get",
        ...getAuthConfig()
    });

    return response;
}

// 등록/수정
function saveConsultationApi(id, consultation) {

    const response = axios({
        url : `${ BASE_URL }/${ id }`,
        method : "put",
        data : consultation,
        ...getAuthConfig()
    });

    return response;
}


export { selectConsultationListApi, selectConsultationApi, saveConsultationApi };


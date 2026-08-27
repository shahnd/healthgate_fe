import axios from "axios";

const BASE_URL = `http://localhost:8006/healthgate/consultation/consultations`;

// 목록 조회
function selectConsultationListApi() {

    const response = axios ({
        url : `${ BASE_URL }/list`,
        method : "get"
    });

    return response
}

// 단건 조회
function selectConsultationApi(id) {

    const response = axios({
        url : `${ BASE_URL }/detail/${ id }`,
        method : "get",
    });

    return response;
}

// 등록/수정
function saveConsultationApi(id, consultation) {

    const response = axios({
        url : `${ BASE_URL }/${ id }`,
        method : "put",
        data : consultation
    });

    return response;
}


export { selectConsultationListApi, selectConsultationApi, saveConsultationApi };


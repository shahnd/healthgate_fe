import axios from "axios";

const BASE_URL = "http://localhost:5173/hospital";

// 검진가능 병원 목록 조회용 
const selectHospitalListApi = cpage => {

    const response = axios({
        url : `${ BASE_URL }/list`,
        method : "get",
        params : {
            cpage : cpage
        }

    });

    return response;
};

// 검진가능 병원 검색용
const searchHospitalListApi = (cpage, keyword) => {

    const response = axios({
        url : `${ BASE_URL }/search`,
        method : "get",
        params : {
            cpage : cpage,
            keyword : keyword
        }
    });

    return response;
};

// 검진가능 병원 상세조회용 
const selectHospitalApi = id => {

     const response = axios({
        url : `${ BASE_URL }/${ id }`,
        method : "get"
     });

     return response;
};

// 검진가능 병원 삭제용
const deleteHospitalApi = id => {

    const response = axios({
        url : `${ BASE_URL }/${ id }`,
        method : "delete" 
    });

    return response
};

// 검진가능 병원 등록용
const insertHospitalApi = hospital => {

    const response = axios({
        url : `${ BASE_URL }/new`,
        method : "post",
        data : hospital
    });
};

// 검진가능 병원 수정용 
const updateHospitalApi = (id, hospital) => {

    const response = axios({
        url : `${ BASE_URL }/${ id }`, 
        method : "post",
        data : hospital
    });

    return response;
};

// 검진가능 병원 상세조회용 - 수정하기 페이지에서 요청
const selectHospitalFormApi = id => {

     const response = axios({
        url : `${ BASE_URL }/${ id }/form`,
        method : "get"
     });

     return response;
}; 

export { selectHospitalListApi, searchHospitalListApi, selectHospitalApi, 
         deleteHospitalApi, insertHospitalApi, updateHospitalApi,selectHospitalFormApi };
export { BASE_URL }
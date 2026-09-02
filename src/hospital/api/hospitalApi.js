import axios from "axios";

const BASE_URL = "/healthgate/hospitals";

// 검진가능 병원 검색용+ 조회용 
const searchHospitalListApi = params => {

    const response = axios({
        url : `${ BASE_URL }`,
        method : "get",
        params :  params
        
    });

    return response;
};

// 검진가능 병원 상세조회용 
const selectHospitalApi = hospitalId => {

     const response = axios({
        url : `${ BASE_URL }/${ hospitalId }`,
        method : "get"
     });
     
     return response;
};

// 검진가능 병원 삭제용
const deleteHospitalApi = hospitalId => {

    const response = axios({
        url : `${ BASE_URL }/${ hospitalId }`,
        method : "delete" 
    });

    return response
};

// 검진가능 병원 등록용
const insertHospitalApi = params => {
    
    const response = axios({
        url : `${ BASE_URL }/new`,
        method : "post",
        data : params
    });

     return response
};

// 검진가능 병원 수정용 
const updateHospitalApi = (hospitalId, params) => {

    const response = axios({
        url : `${ BASE_URL }/${ hospitalId }`, 
        method : "put",
        data : params
    });

    return response;
};


export { searchHospitalListApi, selectHospitalApi, 
         deleteHospitalApi, insertHospitalApi, updateHospitalApi, BASE_URL };

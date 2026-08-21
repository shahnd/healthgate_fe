import axios from "axios";

const BASE_URL = "http://localhost:8006/healthgate/hospitals";

// 검진가능 병원 검색용+ 조회용 
const searchHospitalListApi = (cpage, 
                               name, 
                               address,
                               isGeneralExamAvailable,
                               isStomachCancerExamAvailable,
                               isColonCancerExamAvailable,
                               isLiverCancerExamAvailable,
                               isLungCancerExamAvailable) => {

    const response = axios({
        url : `${ BASE_URL }`,
        method : "get",
        params : {
            cpage : cpage,
            name : name,
            address : address,
            isGeneralExamAvailable : isGeneralExamAvailable,
            isStomachCancerExamAvailable : isStomachCancerExamAvailable, 
            isColonCancerExamAvailable : isColonCancerExamAvailable,
            isLiverCancerExamAvailable : isLiverCancerExamAvailable,
            isLungCancerExamAvailable : isLungCancerExamAvailable
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
const updateHospitalApi = (hospitalId, hospital) => {

    const response = axios({
        url : `${ BASE_URL }/${ hospitalId }`, 
        method : "post",
        data : hospital
    });

    return response;
};


export { searchHospitalListApi, selectHospitalApi, 
         deleteHospitalApi, insertHospitalApi, updateHospitalApi, BASE_URL };

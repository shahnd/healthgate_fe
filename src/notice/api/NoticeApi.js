import axios from "axios";

const BASE_URL = "http://localhost:8006/healthgate/notices";

// 공지사항 목록 조회
const selectNoticeListApi = cpage => {

    const response = axios({
         url : `${ BASE_URL }/list`,
         method : "get",
         params : {
            cpage : cpage
         } 
    });

    return response;
};

// 공지사항 목록 검색
const searchNoticeListApi = (cpage, keyword) => {

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

// 공지사항 등록
const  insertNoticeApi = formData => {

    const response =axios({
        url : `${ BASE_URL }/new`,
        method : "post",
        data : formData
    });

    return response;
};

export { selectNoticeListApi, searchNoticeListApi, insertNoticeApi, BASE_URL};
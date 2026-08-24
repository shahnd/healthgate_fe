import axios from "axios";

const BASE_URL = "http://localhost:8006/healthgate/notices";

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

export { selectNoticeListApi, searchNoticeListApi, BASE_URL};
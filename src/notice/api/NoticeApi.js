import axios from "axios";

const BASE_URL = "/healthgate/notices";

// 공지사항 목록 조회
const selectNoticeListApi = cpage => {

    const response = axios({
        url : `${ BASE_URL }`,
        method : "get",
        params : {
            cpage : cpage
        },
        withCredentials: true
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
        },
        withCredentials: true
    });

    return response;
};



// 공지사항 등록 Axios 요청 시 헤더 전달
const insertNoticeApi = (formData) => {

    const response = axios({
         url :`${ BASE_URL }`, 
         method : "post",
         data : formData, 
         headers: {
            'Content-Type': 'multipart/form-data'
         },
         withCredentials: true
    });

    return response;
};

// 공지사항 상세조회
const selectNoticeApi = noticeId => {
   
    const response = axios({
        url : `${ BASE_URL }/${ noticeId }`,
        method : "get",
        withCredentials: true
    });

    return response;
};

// 공지사항 삭제
const deleteNoticeApi = noticeId => {

    const response = axios({
        url : `${ BASE_URL }/${ noticeId }`,
        method : "delete",
        withCredentials: true
    });

    return response;
};

// 공지사항 상세조회 - 수정하기 페이지에서 요청(조회수중복증가방지)
const selectNoticeFormApi = noticeId => {

    const response = axios({
        url : `${ BASE_URL }/${ noticeId }/form`,
        method : "get",
        withCredentials: true
    });

    return response;
}

// 공지사항 수정
const updateNoticeApi = (noticeId, formData) => {

    const response = axios({
        url : `${ BASE_URL }/${ noticeId }`,
        method : "put",
        data: formData,
        headers : {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });

    return response;
}

// 공지사항 첨부파일 다운로드
const downloadNoticeFileApi = (noticeFileId) => {

     const response = axios({
        url: `${ BASE_URL }/download/${noticeFileId}`,
        method : "get",
        withCredentials: true,
        responseType: 'blob'
     });

     return response;
}

export { selectNoticeListApi, searchNoticeListApi, insertNoticeApi, 
         selectNoticeApi, deleteNoticeApi, updateNoticeApi, 
         selectNoticeFormApi, downloadNoticeFileApi, BASE_URL};
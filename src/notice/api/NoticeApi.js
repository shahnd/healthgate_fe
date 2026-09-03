import axios from "axios";

const BASE_URL = "/healthgate/notices";

// 공지사항 목록 조회
const selectNoticeListApi = cpage => {

    const token = localStorage.getItem("access_token");

    const response = axios({
        url : `${ BASE_URL }`,
        method : "get",
        params : {
            cpage : cpage
        },
        headers : {
            Authorization : token ? `Bearer ${token}` : ''
        }
    });

    return response;
};

// 공지사항 목록 검색
const searchNoticeListApi = (cpage, keyword) => {

    const token = localStorage.getItem("access_token");

    const response = axios({
        url : `${ BASE_URL }/search`,
        method : "get",
        params : {
            cpage : cpage,
            keyword : keyword
        },
        headers : {
            Authorization : token ? `Bearer ${token}` : ''
        }
    });

    return response;
};



// 공지사항 등록 Axios 요청 시 헤더 전달
const insertNoticeApi = (formData) => {

    const token = localStorage.getItem("access_token");

    const response = axios({
         url :`${ BASE_URL }/new`, 
         method : "post",
         data : formData, 
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'multipart/form-data'
        }
    });

    return response;
};

// 공지사항 상세조회
const selectNoticeApi = noticeId => {
   
    const token = localStorage.getItem("access_token");

    const response = axios({
        url : `${ BASE_URL }/${ noticeId }`,
        method : "get",
        headers : {
            Authorization : token ? `Bearer ${token}` : ''
        }
    });

    return response;
};

// 공지사항 삭제
const deleteNoticeApi = noticeId => {

    const token = localStorage.getItem("access_token");

    const response = axios({
        url : `${ BASE_URL }/${ noticeId }`,
        method : "delete",
        headers : {
            Authorization : token ? `Bearer ${token}` : ''
        }
    });

    return response;
};

// 공지사항 상세조회 - 수정하기 페이지에서 요청(조회수중복증가방지)
const selectNoticeFormApi = noticeId => {

    const token = localStorage.getItem("access_token");

    const response = axios({
        url : `${ BASE_URL }/${ noticeId }/form`,
        method : "get",
        headers : {
            Authorization : token ? `Bearer ${token}` : ''
        }
    });

    return response;
}

// 공지사항 수정
const updateNoticeApi = (noticeId, formData) => {

    const token = localStorage.getItem("access_token");

    const response = axios({
        url : `${ BASE_URL }/${ noticeId }/edit`,
        method : "post",
        data: formData,
        headers : {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'multipart/form-data'
        }
    });

    return response;
}

// 공지사항 첨부파일 다운로드
const downloadNoticeFileApi = (noticeFileId) => {

     const token = localStorage.getItem("access_token");

     const response = axios({
        url: `${ BASE_URL }/download/${noticeFileId}`,
        method : "get",
        headers : {
            'Authorization': token ? `Bearer ${token}` : '',
        },
         responseType: 'blob'

     });

     return response;
}

export { selectNoticeListApi, searchNoticeListApi, insertNoticeApi, 
         selectNoticeApi, deleteNoticeApi, updateNoticeApi, 
         selectNoticeFormApi, downloadNoticeFileApi, BASE_URL};
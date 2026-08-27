import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect, useRef } from "react";

import { selectNoticeFormApi, updateNoticeApi, BASE_URL } from "../api/NoticeApi";

import { useUserInfo } from "../../store/useAuthStore";

export default function NoticeUpdateComponent() {

     // 실행할 구문
    // 우선 글번호 먼저 뽑기
    const noticeId = useLocation().state.noticeId;

    let navigate = useNavigate();

    const user = useUserInfo();

    // useRef 훅을 통해 input type="file" 요소를 참조할 수 있는 변수 셋팅
    const reupfileRef = useRef(null);

    // 기존의 게시글 내용을 담아둘 겸, 입력값도 표현할 겸 State 형 변수 셋팅
    const [notice, setNotice] = useState({noticeId : "",
                                        title : "",
                                        content : "",
                                        authorId : user.Id, 
                                        createdAt : "",
                                        updatedAt : "",
                                        count : "",
                                        status : ""});
    
    const [noticeFile, setNoticeFile] = useState({ noticeFileId : "", 
                                                   originName : "",
                                                   savedName : "",
                                                   savedPath : "",
                                                   extension: "",
                                                   notices : {noticeId : ""}});                                    

    useEffect(() => {

        const selectNoticeForm = async () => {

            try {

                const response = await selectNoticeFormApi(noticeId);

                // console.log(response.data);

                setNotice(response.data.notice);
                setNoticeFile(response.data.noticeFile || {
                                                noticeFileId: "",
                                                originName: "",
                                                savedName: "",
                                                savedPath: "",
                                                extension: "",
                                                 notices : {noticeId : ""}});

            } catch(error) {

                console.log("공지사항 수정시 상세 조회 요청용 ajax 통신 실패!");
            }
        };

        selectNoticeForm();

    }, []);

    // 입력값이 변경될 때 마다 실행할 이벤트 핸들러 함수
    const handleChange = e => {

        const newNotice = {...notice};

        newNotice[e.target.name] = e.target.value;

        setNotice(newNotice);
    };

    // 수정하기 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const updateNotice = async e => {

        e.preventDefault();
        // > 기본 이벤트 제거

        // console.log(board);

        try {

            // 첨부파일 정보를 얻어내기 (useRef 로 DOM 참조)
            let reupfile = reupfileRef.current;
            // console.log(reupfile);
            // > current 속성에는 input type="file" 요소 객체 자체가 담겨있음!!

            // input type="file" 로 입력받은 파일 정보들은 .files 라는 배열 형식의 속성에 담김
            // console.log(reupfile.files.length);

            // 요청 시 전달값 중 첨부파일이 있다면 그냥 객체가 아닌 FormData 형식의 객체에 담는다.
            const formData = new FormData(); // {}

            formData.append("noticeId", notice.noticeId);
            formData.append("title", notice.title);
            formData.append("content", notice.content);

            // 기존에 있던 첨부파일의 정보들도 같이 넘김

            if (noticeFile && noticeFile.noticeFileId) {
                formData.append("nf.noticeFileId", noticeFile.noticeFileId);
            }
            formData.append("nf.originName", noticeFile?.originName);
            formData.append("nf.savedName", noticeFile?.savedName);
            formData.append("nf.savedPath", noticeFile?.savedPath);
            formData.append("nf.extension", noticeFile?.extension);
            formData.append("nf.notice.noticeId", noticeFile?.notices.noticeId)

            // 기존 정보들을 모두 넘김
            formData.append("createdAt", notice.createdAt);
            formData.append("updatedAt",notice.updatedAt);
            formData.append("count", notice.count);
            formData.append("status", notice.status);
            formData.append("authorId", user.Id);
            // > 작성자의 id 만 넘기고 싶으면 "객체명.필드명" 키값으로 넘기면 됨!!

            // 새로운 첨부파일 정보도 넘기기
            if(reupfile.files.length == 1) {
                // > 새로운 첨부파일이 있을 경우

                formData.append("reupfile", reupfile.files[0]);
            }

            const response = await updateNoticeApi(noticeId, formData);

            console.log(response.data);

            if(response.data == "success") {
                // 공지사항 수정 성공
        
                    alert("공지사항 수정에 성공했습니다.");

                    // 공지사항 상세조회 화면으로 이동
                    navigate(`/notices/${ noticeId }`);
  
            } else {
                // > 공지사항 수정 실패

                alert("공지사항 수정에 실패했습니다.");
            }

        } catch(error) {
            
            console.log("공지사항 수정용 ajax 통신 실패!", error.response || error);
        }
    };

    return (
        <div className="page">
           
            <h2>공지사항 수정</h2>

            <form className="card">
                <table className="form-table">
                    <tbody>
                        <tr>
                            <th width="130">제목</th>
                            <td>
                                <input type="text" name="title" 
                                                   value={ notice.title }
                                                   onChange={ handleChange } required/>
                            </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea name="content" 
                                          value={ notice.content }
                                          onChange={ handleChange } required></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>첨부파일</th>
                            <td>
                                <span>
                                    {
                                        ( noticeFile && noticeFile.originName ? 
                                        (<a href={ `${ BASE_URL }/download/${ noticeFile.savedName }/${ noticeFile.originName }` }>
                                            { noticeFile.originName }
                                         </a>) : 
                                         "첨부파일이 없습니다."
                                        )
                                    }
                                </span>

                                {/* 수정할 첨부파일을 입력받는 용도 */}
                                <input type="file" name="reupfile" ref={ reupfileRef } /> 
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="action-area">
                    <button type="submit" className="btn-primary"
                                          onClick={ updateNotice }>
                        수정하기
                    </button>
                    <button className="btn-secondary" type="button" onClick={() => { navigate("/notices/list");}}>취소</button> 
                </div>

            </form>
        </div>
    );
};
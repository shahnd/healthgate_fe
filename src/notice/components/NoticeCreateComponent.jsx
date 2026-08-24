import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { insertNoticeApi } from "../api/NoticeApi";

export default function NoticeCreateComponent() {

     // 실행할 구문
    let navigate = useNavigate();

    // 입력값을 저장할 객체 형식의 State 형 변수 셋팅
    const [notice, setNotice] = useState({title : "", 
                                          content : ""});

    // input type="file" 의 입력값을 DOM 으로부터 참조해서 가져오기 위한 변수 셋팅
    const upfileRef = useRef(null);
    // > 게시글 작성 페이지 최초 진입 시에는 file 입력값이 null 이 되도록 초기화

    // 입력값의 변화가 있을 때 마다 실행할 이벤트 핸들러 함수
    const handleChange = e => {

        const newNotice = {...notice};

        newNotice[e.target.name] = e.target.value;

        setNotice(newNotice);
    };

    // 작성하기 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const insertNotice = async e => {

        e.preventDefault();
        // > 기본이벤트 제거

        try {
        
            let upfile = upfileRef.current;
            
            // console.log(upfile);
            const formData = new FormData(); // {}

            formData.append("title", notice.title);
            formData.append("content", notice.content);
            formData.append("authorId", notice.authorId);

            if(upfile.files.length == 1) {
                // > 입력받은 파일이 있을 경우

                formData.append("upfile", upfile.files[0]);
        
            }

            const response = await insertNoticeApi(formData);

            if(response.data == "success") {
                // > 공지사항 작성 성공일 경우

                alert("공지사항 작성에 성공했습니다.");

                // 게시글 목록 조회쪽으로 URL 이동
                navigate("/notices/list");

            } else {
                // > 공지사항 작성 실패일 경우

                alert("공지사항 작성에 실패했습니다.");
            }

        } catch(error) {

            console.log("공지사항 작성용 ajax 통신 실패!");
        }
    };
    return (
        <div className="page">
            <h1 className="page-title">공지사항 등록</h1>

            <div className="card">
              <form>  
                <table className="form-table">
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input type="text" name="title" 
                                       value={ notice.title} onChange={ handleChange }/>
                            </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                 <textarea name="content" value={ notice.content }
                                           onChange={ handleChange } ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>첨부파일</th>
                            <td>
                                <input type="file" name="upfile" ref={ upfileRef } />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="action-area">
                    <button type="reset" className="btn-secondary"
                                         onClick={ () => {
                                            setNotice({title : "", 
                                                      content : "", 
                                                      authorId : "admin"});
                                         } }>
                        초기화
                    </button>
                    <button className="btn-secondary" type="button">취소</button> 
                    <button className="btn-primary" type="submit" 
                            onClick={ insertNotice }>등록</button>
                </div>
              </form>  
            </div>
        </div>
    );
};
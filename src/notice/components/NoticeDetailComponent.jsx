import { useParams, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { selectNoticeApi, deleteNoticeApi, BASE_URL } from "../api/NoticeApi";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "@/common/styles/DetailComponent.css";
import "@/common/styles/Common.css"

export default function NoticeDetailComponent() {

     // 실행할 구문
    // 해당 글번호부터 뽑아내기
    const noticeId = useParams().noticeId;

    let navigate = useNavigate();

    // 화면에 출력할 게시글 데이터를 담을 State 형 변수
    const [notice, setNotice] = useState({noticeId : "",
                                        title : "",
                                        employee : {name : ""},
                                        content : "",
                                        createdAt : ""});

    const [noticeFile, setNoticeFile]  = useState({noticeFileId : "", 
                                                   originName : "",
                                                   savedName : "",
                                                   savedPath : "",
                                                   extension: "",
                                                   notices : {noticeId : ""}});
                                                
    // 이 컴포넌트가 브라우저에 다 로딩된 후 딱 한번 실행할 구문
    useEffect(() => {

        const selectNotice = async () => {

            try {

                const response = await selectNoticeApi(noticeId);

                if(response.data != "") {
                    // > 조회된 내용이 있다면

                    setNotice(response.data.notice);
                    setNoticeFile(response.data.noticeFile);

                } else {
                    // > 조회된 내용이 없다면

                    alert("이미 삭제되거나 없는 공지사항입니다.");

                    // 일반게시글 목록 조회 페이지로 이동
                    navigate("/notices/list");
                }

            } catch(error) {

                console.log("공지사항 상세 조회용 ajax 통신 실패!");
            }
        };

        // 여기에 댓글 목록 조회용 async 함수 정의

        selectNotice();

        // 여기서 댓글 목록 조회용 함수 호출

    }, []);

    // 삭제하기 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const deleteNotice = async () => {

        try {

            const response = await deleteNoticeApi(noticeId);

            if(response.data == "success") {
                // > 삭제 성공일 경우

                alert("공지사항 삭제에 성공했습니다.");

                // 공지사항 목록 화면으로 이동
                navigate("/notices/list");

            } else {
                // > 삭제 실패일 경우

                alert("공지사항 삭제에 실패했습니다.");
            }

        } catch(error) {

            console.log("공지사항 삭제용 ajax 통신 실패!");
        }
    };

    return (
        <div className="detail-page">
            <div className="page-header">
                <h1>공지사항 상세</h1>
                <p>{notice.title}</p>
            </div>
        
            <div className="detail-page">
                <section data-detail-section="info">
                    <Card className="detail-info-card">
                        <CardHeader>
                             <CardTitle>공지사항 정보</CardTitle>
                             <CardDescription>공지사항 상세정보</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <dl>
                                <div>
                                    <dt width="130">제목</dt>
                                    <dd>{ notice.title }</dd>
                                </div>
                            
                                <div>
                                    <dt>작성자</dt>
                                    <dd>{ notice.employee.name }</dd>
                                </div>

                                <div>
                                    <dt width="130">작성일</dt>
                                    <dd>{ notice.createdAt?.substring(0, 10) }</dd>
                                </div>
                                <div></div>
                                <div>
                                    <dt>내용</dt>
                                    <dd>
                                        <p style={ {height : "300px"} }>
                                            { notice.content }
                                        </p>
                                    </dd>
                                </div>
                                <div></div>
                                <div>
                                    <dt>첨부파일</dt>
                                    <dd>
                                        {
                                            (noticeFile && noticeFile.originName ? 
                                            (<a href={`${ BASE_URL }/download/${noticeFile.savedName}/${ noticeFile.originName }`}>
                                            {noticeFile.originName}
                                            </a> ) : 
                                            "첨부파일이 없습니다."
                                            )
                                        }
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>

                        <CardFooter>
                            <Button className="primary-button "
                                    onClick={ () => { navigate("/notices/list"); } }>
                                목록으로
                            </Button>
                            
                            <Button className="primary-button"
                                    onClick={ () => { navigate(`/notices/${noticeId}/edit`, {state : {noticeId}}); } }>
                                편집
                            </Button>
                            
                            <Button className="secondary-button"
                                    onClick={ deleteNotice }>
                                삭제
                            </Button>
                        </CardFooter>
                    </Card>
                </section>
            </div>
        </div>
    );
};
import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect, useRef } from "react";

import { selectNoticeFormApi, updateNoticeApi, BASE_URL } from "../api/NoticeApi";

import { useUserInfo } from "../../store/useAuthStore";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import PageHeader from '@/common/components/PageHeader';

import "@/common/styles/FormComponent.css";
import "@/common/styles/Common.css"

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

        try {

            // 첨부파일 정보를 얻어내기 (useRef 로 DOM 참조)
            let reupfile = reupfileRef.current;
            // > current 속성에는 input type="file" 요소 객체 자체가 담겨있음!!

            // input type="file" 로 입력받은 파일 정보들은 .files 라는 배열 형식의 속성에 담김

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

            if(response.data == "success") {
                // 공지사항 수정 성공
        
                    alert("공지사항 수정에 성공했습니다.");

                    // 공지사항 상세조회 화면으로 이동
                    navigate(`/notices/${ noticeId }`,{ state: { isFromList: false }});
  
            } else {
                // > 공지사항 수정 실패

                alert("공지사항 수정에 실패했습니다.");
            }

        } catch(error) {
            
            console.log("공지사항 수정용 ajax 통신 실패!", error.response || error);
        }
    };

    return (
        <div className="detail-page">
           <PageHeader 
            title="공지사항 수정" 
            description="공지사항 정보를 수정 합니다." 
            icon={Megaphone}/>
            
            <Card className="detail-info-card">

                <CardHeader>
                    <CardTitle>공지사항 정보 수정</CardTitle>
                    <CardDescription>
                        공지사항 정보를 수정해 주세요.
                    </CardDescription>
                </CardHeader>

                <form>
                    <CardContent>
                       <dl>
                            <div>
                                <Label htmlFor="title">제목</Label>
                                <Input 
                                    id="title"  
                                    type="text" 
                                    name="title" 
                                    value={ notice.title }
                                    onChange={ handleChange } required/>
                            </div>
                            <div></div>
                            <div>
                                <Label htmlFor="content">내용</Label>
                                <Input 
                                        id="content"
                                        name="content" 
                                        value={ notice.content }
                                        onChange={ handleChange } required/>
                            </div>
                            <div></div>
                            <div>
                                <Label>기존첨부파일</Label>
                                <span>
                                    {
                                        ( noticeFile && noticeFile.originName ? 
                                        (<a href={ `${ BASE_URL }/download/${ noticeFile.originName }` }>
                                            { noticeFile.originName }
                                        </a>) : 
                                        "첨부파일이 없습니다."
                                        )
                                    }
                                </span>
                            </div>
                            <div></div>
                            <div>
                                <Label>수정할첨부파일</Label>
                                {/* 수정할 첨부파일을 입력받는 용도 */}
                                <Input
                                    id="file" 
                                    type="file" 
                                    name="reupfile" 
                                    ref={ reupfileRef } 
                                    /> 
                            </div>
                        </dl>
                    </CardContent>

                    <CardFooter>
                        <Button 
                            type="submit" 
                            size="lg" className="cursor-pointer"
                            variant="outline"
                            onClick={ updateNotice }>
                            수정하기
                        </Button>
                        <Button 
                        className="secondary-button" 
                        type="button" 
                        onClick={() => { navigate("/notices/list");}}>취소</Button> 
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
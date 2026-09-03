import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { insertNoticeApi } from "../api/NoticeApi";

import { useUserInfo } from "../../store/useAuthStore";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import PageHeader from '@/common/components/PageHeader';

import "@/common/styles/FormComponent.css";
import "@/common/styles/Common.css"

export default function NoticeCreateComponent() {

     // 실행할 구문
    let navigate = useNavigate();

    const user = useUserInfo();

    // 입력값을 저장할 객체 형식의 State 형 변수 셋팅
    const [notice, setNotice] = useState({title : "", 
                                          content : "",
                                          authorId : user.id});                                  

    // input type="file" 의 입력값을 DOM 으로부터 참조해서 가져오기 위한 변수 셋팅
    const upfileRef = useRef(null);
    // > 게시글 작성 페이지 최초 진입 시에는 file 입력값이 null 이 되도록 초기화

    // 입력값의 변화가 있을 때 마다 실행할 이벤트 핸들러 함수
    const handleChange = e => {

        const newNotice = {...notice};

        newNotice[e.target.name] = e.target.value;

        setNotice(newNotice);
    };

    // 엔터키 누를때 자동 제출 막음
    const handleKeyDown = (e) => {
        // input 태그 등에서 Enter키 입력 시 submit 방지 (Textarea에서의 Enter는 줄바꿈이므로 제외)
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    };

    // 작성하기 버튼 클릭 시 실행할 이벤트 핸들러 함수
    const insertNotice = async e => {

        e.preventDefault();
        // > 기본이벤트 제거

        try {
        
            let upfile = upfileRef.current;
            
            const formData = new FormData(); // {}

            formData.append("title", notice.title);
            formData.append("content", notice.content);
            formData.append("authorId", user.id);

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
        <div className="detail-page w-full">
            <PageHeader 
            title="공지사항 등록" 
            description="공지사항을 등록 합니다." 
            icon={Megaphone}/>

            <Card className="detail-info-card w-full">
                <CardHeader>
                    <CardTitle>공지사항 등록</CardTitle>
                    <CardDescription>
                        공지사항 정보를 입력해 주세요.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={insertNotice} onKeyDown={handleKeyDown}>  
                    <CardContent>
                        <dl>
                            <div className="full-row">
                                <Label htmlFor="title">제목</Label>
                                <Input 
                                    id="title"
                                    type="text" 
                                    name="title" 
                                    value={ notice.title } 
                                    onChange={ handleChange } 
                                    required/> 
                            </div>
                            
                            <div className="full-row w-full">
                                <Label htmlFor="content">내용</Label>
                                
                                <div className="relative w-full">
                                    <Textarea
                                        id="content"
                                        name="content"
                                        rows={6} // 기본 세로 줄 수 지정 (높이 조절)
                                        className="w-full min-h-[250px] resize-y pb-6" // 최소 높이 설정 및 세로 리사이즈 허용
                                        value={notice.content || ""}
                                        onChange={handleChange}
                                        required/>
                                
                                    {/* 실시간 글자 수 표시 */}
                                    <span className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                                        {(notice.content || "").length}글자
                                    </span> 
                                </div>     
                            </div>
                            
                            <div className="full-row">
                                <Label>첨부파일</Label>
                                <Input 
                                    id="file"
                                    type="file" 
                                    name="upfile" 
                                    ref={ upfileRef } />
                                
                            </div>
                        </dl>
                    </CardContent>

                    <CardFooter>
                        <Button type="button" className="secondary-button"
                                            onClick={ () => {
                                                setNotice({title : "", 
                                                        content : "",
                                                        authorId : user.id});
                                            } }>
                            초기화
                        </Button>
                        <Button size="lg" 
                                className="cursor-pointer" 
                                type="button"
                                onClick={() => { navigate("/notices/list");} }>취소</Button> 
                        <Button size="lg" 
                                className="cursor-pointer" 
                                type="submit" >등록</Button>
                    </CardFooter>
                </form>  
            </Card>
        </div>
    );
};
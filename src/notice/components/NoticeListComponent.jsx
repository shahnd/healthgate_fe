import { useState, useEffect } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";

import { selectNoticeListApi, searchNoticeListApi } from "../api/NoticeApi";

import { useUserInfo } from "../../store/useAuthStore";

import NoticeItemComponent from "./NoticeItemComponent";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Megaphone } from "lucide-react";
import Pagination from "@/common/components/Pagination";
import PageHeader from '@/common/components/PageHeader';

import "@/common/styles/ListComponent.css";
import "@/common/styles/ActionButton.css";

export default function NoticeListComponent() {

    // 실행할 구문
    let navigate = useNavigate();

    // 검색어를 담아둘 State 형 변수 셋팅
    const [keyword, setKeyword] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    const searchKeyword = searchParams.get("keyword") || "";
  
    const cpage = parseInt(searchParams.get("cpage")) || 1;
    const [totalPages, setTotalPages] = useState(1);
  
    const [dataList, setDataList] = useState([]);

    const [pageList, setPageList] = useState([]);

    const user = useUserInfo();

    // 권한 확인
    const userRole = user?.role  || "";
    const canCreateNotice = ["HR_ADMIN", "HEALTH_ADMIN"].includes(userRole);

    useEffect(() => {

     
        if(searchKeyword == "") {
            // > 입력된 검색어가 없을 경우 - 일반 목록 조회 처리

            selectNoticeList();

        } else {
            // > 입력된 검색어가 있을 경우 - 검색 목록 조회 처리

            searchNoticeList();
       
        }        

    }, [cpage, searchKeyword]);

    // 공지사항 목록 조회 함수
    const selectNoticeList = async () => {

        try {

            const response = await selectNoticeListApi(cpage);

            handleResponse(response);

        } catch(error) {

            console.log("공지사항 목록 조회용 ajax 통신 실패!");
        }
    };

    const handleChange = e => {

        setKeyword(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setSearchParams({
            cpage: newPage,
            keyword : searchKeyword
        });
    };

    // 검색 버튼 클릭 시 (검색 최초 진입) 실행할 이벤트 핸들러 함수는 따로 분리
    const handleClick = e => {

        e.preventDefault();
        // > 기본 이벤트 제거
        
        setSearchParams({ cpage : 1, keyword : keyword });
        
    };

    // 검색 요청용 함수
    const searchNoticeList = async () => {

        try {

            const response = await searchNoticeListApi(cpage, searchKeyword);

            // 조회해온 데이터들로 후처리 - 공통 코드 작업
            handleResponse(response);

        } catch(error) {

            console.log("공지사항 검색용 ajax 통신 실패!");
        }
    };

    // list, pi 값을 각각 출력해주는 후처리 공통 함수
    const handleResponse = response => {

        const items = response.data.list;

        const trArr = items.map((item, index) => {

            return (
                <NoticeItemComponent key={ index } item={ item } />
            );
        });

        setDataList(trArr);

        const pageInfo = response.data.pi;
        setTotalPages(pageInfo.maxPage);

        const btnArr = [];

        if(cpage == 1) {

            btnArr.push(
                <button key="prev" className="btn btn-info btn-sm">
                    &lt;
                </button>
            );

        } else {

            btnArr.push(
                <button key="prev" className="btn btn-outline-info btn-sm" 
                        onClick={ () => {  
                            setSearchParams({ cpage : cpage - 1, keyword : searchKeyword });
                        } }>
                    &lt;
                </button>
            );
        }

        for(let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {

            if(cpage == p) {

                btnArr.push(
                    <button key={ p } className="btn btn-info btn-sm">
                        { p }
                    </button>
                    );

            } else {

                btnArr.push(
                    <button key={ p } className="btn btn-outline-info btn-sm" 
                            onClick={ () => {  
                                setSearchParams({ cpage : p, keyword : searchKeyword });  
                            } }>
                        { p }
                    </button>
                );
            }
        }

        if(cpage == pageInfo.maxPage) {

            btnArr.push(
                <button key="next" className="btn btn-info btn-sm">
                    &gt;
                </button>
            );

        } else {

            btnArr.push(
                <button key="next" className="btn btn-outline-info btn-sm" 
                        onClick={ () => { 
                            
                            setSearchParams({ cpage : cpage + 1, keyword : searchKeyword });
                        } }>
                    &gt;
                </button>
            );
        }

        setPageList(btnArr);

    };

    return(
        <div className="list-page">
            <PageHeader 
            title="공지사항 목록" 
            description="공지사항 정보 입니다." 
            icon={Megaphone}/>
           
           {/* 검색창 */}
            <form className="list-toolbar">
                <div>
                    <Input type="text" 
                        name="keyword"
                        placeholder="제목을 입력하세요"
                        value={ keyword } 
                        onChange={ handleChange }
                        style={{ flex: "0 0 350px", width: "350px" }} />
                    <Button type="submit" size="sm"
                            onClick={ handleClick }>검색</Button>
                </div>
                {canCreateNotice && (
                    <Button size="lg" className="cursor-pointer" type="button" onClick={ () => navigate("/notices/new")}>
                            + 공지사항 등록
                    </Button>
                )}
                
            </form>
           
           
           {/* 공지사항 목록 */}
           <div className="list-table-wrapper">
               <Table>
                   <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">번호</TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead>작성자</TableHead>
                        <TableHead>등록일</TableHead>
                        <TableHead>조회수</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                        { dataList }
                   </TableBody>
               </Table>
           </div>

           <Pagination
                    page={cpage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange} />
        </div>
    );
}


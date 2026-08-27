import { useState, useEffect } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";

import { selectNoticeListApi, searchNoticeListApi } from "../api/NoticeApi";

import NoticeItemComponent from "./NoticeItemComponent";


export default function NoticeListComponent() {

    // 실행할 구문
    let navigate = useNavigate();

    // 검색어를 담아둘 State 형 변수 셋팅
    const [keyword, setKeyword] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    const searchKeyword = searchParams.get("keyword") || "";
  
    const cpage = parseInt(searchParams.get("cpage")) || 1;
  
    const [dataList, setDataList] = useState([]);

    const [pageList, setPageList] = useState([]);

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

            // console.log(response.data);

            // 조회해온 데이터들로 후처리 - 공통 코드 작업
            handleResponse(response);

        } catch(error) {

            console.log("공지사항 검색용 ajax 통신 실패!");
        }
    };

    // list, pi 값을 각각 출력해주는 후처리 공통 함수
    const handleResponse = response => {

        // 실제 tbody 에 들어갈 목록데이터 처리
        // 우선 response.data.list 를 별도의 변수로 옮겨담기
        const items = response.data.list;

        const trArr = items.map((item, index) => {

            return (
                <NoticeItemComponent key={ index } item={ item } />
            );
        });

        setDataList(trArr);

        // paging-area 에 들어갈 데이터 후처리
        // 우선 response.data.pi 를 별도의 변수로 옮겨담기
        const pageInfo = response.data.pi;

        // console.log(pageInfo);
        // > pageInfo.startPage ~ pageInfo.endPage 까지 1씩 증가시키면서 페이징바 버튼 생성
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
                            /* setCpage(cpage - 1); */  
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
                                /* setCpage(p); */ 
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
                            /* setCpage(cpage + 1); */ 
                            setSearchParams({ cpage : cpage + 1, keyword : searchKeyword });
                        } }>
                    &gt;
                </button>
            );
        }

        setPageList(btnArr);

    };

    return(
        <div className="page">
           <h1 className="card">공지사항 목록</h1>
           
           {/* 검색창 영역 */}
           <div className="card">
                <form className="search-form">
                   <input type="text" name="keyword" placeholder="제목을 입력하세요"
                           value={ keyword } onChange={ handleChange } />
                    <button type="submit" className="btn-primary"
                            onClick={ handleClick }>검색</button>
                </form>
           </div>
           
           {/* 공지사항 목록 */}
           <div className="card">
               <table className="data-table">
                   <thead>
                      <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>등록일</th>
                        <th>조회수</th>
                      </tr>
                   </thead>
                   <tbody>
                        { dataList }
                   </tbody>
               </table>
               
               {/* 등록 버튼 */}
               <div className="action-area">
                   <button className="btn-primary" type="button" onClick={ () => { navigate("/notices/new"); } }>
                     공지사항 등록
                   </button>
               </div>
 
               {/* 페이징바 */}
               <div className="pagination">{ pageList }</div>
           </div>
        </div>
    );
}


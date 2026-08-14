import { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { selectHospitalListApi, searchHospitalListApi } from "../api/hospitalApi";

import HospitalItemComponent from "./HospitalItemComponent";

import '../styles/Hospital.css'

export default function HospitalListComponent() {
 
    // 실행할 구문
    let navigate = useNavigate();

    // 검색어를 담아둘 변수셋팅
    const [keyword, setKeyword] = useState("");

    // 현재 URL 의 QueryString 을 담는 객체 셋팅
    const [searchParams, setSerchParams] = useSearchParams();

    // 검색어 쿼리스트링 처리
    const searchKeyword = searchParams.get("keyword") || "";

    // 페이징바 쿼리스트링 처리
    const cpage = parseInt(searchParams.get("cpage")) || 1;
    
    // 조회된 데이터를 배열에 담아둘 변수 셋팅
    const [dataList,setDataList] = useState([]);

    // 페이징바 배열에 담아둘 변수 셋팅
    const [pageList, setPageList] = useState([]);

    // 검진가능 병원 목록 조회 함수
    const selectHospitalList = async () => {

        try {

            const response = await selectHospitalListApi(cpage);

            handleResponse(response);
        } catch(error) {

            console.log("검진가능 병원 목록 조회용 ajax 통신 실패!");
        }
    };

    // 검색어 입력 내용이 변경될 때 마다 실행할 이벤트 핸들러 함수
    const handleChange = e => {
        
        setKeyword(e.target.value);
    };

    // 검색어 버튼 클릭 시 (검색 최초 진입) -> 이벤트 핸들러 함수만 따로 분리
    const handleClick = e => {

        e.preventDefault();
        // > 기본 이벤트 제거

        setSearchParams({ cpage : 1, keyword : keyword });
    };

    // 검색 요청 함수
    const searchHospitalList = async () => {

        try {

            const response = await searchHospitalListApi(cpage, searchKeyword);

            handleResponse(response);

        } catch(error) {

            console.log("검진가능 병원 검색용 ajax 통신 실패!");
        }
    };

    // list, pi 값을 출력해주는 후처리 함수
    const handleResponse = response => {

        const items = response.data.list;

        const trArr = items.map((item,index) => {
          
            return (
                <HospitalItemComponent key={ index } item={ item } />
            );
        });

        setDataList(trArr);

        const pageInfo = response.data.pi;

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
    }

    useEffect(() => {
                
        if(searchKeyword == "") {
            // > 입력된 검색어가 있을 경우 - 검색 목록 조회 처리

            selectHospitalList();

        } else {
            // 입력된 검색어가 있을 경우 - 검색 목록 조회 처리
            searchHospitalList();
        }

    },[cpage, searchKeyword]);

    return(
        <div>
            <div>
                <br />
                <h1 align="left"> 병원 검진가능 조회 목록</h1>
                <div align="right" style={{width : "600px"} }>
                    <button type="button" className="btn btn-outline-secondary btn-sm"
                            onClick={ () => { navigate("/hospital/new");}}>
                        + 병원등록
                    </button>
                </div>
            </div>

            <br/><br/>
            {/* 검색창 */}
            <div align="center" className="search-area">
                <form>
                    <input type="text" name="keyword" placeholder="병원이름"
                           value={ keyword } onChange={ handleChange } />
                    <button type="submit"
                            onClick={ handleClick }>검색</button>
                    <button type="reset">초기화</button>
                                           
                </form>
            </div>

            <br/><br/>

            <table className="list-area table-hover">
                <thead>
                    <tr>
                        <th width="100">병원명</th>
                        <th width="400">주소</th>
                        <th width="300">전화번호</th>
                        <th width="300">검진가능항목</th>
                        <th width="100">관리</th>
                    </tr>
                </thead>
                <tbody>{ dataList }</tbody>
            </table>

            <br></br>

            <div align="center" className="paging-area">{ pageList }</div>
        </div>
    );
}
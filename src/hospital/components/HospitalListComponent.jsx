import { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { searchHospitalListApi } from "../api/hospitalApi";

import HospitalItemComponent from "./HospitalItemComponent";

import "../styles/HospitalListComponent.css";

export default function HospitalListComponent() {
 
    // 실행할 구문
    let navigate = useNavigate();

    const [keywordName, setKeywordName] = useState("");

    const [keywordAddress, setKeywordAddress] =useState("");

    const [isGeneral,setIsGeneral] = useState(false);

    const [isStomachCancer,setIsStomachCancer] = useState(false);

    const [isColonCancer,setIsColonCancer] = useState(false);

    const [isLiverCancer,setIsLiverCancer] = useState(false);

    const [isLungCancer,setIsLungCancer] = useState(false);

    // 현재 URL 의 QueryString 을 담는 객체 셋팅
    const [searchParams, setSearchParams] = useSearchParams();

    // 검색어 쿼리스트링 처리
    const searchKeywordName = searchParams.get("keywordName") || ""; 

    const searchKeywordAddress =searchParams.get("keywordAddress") || "";

    const searchIsGeneral = searchParams.get("isGeneral") === "true"; 

    const searchIsStomachCancer = searchParams.get("isStomachCancer") === "true";

    const searchIsColonCancer = searchParams.get("isColonCancer") === "true";

    const searchIsLiverCancer = searchParams.get("isLiverCancer") === "true";

    const searchIsLungCancer = searchParams.get("isLungCancer") === "true";


    // 페이징바 쿼리스트링 처리
    const cpage = parseInt(searchParams.get("cpage")) || 1;
    
    // 조회된 데이터를 배열에 담아둘 변수 셋팅
    const [dataList,setDataList] = useState([]);

    // 페이징바 배열에 담아둘 변수 셋팅
    const [pageList, setPageList] = useState([]);

    // 검진가능 병원 목록,검색 조회 함수
    const selectSearchHospitalList = async () => {

        try {
            const params = {
                cpage,
                keywordName,
                keywordAddress,
                isGeneral : isGeneral ? true : null,
                isStomachCancer : isStomachCancer ? true : null,
                isColonCancer : isColonCancer ? true : null,
                isLiverCancer : isLiverCancer ? true : null,
                isLungCancer : isLungCancer ? true : null,

            };
            const response = await searchHospitalListApi(params);
            console.log(response.data);
            handleResponse(response);

            // console.log(response.data);
        } catch(error) {
            
            console.log("검진가능 병원 목록 조회용 ajax 통신 실패!");
        }
    };

    // 검색어 입력 내용이 변경될 때 마다 실행할 이벤트 핸들러 함수
    const handleInputChange = e => {
        const { name, type, value, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        const stateSetters = {
            keywordName: setKeywordName,
            keywordAddress: setKeywordAddress,
            isGeneral: setIsGeneral,
            isStomachCancer: setIsStomachCancer,
            isColonCancer: setIsColonCancer,
            isLiverCancer: setIsLiverCancer,
            isLungCancer: setIsLungCancer,
        };

        stateSetters[name]?.(val);
    };


    // 검색어 버튼 클릭 시 (검색 최초 진입) -> 이벤트 핸들러 함수만 따로 분리
    const handleClick = e => {

        e.preventDefault();
        // > 기본 이벤트 제거

        setSearchParams({ cpage : 1, 
            keywordName,
            keywordAddress,
            isGeneral,
            isStomachCancer,
            isColonCancer,
            isLiverCancer,
            isLungCancer });
    };

    const handleReset = () => {
        // 1. 검색어 State 초기화
        setKeywordName("");
        setKeywordAddress("");

        // 2. 체크박스 State 초기화 (false로 설정)
        setIsGeneral(false);
        setIsStomachCancer(false);
        setIsColonCancer(false);
        setIsLiverCancer(false);
        setIsLungCancer(false);

        // 3.초기화 후 바로 전체 목록을 다시 조회
        navigate('/hospitals/list');
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
                                setSearchParams({ cpage : cpage - 1, 
                                                keywordName : searchKeywordName,
                                                keywordAddress : searchKeywordAddress,
                                                isGeneral : searchIsGeneral,
                                                isStomachCancer : searchIsStomachCancer,
                                                isColonCancer : searchIsColonCancer,
                                                isLiverCancer : searchIsLiverCancer,
                                                isLungCancer : searchIsLungCancer });
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
                               
                                setSearchParams({ cpage : p, 
                                                keywordName,
                                                keywordAddress,
                                                isGeneral,
                                                isStomachCancer,
                                                isColonCancer,
                                                isLiverCancer,
                                                isLungCancer
                                });  
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
                            
                            setSearchParams({ cpage : cpage + 1, 
                                            keywordName,
                                            keywordAddress,
                                            isGeneral,
                                            isStomachCancer,
                                            isColonCancer,
                                            isLiverCancer,
                                            isLungCancer
                             });
                        } }>
                    &gt;
                </button>
            );
        }

        setPageList(btnArr);
    }

    useEffect(() => {
                
     if(searchKeywordName == "" &&
        searchKeywordAddress == "" &&
        searchIsGeneral == false &&
        searchIsStomachCancer == false &&
        searchIsColonCancer == false &&
        searchIsLiverCancer == false &&
        searchIsLungCancer == false 
        ) {
            // > 입력된 검색어가 없을 경우 - 검색 목록 조회 처리
            
            selectSearchHospitalList();

        } else {
            // 입력된 검색어가 있을 경우 - 검색 목록 조회 처리
            selectSearchHospitalList();
        }

    },[cpage, 
        searchKeywordName,
        searchKeywordAddress,
        searchIsGeneral,
        searchIsStomachCancer,
        searchIsColonCancer,
        searchIsLiverCancer,
        searchIsLungCancer]);

    return(
        <div className="page">
             <h1 className="page-title"> 병원 검진가능 조회 목록</h1>
            <div>
                <br />
                
                <div className="action-area">
                    <button type="button" className="btn-primary"
                            onClick={ () => { navigate("/hospitals/new");}}>
                        + 병원등록
                    </button>
                </div>
            </div>

            <br/><br/>
            {/* 검색창 */}
            <div className="card">
                <form className="search2-form">
                    <input type="text" 
                        name="keywordName" 
                        placeholder="병원이름"
                        value={ keywordName } 
                        onChange={ handleInputChange } /> 
                
                    <input type="text" 
                        name="keywordAddress" 
                        placeholder="병원주소"
                        value={ keywordAddress } 
                        onChange={ handleInputChange } />   
                    <div>
                        검진 가능 항목 : 
                        <label>
                            <input
                            type="checkbox"
                            name="isGeneral"
                            checked={isGeneral}
                            onChange={handleInputChange}
                            />
                            일반검진
                        </label>
                        <label>
                            <input
                            type="checkbox"
                            name="isStomachCancer"
                            checked={isStomachCancer}
                            onChange={handleInputChange}
                            />
                            위암검진
                        </label>
                        <label>
                            <input
                            type="checkbox"
                            name="isColonCancer"
                            checked={isColonCancer}
                            onChange={handleInputChange}
                            />
                            대장암검진
                        </label>
                        <label>
                            <input
                            type="checkbox"
                            name="isLiverCancer"
                            checked={isLiverCancer}
                            onChange={handleInputChange}
                            />
                            간암검진
                        </label>
                        <label>
                            <input
                            type="checkbox"
                            name="isLungCancer"
                            checked={isLungCancer}
                            onChange={handleInputChange}
                            />
                            폐암검진
                        </label>
                    </div>

                    <button type="button" className="btn-secondary"
                    onClick={handleReset}
                        >초기화</button>
            
                    <button type="submit" className="btn-primary"
                    onClick={ handleClick }>검색</button> 

                </form>
            </div>

            <br/><br/>
            <div className="card">
              <table className="data-table">
                <thead>
                    <tr>
                        <th>병원명</th>
                        <th>주소</th>
                        <th>전화번호</th>
                        <th>검진가능항목</th>
                    </tr>
                </thead>
                <tbody>{ dataList }</tbody>
              </table>
            </div>
            <br></br>

            <div align="center" className="pagination">{ pageList }</div>
        </div>
    );
}
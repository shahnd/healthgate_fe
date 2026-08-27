import { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { searchHospitalListApi } from "../api/hospitalApi";

import HospitalItemComponent from "./HospitalItemComponent";

export default function HospitalListComponent() {
 
    // 실행할 구문
    let navigate = useNavigate();

    // 검색어를 담아둘 변수셋팅
    const [name, setName] = useState("");
    
    const [address, setAddress] = useState("");

    const [isGeneralExamAvailable, setIsGeneralExamAvailable] = useState(false);
    
    const [isStomachCancerExamAvailable, setIsStomachCancerExamAvailable] = useState(false);

    const [isColonCancerExamAvailable, setIsColonCancerExamAvailable] = useState(false);

    const [isLiverCancerExamAvailable, setIsLiverCancerExamAvailable] = useState(false);

    const [isLungCancerExamAvailable, setIsLungCancerExamAvailable] = useState(false);

    // 현재 URL 의 QueryString 을 담는 객체 셋팅
    const [searchParams, setSearchParams] = useSearchParams();

    // 검색어 쿼리스트링 처리
    const searchName = searchParams.get("name") || "";

    const searchAddress = searchParams.get("address") || "";

    const searchIsGeneral = searchParams.get("isGeneralExamAvailable") === "true";

    const searchIsStomachCancer = searchParams.get("isStomachCancerExamAvailable") === "true";

    const searchIsColonCancer = searchParams.get("isColonCancerExamAvailable") === "true";

    const searchIsLiverCancer = searchParams.get("isLiverCancerExamAvailable") === "true";

    const searchIsLungCancer = searchParams.get("isLungCancerExamAvailable") === "true";

    // 페이징바 쿼리스트링 처리
    const cpage = parseInt(searchParams.get("cpage")) || 1;
    
    // 조회된 데이터를 배열에 담아둘 변수 셋팅
    const [dataList,setDataList] = useState([]);

    // 페이징바 배열에 담아둘 변수 셋팅
    const [pageList, setPageList] = useState([]);

    // 검진가능 병원 목록,검색 조회 함수
    const selectSearchHospitalList = async () => {

        try {

            const response = await searchHospitalListApi(cpage,
                                                         searchName,
                                                         searchAddress,
                                                         searchIsGeneral,
                                                         searchIsStomachCancer,
                                                         searchIsColonCancer,
                                                         searchIsLiverCancer,
                                                         searchIsLungCancer);

            handleResponse(response);
        } catch(error) {

            console.log("검진가능 병원 목록 조회용 ajax 통신 실패!");
        }
    };

    // 검색어 입력 내용이 변경될 때 마다 실행할 이벤트 핸들러 함수
    const handleChangeName = e => {
        
        setName(e.target.value);
    };

    const handleChangeAddress = e => {
        
        setAddress(e.target.value);
    };

    const handleChangeIsGeneral = e => {
        
        setIsGeneralExamAvailable(e.target.value);
    };

    const handleChangeIsStomachCancer = e => {
        
        setIsStomachCancerExamAvailable(e.target.value);
    };

    const handleChangeIsColonCancer = e => {
        
        setIsColonCancerExamAvailable(e.target.value);
    };

    const handleChangeIsLiverCancer = e => {
        
        setIsLiverCancerExamAvailable(e.target.value);
    };

    const handleChangeIsLungCancer = e => {
        
        setIsLungCancerExamAvailable(e.target.value);
    };

    // 검색어 버튼 클릭 시 (검색 최초 진입) -> 이벤트 핸들러 함수만 따로 분리
    const handleClick = e => {

        e.preventDefault();
        // > 기본 이벤트 제거

        setSearchParams({ cpage : 1, 
                          name : name,
                          address : address,
                          isGeneralExamAvailable : isGeneralExamAvailable,
                          isStomachCancerExamAvailable : isStomachCancerExamAvailable, 
                          isColonCancerExamAvailable : isColonCancerExamAvailable,
                          isLiverCancerExamAvailable : isLiverCancerExamAvailable,
                          isLungCancerExamAvailable : isLungCancerExamAvailable});
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
                                                  name : searchName,
                                                  address : searchAddress,
                                                  isGeneralExamAvailable : searchIsGeneral,
                                                  isStomachCancerExamAvailable : searchIsStomachCancer, 
                                                  isColonCancerExamAvailable : searchIsColonCancer,
                                                  isLiverCancerExamAvailable : searchIsLiverCancer,
                                                  isLungCancerExamAvailable : searchIsLungCancer});
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
                                                  name : searchName,
                                                  address : searchAddress,
                                                  isGeneralExamAvailable : searchIsGeneral,
                                                  isStomachCancerExamAvailable : searchIsStomachCancer, 
                                                  isColonCancerExamAvailable : searchIsColonCancer,
                                                  isLiverCancerExamAvailable : searchIsLiverCancer,
                                                  isLungCancerExamAvailable : searchIsLungCancer });  
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
                                              name : searchName,
                                              address : searchAddress,
                                              isGeneralExamAvailable : searchIsGeneral,
                                              isStomachCancerExamAvailable : searchIsStomachCancer, 
                                              isColonCancerExamAvailable : searchIsColonCancer,
                                              isLiverCancerExamAvailable : searchIsLiverCancer,
                                              isLungCancerExamAvailable : searchIsLungCancer });
                        } }>
                    &gt;
                </button>
            );
        }

        setPageList(btnArr);
    }

    useEffect(() => {
                
     if(searchName == "" && 
        searchAddress == "" &&
        searchIsGeneral == false &&
        searchIsStomachCancer == false &&
        searchIsColonCancer == false &&
        searchIsLiverCancer == false &&
        searchIsLungCancer == false ) {
            // > 입력된 검색어가 없을 경우 - 검색 목록 조회 처리
          
            selectSearchHospitalList();

        } else {
            // 입력된 검색어가 있을 경우 - 검색 목록 조회 처리
            selectSearchHospitalList();
        }

    },[cpage, 
       searchName,
       searchAddress,
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
                <form>
                    <table>
                       <tbody>
                          <tr>
                            <th>
                                <input type="text" name="name" placeholder="병원이름"
                                    value={ name } onChange={ handleChangeName } /> 
                            </th>
                            <th>
                                 <input type="text" name="address" placeholder="병원주소"
                                    value={ address } onChange={ handleChangeAddress } />   
                            </th>
                            <th>
                                검진 가능 항목 : 
                                <select className="examAvailable">
                                    <option name="isGeneralExamAvailable" 
                                            value={ isGeneralExamAvailable }
                                            onChange={ handleChangeIsGeneral }>일반검진</option>

                                    <option name="isStomachCancerExamAvailable" 
                                            value={ isStomachCancerExamAvailable }
                                            onChange={ handleChangeIsStomachCancer }>위암검진</option>

                                    <option name="isColonCancerExamAvailable"
                                            value={ isColonCancerExamAvailable }
                                            onChange={ handleChangeIsColonCancer }>대장암검진</option>

                                    <option name="isLiverCancerExamAvailable" 
                                            value={ isLiverCancerExamAvailable }
                                            onChange={ handleChangeIsLiverCancer }>간암검진</option>

                                    <option name="isLungCancerExamAvailable" 
                                            value={ isLungCancerExamAvailable }
                                            onChange={ handleChangeIsLungCancer }>폐암검진</option>
                                </select>
                            </th>
                            <td>
                                 <button type="reset" className="btn-secondary">초기화</button>
                            </td>
                            <td>
                                 <button type="submit" className="btn-primary"
                                    onClick={ handleClick }>검색</button>
                            </td>
                          </tr> 
                        </tbody> 
                    </table>                       
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

            <div align="center" className="paging-area">{ pageList }</div>
        </div>
    );
}
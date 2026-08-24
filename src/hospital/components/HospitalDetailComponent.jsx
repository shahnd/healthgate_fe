import { useParams, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { selectHospitalApi, deleteHospitalApi } from "../api/hospitalApi";

export default function HospitalDetailComponent() {

    // 실행할 구문
    const hospitalId = useParams().hospitalId;

    let navigate = useNavigate();

    // State 형 변수
    const [hospital, setHospital] = useState({hospitalId : "",
                                            name : "",
                                            address : "",
                                            phone : "",
                                            url : "",
                                            description : "",
                                            isGeneralExamAvailable : false,
                                            isStomachCancerExamAvailable : false,
                                            isColonCancerExamAvailable : false,
                                            isLiverCancerExamAvailable : false,
                                            isLungCancerExamAvailable : false,
                                            createdAt : ""});

    useEffect(() => {

        const selectHospital = async () => {

            try {

                const response = await selectHospitalApi(hospitalId);

                // console.log(response.data);

                if(response.data != "") {
                    // > 조회된 내용이 있다면

                    setHospital(response.data);

                } else {
                    // > 조회된 내용이 없다면

                    alert("이미 삭제되거나 없는 병원입니다.");

                    // 목록 페이지로 이동
                    navigate("/hospitals/list");
                }

            } catch(error) {

                console.log("검진 가능 병원 상세 조회용 ajax 통신 실패!");
            }
        };

        selectHospital();

    }, []);

    // 삭제 버튼 클릭 함수
    const deleteHospital = async () => {

        try {

            const response = await deleteHospitalApi(hospitalId);

            // console.log(response.data);

            if(response.data == "success") {
                // > 삭제 성공일 경우

                alert("검진 가능 병원 삭제에 성공했습니다.");

                navigate("/hospitals/list");

            } else {
                // > 삭제 실패일 경우

                alert("검진 가능 병원 삭제에 실패했습니다.");
            }

        } catch(error) {

            console.log("검진가능 병원 삭제용 ajax 통신 실패!");
        }
    };

    // return 구문
    return (
        <div className="page">
        
          <div className="card">
           <table className="form-table">
                 <tbody>
                    <tr>
                        <th>병원명</th>
                        <td colSpan="5">{ hospital.name }</td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td colSpan="5">{ hospital.address }</td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td colSpan="5">{ hospital.phone }</td>
                    </tr>
                    <tr>
                        <th>검진가능 항목</th>
                        <td>{ hospital.isGeneralExamAvailable }</td>
                        <td>{ hospital.isStomachCancerExamAvailable }</td>
                        <td>{ hospital.isColonCancerExamAvailable } </td>
                        <td>{ hospital.isLiverCancerExamAvailable }</td>
                        <td>{ hospital.isLungCancerExamAvailable } </td>
                    </tr>
                    <tr>
                        <th>병원 홈페이지</th>
                        <td colSpan="5">{ hospital.url }</td>
                    </tr>
                    <tr>
                        <th>병원 안내</th>
                        <td colSpan="5">
                            <p style={ {height : "200px"} }>
                                { hospital.description }
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th>등록일</th>
                        <td colSpan="5">{ hospital.createdAt }</td>
                    </tr>
                    <tr>
                        <th>수정일</th>
                        <td colSpan="5">{ hospital.address }</td>
                    </tr>
                 </tbody>
           </table>

           <br/><br/>

           <div className="action-area">
                <button className="btn-primary"
                        onClick={ () => { navigate("/hospitals/list"); } }>
                    목록으로
                </button>
                &nbsp;&nbsp;
                <button className="btn-primary"
                        onClick={ () => { navigate("/hospitals/${ hospitalId }", {state : {hospitalId}}); } }>
                    수정하기
                </button>
                &nbsp;&nbsp;
                <button className="btn-secondary"
                        onClick={ deleteHospital }>
                    삭제하기
                </button>
           </div>
          </div>
        </div>
    )
}
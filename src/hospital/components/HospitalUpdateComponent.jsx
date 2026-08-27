import { useLocation, useNavigate } from "react-router-dom";

import { useState,useEffect } from "react";

import { selectHospitalApi, updateHospitalApi } from "../api/hospitalApi";

export default function HospitalUpdateComponent() {

    // 실행할 구문
    const hospitalId = useLocation().state.hospitalId;

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
                                            createdAt : "",
                                            status : ""})

    useEffect(() => {

        const selectHospital = async () => {
            try {

                const response = await selectHospitalApi(hospitalId);

                setHospital(response.data);

            } catch(error) {

                console.log("검진가능 병원 수정용 ajax 통신 실패!");
            }
        };

        selectHospital();

    },[]);
    
    // 입력값 변경될 때 마다 실행할 함수
    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;

        setHospital((prev) => ({
            ...prev,
            // input이 체크박스면 checked(true/false) 값을, 일반 텍스트면 value 값을 반영
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const  handleReset = () => {
            
    };


    // 수정 버튼 클릭 시 실행할 함수
    const updateHospital = async e => {
        e.preventDefault();
        // 전송 전 주소 데이터가 있는지 콘솔로 확인
        console.log("수정 요청 데이터:", hospital);

        // address 필드가 누락되지 않도록 확인
        const params = new URLSearchParams();
            params.append("name", hospital.name);
            params.append("address", hospital.address);
            params.append("phone", hospital.phone);
            params.append("url", hospital.url);
            params.append("description", hospital.description);
            params.append("createdAt",hospital.createdAt);
            params.append("status",hospital.status);

            // boolean 값을 문자열("true"/"false")로 변환하여 전송
            const isChecked = (key1, key2) => (hospital[key1] || hospital[key2] ? "true" : "false");

            // is가 붙은 키와 안 붙은 키를 둘 다 전송하여 자바빈 매핑 이슈를 완전 회피
            const exams = [
                { base: "GeneralExamAvailable", key1: "generalExamAvailable", key2: "isGeneralExamAvailable" },
                { base: "StomachCancerExamAvailable", key1: "stomachCancerExamAvailable", key2: "isStomachCancerExamAvailable" },
                { base: "ColonCancerExamAvailable", key1: "colonCancerExamAvailable", key2: "isColonCancerExamAvailable" },
                { base: "LiverCancerExamAvailable", key1: "liverCancerExamAvailable", key2: "isLiverCancerExamAvailable" },
                { base: "LungCancerExamAvailable", key1: "lungCancerExamAvailable", key2: "isLungCancerExamAvailable" }
            ];

  exams.forEach(item => {
    const val = isChecked(item.key1, item.key2);
    // is가 안 붙은 형태
    params.append(item.key1, val);
    // is가 붙은 형태
    params.append(item.key2, val);
  });

        try {
            const response = await updateHospitalApi(hospitalId, params);

             if(response.data == "success") {
                // 수정 성공

                alert("검진가능 병원 수정에 성공했습니다.");

                // 해당 수정글의 상세조회로 이동
                navigate(`/hospitals/${ hospitalId }`);

            } else {
                // > 수정 실패

                alert("검진가능 병원 수정에 실패했습니다.");
            }

        } catch (error) {

            console.error("수정 실패", error);
        }
    };

    return (
        <div className="page">
            <h1 className="page-title">검진 가능 병원 수정</h1>

            <div className="card">
                <form>
                    <table className="form-table">
                        <tbody>
                            <tr>
                                <th>제목</th>
                                <td>
                                    <input type="text" 
                                    name="name" 
                                    value={ hospital.name }
                                    onChange={ handleInputChange } required />
                                </td>                                
                            </tr>
                            <tr>
                                <th>주소</th>
                                <td>
                                    <input type="text" 
                                    name="address" 
                                    value={ hospital.address } 
                                    onChange={ handleInputChange } required />
                                </td>
                            </tr>
                            <tr>
                                <th>전화번호</th>
                                <td>
                                    <input type="text" 
                                    name="phone" 
                                    value={ hospital.phone }
                                    onChange={ handleInputChange } />
                                </td>
                            </tr>
                            <tr>
                                <th>url</th>
                                <td>
                                    <input type="text" 
                                    name="url" 
                                    value={ hospital.url }
                                    onChange={ handleInputChange } />
                                </td>
                            </tr>
                            <tr>
                                <th>안내문구</th>
                                <td><textarea name="description" 
                                     value={ hospital.description }
                                     onChange= { handleInputChange } /> 
                                </td>
                            </tr>
                            <tr>
                                <th>검진가능 항목</th>
                                <td>
                                    <label>
                                        일반검진
                                        <input type="checkbox"
                                        name="generalExamAvailable"
                                        checked={ Boolean(hospital.generalExamAvailable)}
                                        onChange={handleInputChange} />
                                    </label>
                                    <label>
                                        위암검진
                                        <input type="checkbox"
                                        name="stomachCancerExamAvailable"
                                        checked={ Boolean(hospital.stomachCancerExamAvailable)}
                                        onChange={handleInputChange} />
                                    </label>
                                    <label>
                                        대장암검진
                                        <input type="checkbox"
                                        name="colonCancerExamAvailable"
                                        checked={ Boolean(hospital.colonCancerExamAvailable)}
                                        onChange={handleInputChange} />
                                    </label>  
                                    <label>
                                        간암검진
                                        <input type="checkbox"
                                        name="liverCancerExamAvailable"
                                        checked={ Boolean(hospital.liverCancerExamAvailable)} 
                                        onChange={handleInputChange} />
                                    </label>
                                    <label>
                                        폐암검진
                                        <input type="checkbox"
                                        name="lungCancerExamAvailable"
                                        checked={ Boolean(hospital.lungCancerExamAvailable)}
                                        onChange={handleInputChange} /> 
                                    </label> 
                                </td>
                            </tr>
                        </tbody>
                    </table>

                <div className="action-area">
                    <button type="submit" className="btn btn-outline-primary btn-sm"
                                            onClick={ updateHospital }>
                                수정하기
                    </button>
                
                    <button type="button" className="btn btn-outline-secondary btn-sm"
                                            onClick={ handleReset }>
                                초기화           
                    </button>
                </div>
              </form>
            </div>
        </div>
    );
        
}
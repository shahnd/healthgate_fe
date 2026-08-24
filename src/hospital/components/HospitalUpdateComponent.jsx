import { useLocation, useNavigate } from "react-router-dom";

import { useState,useEffect } from "react";

import { selectHospitalApi, updateHospitalApi } from "../api/hospitalApi";

export default function HospitalUpdateComponent() {

    // 실행할 구문
    const hospitalId = useLocation().state.hospitalId;

    let navigate = useNavigate();

    // State 형 변수
    const [hospital, setHospital] = useState({ hospitalId : "",
                                               name : "",
                                               address : "",
                                               phone : "",
                                               url : "",
                                               description : "",
                                               isGeneralExamAvailable : false,
                                               isStomachCancerExamAvailable : false,
                                               isColonCancerExamAvailable : false,
                                               isLiverCancerExamAvailable : false,
                                               isLungCancerExamAvailable : false});

    useEffect(() => {

        const selectHospital = async () => {
            try {

                const response = await selectHospitalApi(hospitalId);

                // console.log(response.data);

                setHospital(response.data);

            } catch(error) {

                console.log("검진가능 병원 수정용 ajax 통신 실패!");
            }
        };

        selectHospital();

    },[]);
    
    // 입력값 변경될 때 마다 실행할 함수
    const handleChange = e => {

        const { name, value, type, checked } = e.target;

        setHospital((prevHospital) => ({
                           ...prevHospital,
            // input이 checkbox면 boolean(checked) 값을, 아니면 text(value) 값을 저장
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // 수정 버튼 클릭 시 실행할 함수
    const updateHospital = async e => {

        e.preventDefault();
        // 기본이벤트 제거

        // console.log(hospital);

        try {
            const response = await updateHospitalApi(hospitalId,hospital);

            if(response.data == "success") {
                // 수정 성공

                alert("검진가능 병원 수정에 성공했습니다.");

                // 해당 수정글의 상세조회로 이동
                navigate(`/hospitals/${ hospitalId }`);
            } else {
                // > 수정 실패

                alert("검진가능 병원 수정에 실패했습니다.");
            }
        } catch(error) {

            console.log("검진가능 병원 수정용 ajax 통신 실패!");
        }
    };

    return (
        <div>
            <h1 align="right">검진 가능 병원 등록</h1>

            <br/><br/>
          
            <form id="enroll-form">
                <table className="form table">
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input type="text" name="name" value={ hospital.name }
                                                            onChange={ handleChange } required />
                            </td>                                
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td>
                                <input type="text" name="address" value={ hospital.address }
                                                            onChange={ handleChange } required />
                            </td>
                        </tr>
                        <tr>
                            <th>전화번호</th>
                            <td>
                                <input type="text" name="phone" value={ hospital.phone }
                                                            onChange={ handleChange } />
                            </td>
                        </tr>
                        <tr>
                            <th>url</th>
                            <td>
                                <input type="text" name="url" value={ hospital.url }
                                                            onChange={ handleChange } />
                            </td>
                        </tr>
                        <tr>
                            <th>안내문구</th>
                            <td><textarea name="description" value={ hospital.description }
                                                            onChange= { handleChange } /> 
                            </td>
                        </tr>
                        <tr>
                            <th>검진가능 항목</th>
                            <td>
                                <div>
                                    <label>
                                        일반검진
                                        <input type="checkbox"
                                        name="isGeneralExamAvailable"
                                        checked={ hospital.isGeneralExamAvailable}
                                        onChange={handleChange} />
                                    </label>
                                </div>    
                            </td> 
                            <td>
                                <div>
                                    <label>
                                        위암검진
                                        <input type="checkbox"
                                        name="isStomachCancerExamAvailable"
                                        checked={ hospital.isStomachCancerExamAvailable}
                                        onChange={handleChange} />
                                    </label>
                                </div> 
                            </td>
                            <td>
                                <div>  
                                    <label>
                                        대장암검진
                                        <input type="checkbox"
                                        name="isColonCancerExamAvailable"
                                        checked={ hospital.isColonCancerExamAvailable}
                                        onChange={handleChange} />
                                    </label>
                                </div> 
                            </td>
                            <td> 
                                <div>  
                                    <label>
                                        간암검진
                                        <input type="checkbox"
                                        name="isLiverCancerExamAvailable"
                                        checked={ hospital.isLiverCancerExamAvailable}
                                        onChange={handleChange} />
                                    </label>
                                </div> 
                            </td> 
                            <td>
                                <div>
                                    <label>
                                        폐암검진
                                        <input type="checkbox"
                                        name="isLungCancerExamAvailable"
                                        checked={ hospital.isLungCancerExamAvailable}
                                        onChange={handleChange} />
                                    </label>
                                </div>  
                            </td>
                        </tr>
                    </tbody>
                </table>

            <br/><br/>

            <div>
               <button type="submit" className="btn btn-outline-primary btn-sm"
                                    onClick={ updateHospital }>
                        등록하기
               </button>
               &nbsp;&nbsp;
               <button type="reset" className="btn btn-outline-secondary btn-sm"
                                    onClick={ () => {
                                        setHospital({name : "",
                                                    address : "",
                                                    phone : "",
                                                    url : "",
                                                    description : "",
                                                    isGeneralExamAvailable : false,
                                                    isStomachCancerExamAvailable : false,
                                                    isColonCancerExamAvailable : false,
                                                    isLiverCancerExamAvailable : false,
                                                    isLungCancerExamAvailable : false});
                                    }}>
                        초기화           
               </button>
            </div>
            </form>
        </div>
    );
        
}
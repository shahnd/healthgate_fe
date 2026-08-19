import { useLocation, useNavigate } from "react-router-dom";

import { useState,useEffect } from "react";

import { selectHospitalFormApi, updateHospitalApi } from "../api/hospitalApi";

export default function HospitalUpdateFormComponent() {

    // 실행할 구문
    const id = useLocation().state.id;

    let navigate = useNavigate();

    // State 형 변수
    const [hospital, setHospital] = useState({ name : "",
                                        address : "",
                                        phone : "",
                                        url : "",
                                        description : "",
                                        isGeneralExamAvailable : "",
                                        isStomachCancerExamAvailable : "",
                                        isColonCancerExamAvailable : "",
                                        isLiverCancerExamAvailable : "",
                                        isLungCancerExamAvailable : ""});

    useEffect(() => {

        const selectHospitalForm = async () => {
            try {

                const response = await selectHospitalFormApi(id);

                // console.log(response.data);

                setHospital(response.data);

            } catch(error) {

                console.log("검진가능 병원 수정용 ajax 통신 실패!");
            }
        };

        selectHospitalForm();

    },[]);
    
    // 입력값 변경될 때 마다 실행할 함수
    const handleChange = e => {

        const newHospital = {...hospital};

        newHospital[e. target.name] = e.target.value;

        setHospiatal(newHospital);
    };

    // 수정 버튼 클릭 시 실행할 함수
    const updateHospital = async e => {

        e.preventDefault();
        // 기본이벤트 제거

        // console.log(hospital);

        try {
            const response = await updateHospitalApi(id,hospital);

            if(response.data == "success") {
                // 수정 성공

                alert("검진가능 병원 수정에 성공했습니다.");

                // 해당 수정글의 상세조회로 이동
                navigate(`/hospital/${ id }`);
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
                                                            onChange={ handleChange } />
                            </td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td>
                                <input type="text" name="address" value={ hospital.address }
                                                            onChange={ handleChange } />
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
                            <td></td>
                        </tr>
                        <tr>
                            <th></th>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

            <br/><br/>

            <div>
               <button type="submit" className="btn btn-outline-primary btn-sm"
                                    onClick={ insertHospital }>
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
                                                    isGeneralExamAvailable : "",
                                                    isStomachCancerExamAvailable : "",
                                                    isColonCancerExamAvailable : "",
                                                    isLiverCancerExamAvailable : "",
                                                    isLungCancerExamAvailable : ""});
                                    }}>
                        초기화           
               </button>
            </div>
            </form>
        </div>
    );
        
}
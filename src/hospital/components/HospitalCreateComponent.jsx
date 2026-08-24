import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { insertHospitalApi } from "../api/hospitalApi";

export default function HospitalCreateComponent() {

    // 실행할 구문
    let navigate = useNavigate();

    // 입력값을 저장할 State 형 변수 셋팅
    const [hospital, setHospital] = useState({ name : "",
                                        address : "",
                                        phone : "",
                                        url : "",
                                        description : "",
                                        isGeneralExamAvailable : false,
                                        isStomachCancerExamAvailable : false,
                                        isColonCancerExamAvailable : false,
                                        isLiverCancerExamAvailable : false,
                                        isLungCancerExamAvailable : false});
 
    // 입력값의 변화가 있을 때 마다 실행할 함수                                    
    const handleChange = e => {

        const newHospital = {...hospital};

        newHospital[e.target.name] = e.target.value;

        setHospital(newHospital);
    };

    const insertHospital = async e => {

        e.preventDefault();
        // 기본이벤트 제거

        try {

            const response = await insertHospitalApi(hospital);   
            
            // console.log(response.data);

            if(response.data == "success") {
                // > 병원등록 성공

                alert("병원등록에 성공했습니다");

                navigate("/hospitals/list");
            } else {
                // > 병원 등록 실패

                alert("병원등록에 실패했습니다.")
            }

        } catch(error) {

            console.log("검진가능 병원 등록용 ajax 통신 실패!");
        }
    };

    return(
      <div className="page">
          <h1 className="page-title">검진 가능 병원 등록</h1>

          <div className="card">
          <form>
             <table className="form-table">
                <tbody>
                    <tr>
                        <th>병원명</th>
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
                        <th>병원 홈페이지 url</th>
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
                            <select>
                                <option name="isGeneralExamAvailable" 
                                        value={ hospital.isGeneralExamAvailable }
                                        onChange= { handleChange }>일반검진</option>

                                <option name="isStomachCancerExamAvailable" 
                                        value={ hospital.isStomachCancerExamAvailable }
                                        onChange= { handleChange }>위암검진</option>

                                <option name="isColonCancerExamAvailable"
                                        value={ hospital.isColonCancerExamAvailable }
                                        onChange= { handleChange }>대장암검진</option>

                                <option name="isLiverCancerExamAvailable" 
                                        value={ hospital.isLiverCancerExamAvailable }
                                        onChange= { handleChange }>간암검진</option>

                                <option name="isLungCancerExamAvailable" 
                                        value={ hospital.isLungCancerExamAvailable }
                                        onChange= { handleChange }>폐암검진</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
             </table>

             <br/><br/>

             <div className="action-area">
                <button type="submit" className="btn-primary"
                        onClick={ insertHospital }>
                        등록하기
                </button>
                &nbsp;&nbsp;
                <button type="reset" className="btn-secondary"
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
      </div>
    );
}
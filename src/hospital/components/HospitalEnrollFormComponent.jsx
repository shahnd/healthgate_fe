import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { insertHospitalApi } from "../api/hospitalApi";

export default function HospitalEnrollFormComponent() {

    // 실행할 구문
    let navigate = useNavigate();

    // 입력값을 저장할 State 형 변수 셋팅
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
 
    // 입력값의 변화가 있을 때 마다 실행할 함수                                    
    const handleChange = e => {

        const newHospital = {...hospital};

        newHospital[e.target.name] = e.target.value;

        sethoapital(newHospital);
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

                navigate("/hospital/list");
            } else {
                // > 병원 등록 실패

                alert("병원등록에 실패했습니다.")
            }

        } catch(error) {

            console.log("검진가능 병원 등록용 ajax 통신 실패!");
        }
    };

    return(
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
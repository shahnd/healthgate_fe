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

        const { name, value, type, checked } = e.target;

        setHospital((prevHospital) => ({
                           ...prevHospital,
            // input이 checkbox면 boolean(checked) 값을, 아니면 text(value) 값을 저장
            [name]: type === "checkbox" ? checked : value,
        }));
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
                        <td colSpan="5">
                            <input type="text" name="name" value={ hospital.name }
                                    onChange={ handleChange } required/>
                        </td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td colSpan="5">
                            <input type="text" name="address" value={ hospital.address }
                                    onChange={ handleChange } required/>
                        </td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td colSpan="5">
                            <input type="text" name="phone" value={ hospital.phone }
                                    onChange={ handleChange } />
                        </td>
                    </tr>
                    <tr>
                        <th>병원 홈페이지 url</th>
                        <td colSpan="5">
                            <input type="text" name="url" value={ hospital.url }
                                    onChange={ handleChange } />
                        </td>
                    </tr>
                    <tr>
                        <th>안내문구</th>
                        <td colSpan="5">
                            <textarea name="description" value={ hospital.description }
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
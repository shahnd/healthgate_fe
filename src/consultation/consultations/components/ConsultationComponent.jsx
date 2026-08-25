import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { selectConsultationApi } from "../api/consultationApi";

export default function ConsultationComponent () {

    let navigate = useNavigate();
    // 예약번호 변수
    const { id } = useParams();
    // 출력 데이터 변수
    const [consultation, setConsultation] = useState({
        employee : {
            id : "",
            name : "",
            department : { name : "" },
            position : { name : "" }
        },
        id : "",
        manager : "",
        reason : "",
        scheduledDate : "",
        scheduledTurn : "",
        status : ""
    });

    // 차시 -> 시간 매핑
    const turnTimeMap = {
        "T1": "10:00 ~ 10:50",
        "T2": "11:00 ~ 11:50",
        "T3": "13:00 ~ 13:50",
        "T4": "14:00 ~ 14:50",
        "T5": "15:00 ~ 15:50",
        "T6": "16:00 ~ 16:50",
    };

    // TN -> N차 + turnTimeMap
    const formatScheduledTurn = turn => {
        if (!turn) return "-";
        const turnNumber = turn.replace("T", "");
        const timeRange = turnTimeMap[turn] || "";

        return timeRange ? `${turnNumber}차 ${timeRange}` : "-";
    }

    // 페이지 최초 진입 - 상담 내역 조회
    useEffect(() => {
        const selectConsultation = async () => {
            try {

                const response = await selectConsultationApi();
                setConsultation(response.data);
            } catch (error) {
                console.log("상담일지 조회용 통신 실패" + error);
            }
        }
        selectConsultation();
    }, []);

    const saveConsultation = e => {
        e.preventDefault();

    }

    const handleChange = e => {
        const newConsultation = {...consultation};
        newConsultation[e.target.name] = e.target.value;
        setConsultation(newConsultation);
    }
    return(
        <div>
            <h2>상담일지</h2>
            <form className="consultation-form">
                <table>
                    <tbody>
                        <tr>
                            <th width="130">신청자</th>
                            <td width="300">{ '김개똥' } </td>
                            <th width="130">부서명</th>
                            <td width="300">{ 'SCT' }</td>
                        </tr>
                        <tr>
                            <th>예약번호</th>
                            <td>{ 1 }</td>
                            <th>직급</th>
                            <td>{ '대리' }</td>
                        </tr>
                        <tr>
                            <th>상담일</th>
                            <td>{ '2026-08-10' }</td>
                            <th>시간</th>
                            <td>{ '3차 13:00 - 13:50' }</td>
                        </tr>
                        <tr>
                            <th>상담사</th>
                            <td>{ '이순신' }</td>
                            <th>상담상태</th>
                            <td>
                                <select name="status">
                                    <option value="RESERVED">미완료</option>
                                    <option value="FINISHED">완료</option>
                                    <option value="EXPIRED">취소</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>상담내용</th>
                            <td colSpan={ 3 }>
                                <textarea name="content"
                                          onChange={ handleChange }
                                          vlaue={ consultation.content } />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <div>
                <button type="submit"
                        onClick={ saveConsultation }>작성하기</button>
                &nbsp;&nbsp;
                <button type="button"
                        onClick={ () => { navigate(-1); } }>뒤로가기</button>
            </div>
        </div>
    )
}
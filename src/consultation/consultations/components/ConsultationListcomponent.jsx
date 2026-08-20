import { useNavigate } from "react-router-dom"

export default function ConsultationListcomponent() {

    const navigate = useNavigate();    

    return(
        <div>
            <h2>상담 내역 조회</h2>

            <table>
                <tbody>
                    <tr>
                        <th>신청자</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>부서명</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>직급</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>상담일</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>시간</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>신청사유</th>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div align="center">
                <button onClick={() => { navigate("/consultation/reservation"); }}>예약 수정</button>
                <button onClick={() => { navigate(""); }}>예약 취소</button>
            </div>
        </div>
    )
}
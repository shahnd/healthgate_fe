import axios from "axios";
import { useEffect, useState } from "react";
import { useUserInfo } from "../../store/useAuthStore";
import "@/common/styles/DetailComponent.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MyPageComponent() {
    const user = useUserInfo();
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getEmployee = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8006/healthgate/employees/${user.id}`
                );

                setData(response.data.data);
            } catch {
                console.log("마이페이지 통신 실패");
            }
        };

        if (user?.id) {
            getEmployee();
        }
    }, [user?.id]);

    if (!data) {
        return <div>데이터 로딩중</div>;
    }

    return (
        <div className="detail-page">
            <header>
                <div>
                    <h1>{data.name}님의 마이페이지</h1>
                    <p>{data.name} | {data.employeeNumber}</p>
                </div>

                <div>
                    <Button onClick={() => navigate('/mypage/password')}>비밀번호 변경</Button>
                </div>
            </header>


            <main>
                <section data-detail-section="info">
                    <dl>
                        <div>
                            <dt>사번</dt>
                            <dd>{data.employeeNumber || "-"}</dd>
                        </div>

                        <div>
                            <dt>이름</dt>
                            <dd>{data.name || "-"}</dd>
                        </div>

                        <div>
                            <dt>부서</dt>
                            <dd>{data.departments?.name || "부서 미지정"}</dd>
                        </div>

                        <div>
                            <dt>직급</dt>
                            <dd>{data.positions?.name || "직급 미지정"}</dd>
                        </div>

                        <div>
                            <dt>전화번호</dt>
                            <dd>{data.phone || "-"}</dd>
                        </div>

                        <div>
                            <dt>이메일</dt>
                            <dd>{data.email || "-"}</dd>
                        </div>

                        <div>
                            <dt>입사일</dt>
                            <dd>{data.hireDate || "-"}</dd>
                        </div>

                        <div>
                            <dt>재직 상태</dt>
                            <dd>{data.status || "-"}</dd>
                        </div>
                    </dl>
                </section>
            </main>
        </div>
    );
}
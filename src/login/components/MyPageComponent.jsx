import axios from "axios";
import { useEffect, useState } from "react";
import { useUserInfo } from "../../store/useAuthStore";
import "@/common/styles/DetailComponent.css";
import "@/common/styles/ActionButton.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
            <div className="page-header">
                <h1>{data.name}님의 마이페이지</h1>
                <p>{data.name} | {data.employeeNumber}</p>
            </div>



            <Card className="detail-info-card">
                <CardHeader>
                    <CardTitle>기본 정보</CardTitle>
                    <CardDescription>나의 기본 정보를 확인할 수 있습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <dl className="detail-list">
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
                </CardContent>
                <CardFooter>
                    <Button className="primary-button" onClick={() => navigate('/mypage/password')}>비밀번호 변경</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
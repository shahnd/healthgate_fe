import axios from "axios";
import { useEffect, useState } from "react";
import { useUserInfo } from "../../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@/common/styles/DetailComponent.css";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordComponent() {
    const user = useUserInfo();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    
    // 비밀번호 입력 상태 관리
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

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

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { id, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [id]: value }));
    };

    // 비밀번호 변경 요청 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            // 기존 API 주소 규칙에 맞춰 패치 요청을 보냅니다 (엔드포인트는 환경에 맞게 수정)
            await axios.put(`http://localhost:8006/healthgate/employees/me/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            alert("비밀번호가 성공적으로 변경되었습니다.");
            navigate('/mypage');
        } catch {
            alert("비밀번호 변경에 실패했습니다.");
        }
    };

    if (!data) {
        return <div>데이터 로딩중</div>;
    }

    return (
        <div className="detail-page">
            <header>
                <div>
                    <h1>{data.name}님의 비밀번호 변경</h1>
                    <p>{data.name} | {data.employeeNumber}</p>
                </div>
            </header>

            <main>
                <form onSubmit={handleSubmit}>
                    <section data-detail-section="info">
                        <dl>
                            <div>
                                <dt>현재 비밀번호</dt>
                                <dd>
                                    <Input 
                                        id="currentPassword" 
                                        type="password" 
                                        placeholder="현재 비밀번호를 입력하세요" 
                                        value={passwordData.currentPassword}
                                        onChange={handleChange}
                                        required 
                                        className="max-w-xs"
                                    />
                                </dd>
                            </div>

                            <div>
                                <dt>새 비밀번호</dt>
                                <dd>
                                    <Input 
                                        id="newPassword" 
                                        type="password" 
                                        placeholder="새 비밀번호를 입력하세요" 
                                        value={passwordData.newPassword}
                                        onChange={handleChange}
                                        required 
                                        className="max-w-xs"
                                    />
                                </dd>
                            </div>

                            <div>
                                <dt>새 비밀번호 확인</dt>
                                <dd>
                                    <Input 
                                        id="confirmPassword" 
                                        type="password" 
                                        placeholder="새 비밀번호를 한 번 더 입력하세요" 
                                        value={passwordData.confirmPassword}
                                        onChange={handleChange}
                                        required 
                                        className="max-w-xs"
                                    />
                                </dd>
                            </div>
                        </dl>
                    </section>
                    
                    {/* 버튼 영역 */}
                    <div className="flex gap-2 mt-6">
                        <Button type="submit">변경하기</Button>
                        <Button type="button" variant="outline">취소</Button>
                    </div>
                </form>
            </main>
        </div>
    );
}

import { useParams, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { selectHospitalApi, deleteHospitalApi } from "../api/hospitalApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

import "@/common/styles/DetailComponent.css";
import "@/common/styles/Common.css"
import PageHeader from "@/common/components/PageHeader";


export default function HospitalDetailComponent() {

    // 실행할 구문
    const hospitalId = useParams().hospitalId;

    let navigate = useNavigate();

    // State 형 변수
    const [hospital, setHospital] = useState({hospitalId : "",
                                            name : "",
                                            address : "",
                                            phone : "",
                                            url : "",
                                            description : "",
                                            isGeneralExamAvailable : false,
                                            isStomachCancerExamAvailable : false,
                                            isColonCancerExamAvailable : false,
                                            isLiverCancerExamAvailable : false,
                                            isLungCancerExamAvailable : false,
                                            createdAt : "",
                                            status : ""});

    useEffect(() => {

        const selectHospital = async () => {

            try {

                const response = await selectHospitalApi(hospitalId);
                
                if(response.data != "") {
                    // > 조회된 내용이 있다면

                    setHospital(response.data);

                } else {
                    // > 조회된 내용이 없다면

                    alert("이미 삭제되거나 없는 병원입니다.");

                    // 목록 페이지로 이동
                    navigate("/hospitals/list");
                }

            } catch(error) {

                console.log("검진 가능 병원 상세 조회용 ajax 통신 실패!");
            }
        };

        selectHospital();

    }, []);

    // 삭제 버튼 클릭 함수
    const deleteHospital = async () => {

        try {

            const response = await deleteHospitalApi(hospitalId);

            if(response.data == "success") {
                // > 삭제 성공일 경우

                alert("검진 가능 병원 삭제에 성공했습니다.");

                navigate("/hospitals/list");

            } else {
                // > 삭제 실패일 경우

                alert("검진 가능 병원 삭제에 실패했습니다.");
            }

        } catch(error) {

            console.log("검진가능 병원 삭제용 ajax 통신 실패!");
        }
    };

    // return 구문
    return (
        <div className="detail-page">
            <PageHeader 
            title="병원 정보 상세조회" 
            description="병원정보를 상세조회합니다." 
            icon={Building2}/>

            <div className="detail-page">
                <section data-detail-section="info">
                    <Card className="detail-info-card">
                        <CardHeader>
                            <CardTitle>병원 정보</CardTitle>
                            <CardDescription>검진가능 병원 상세정보</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <dl>
                                <div>
                                    <dt>병원명</dt>
                                    <dd>{hospital.name}</dd>
                                </div>

                                <div>
                                    <dt>주소</dt>
                                    <dd>{hospital.address}</dd>
                                </div>

                                <div>
                                    <dt>전화번호</dt>
                                    <dd>{hospital.phone}</dd>
                                </div>

                                <div>
                                    <dt>검진가능 항목</dt>
                                    <dd>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(hospital.generalExamAvailable)}
                                                readOnly
                                            />
                                            일반검진
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(hospital.stomachCancerExamAvailable)}
                                                readOnly
                                            />
                                            위암검진
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(hospital.colonCancerExamAvailable)}
                                                readOnly
                                            />
                                            대장암검진
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(hospital.liverCancerExamAvailable)}
                                                readOnly
                                            />
                                            간암검진
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(hospital.lungCancerExamAvailable)}
                                                readOnly
                                            />
                                            폐암검진
                                        </label>
                                    </dd>
                                </div>

                                <div>
                                    <dt>병원 홈페이지</dt>
                                    <dd><a href={hospital.url.startsWith('http') ? hospital.url : `https://${hospital.url}`}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="text-blue-600 hover:underline"
                                            >
                                            {hospital.url || "-"}</a></dd>
                                </div>
                                <div></div>
                                <div>
                                    <dt>병원 안내</dt>
                                    <dd>{hospital.description || "-"}</dd>
                                </div>
                                <div></div>
                                <div>
                                    <dt>등록일</dt>
                                    <dd>{hospital.createdAt?.substring(0, 10)}</dd>
                                </div>
                            </dl>
                        </CardContent>

                        <CardFooter>
                            <Button
                                size="lg" className="cursor-pointer" 
                                onClick={() => navigate("/hospitals/list")}
                            >
                                목록으로
                            </Button>

                            <Button
                                size="lg" className="cursor-pointer" variant="secondary"
                                onClick={() =>
                                    navigate(`/hospitals/${hospitalId}/edit`, {
                                        state: { hospitalId }
                                    })
                                }
                            >
                                편집
                            </Button>

                            <Button
                                size="lg" className="cursor-pointer" variant="secondary"
                                onClick={deleteHospital}
                            >
                                삭제
                            </Button>
                        </CardFooter>
                    </Card>
                </section>
            </div>
        </div>
    )
}
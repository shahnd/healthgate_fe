import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { insertHospitalApi } from "../api/hospitalApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

import "@/common/styles/FormComponent.css";
import "@/common/styles/Common.css"
import PageHeader from "@/common/components/PageHeader";

export default function HospitalCreateComponent() {

    // 실행할 구문
    let navigate = useNavigate();

    // 입력값을 저장할 State 형 변수 셋팅
    const [hospital, setHospital] = useState({ hospitalId : "", 
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
 
    // 입력값의 변화가 있을 때 마다 실행할 함수                                    
    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;

        setHospital((prev) => ({
            ...prev,
            // input이 체크박스면 checked(true/false) 값을, 일반 텍스트면 value 값을 반영
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const insertHospital = async e => {

        e.preventDefault();
        // 기본이벤트 제거

        const params = new URLSearchParams();
            params.append("name", hospital.name);
            params.append("address", hospital.address);
            params.append("phone", hospital.phone);
            params.append("url", hospital.url);
            params.append("description", hospital.description);
            params.append("createdAt",hospital.createdAt);
            params.append("status",hospital.status);

            // boolean 값을 문자열("true"/"false")로 변환하여 전송
            const isChecked = (key1, key2) => (hospital[key1] || hospital[key2] ? "true" : "false");

            // is가 붙은 키와 안 붙은 키를 둘 다 전송하여 자바빈 매핑 이슈를 완전 회피
            const exams = [
                { base: "GeneralExamAvailable", key1: "generalExamAvailable", key2: "isGeneralExamAvailable" },
                { base: "StomachCancerExamAvailable", key1: "stomachCancerExamAvailable", key2: "isStomachCancerExamAvailable" },
                { base: "ColonCancerExamAvailable", key1: "colonCancerExamAvailable", key2: "isColonCancerExamAvailable" },
                { base: "LiverCancerExamAvailable", key1: "liverCancerExamAvailable", key2: "isLiverCancerExamAvailable" },
                { base: "LungCancerExamAvailable", key1: "lungCancerExamAvailable", key2: "isLungCancerExamAvailable" }
            ];

            exams.forEach(item => {
                const val = isChecked(item.key1, item.key2);
                // is가 안 붙은 형태
                params.append(item.key1, val);
                // is가 붙은 형태
                params.append(item.key2, val);
            });

      try {
            const response = await insertHospitalApi(params);

             console.log(response.data);

            if(response.status === 200) {
                // > 병원 등록 성공일 경우

                alert("병원 등록에 성공했습니다.");

                // 병원 목록 조회쪽으로 URL 이동
                navigate("/hospitals/list");

            } else {
                // > 병원 등록 작성 실패일 경우

                alert("병원 등록에 실패했습니다.");
            }

        } catch(error) {

            console.log("일반게시글 작성용 ajax 통신 실패!");
        }

    };

    return(
        <div className="detail-page">
            <PageHeader 
            title="병원 정보 등록" 
            description="병원정보를 등록합니다." 
            icon={Building2}/>

            <Card className="detail-info-card">
                <CardHeader>
                    <CardTitle>병원 정보 등록</CardTitle>
                    <CardDescription>
                        검진 가능 병원 정보를 입력해 주세요.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={insertHospital}>
                    <CardContent>
                        <dl>
                            <div>
                                <Label htmlFor="name">병원명</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={hospital.name || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">주소</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    name="address"
                                    value={hospital.address || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">전화번호</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={hospital.phone || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="url">병원 홈페이지 URL</Label>
                                <Input
                                    id="url"
                                    type="text"
                                    name="url"
                                    value={hospital.url || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">안내문구</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={hospital.description || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <Label>검진가능 항목</Label>

                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="isGeneralExamAvailable"
                                            checked={Boolean(hospital.isGeneralExamAvailable)}
                                            onChange={handleInputChange}
                                        />
                                        일반검진
                                    </label>

                                    <label>
                                        <input
                                            type="checkbox"
                                            name="isStomachCancerExamAvailable"
                                            checked={Boolean(hospital.isStomachCancerExamAvailable)}
                                            onChange={handleInputChange}
                                        />
                                        위암검진
                                    </label>

                                    <label>
                                        <input
                                            type="checkbox"
                                            name="isColonCancerExamAvailable"
                                            checked={Boolean(hospital.isColonCancerExamAvailable)}
                                            onChange={handleInputChange}
                                        />
                                        대장암검진
                                    </label>

                                    <label>
                                        <input
                                            type="checkbox"
                                            name="isLiverCancerExamAvailable"
                                            checked={Boolean(hospital.isLiverCancerExamAvailable)}
                                            onChange={handleInputChange}
                                        />
                                        간암검진
                                    </label>

                                    <label>
                                        <input
                                            type="checkbox"
                                            name="isLungCancerExamAvailable"
                                            checked={Boolean(hospital.isLungCancerExamAvailable)}
                                            onChange={handleInputChange}
                                        />
                                        폐암검진
                                    </label>
                                </div>
                            </div>
                        </dl>
                    </CardContent>

                    <CardFooter>
                        <Button
                            className="primary-button"
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setHospital({
                                    name: "",
                                    address: "",
                                    phone: "",
                                    url: "",
                                    description: "",
                                    isGeneralExamAvailable: false,
                                    isStomachCancerExamAvailable: false,
                                    isColonCancerExamAvailable: false,
                                    isLiverCancerExamAvailable: false,
                                    isLungCancerExamAvailable: false
                                });
                            }}
                        >
                            초기화
                        </Button>

                        <Button
                            className="primary-button"
                            type="submit"
                        >
                            등록
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
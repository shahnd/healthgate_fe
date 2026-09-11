import { useLocation, useNavigate } from "react-router-dom";

import { useState,useEffect } from "react";

import { selectHospitalApi, updateHospitalApi } from "../api/hospitalApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";

import "@/common/styles/FormComponent.css";
import "@/common/styles/Common.css"
import PageHeader from "@/common/components/PageHeader";

export default function HospitalUpdateComponent() {

    // 실행할 구문
    const hospitalId = useLocation().state.hospitalId;

    // 조회후 초기화를 위한 백업용
    const [initialHospital, setInitialHospital] = useState(null);

    let navigate = useNavigate();

    // State 형 변수
    const [hospital, setHospital] = useState({hospitalId : "",
                                            name : "",
                                            address : "",
                                            phone : "",
                                            url : "",
                                            description : "",
                                            generalExamAvailable : false,
                                            stomachCancerExamAvailable : false,
                                            colonCancerExamAvailable : false,
                                            liverCancerExamAvailable : false,
                                            lungCancerExamAvailable : false,
                                            createdAt : "",
                                            status : ""})

    useEffect(() => {

        const selectHospital = async () => {
            try {

                const response = await selectHospitalApi(hospitalId);

                setHospital(response.data);
                setInitialHospital(response.data); // 원본 백업

            } catch(error) {

                console.log("검진가능 병원 수정용 ajax 통신 실패!");
            }
        };

        selectHospital();

    },[]);
    
    // 입력값 변경될 때 마다 실행할 함수
    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;

        setHospital((prev) => ({
            ...prev,
            // input이 체크박스면 checked(true/false) 값을, 일반 텍스트면 value 값을 반영
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // 초기화 버튼 누르면 이전값 불러옴
    const  handleReset = () => {
           if (initialHospital) {
              setHospital(initialHospital);
           }
    };

    // 엔터키 누를때 자동 제출 막음
    const handleKeyDown = (e) => {
        // input 태그 등에서 Enter키 입력 시 submit 방지 (Textarea에서의 Enter는 줄바꿈이므로 제외)
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    };

    // 수정 버튼 클릭 시 실행할 함수
    const updateHospital = async e => {
        e.preventDefault();

        
        const formData = new FormData();
            formData.append("name", hospital.name);
            formData.append("address", hospital.address);
            formData.append("phone", hospital.phone);
            formData.append("url", hospital.url);
            formData.append("description", hospital.description);
            formData.append("createdAt",hospital.createdAt);
            formData.append("status",hospital.status);
            formData.append("generalExamAvailable",hospital.generalExamAvailable);
            formData.append("stomachCancerExamAvailable",hospital.stomachCancerExamAvailable);
            formData.append("colonCancerExamAvailable",hospital.colonCancerExamAvailable);
            formData.append("liverCancerExamAvailable",hospital.liverCancerExamAvailable);
            formData.append("lungCancerExamAvailable",hospital.lungCancerExamAvailable);

        try {
            const response = await updateHospitalApi(hospitalId, formData);

             if(response.data == "success") {
                // 수정 성공

                alert("검진가능 병원 수정에 성공했습니다.");

                // 해당 수정글의 상세조회로 이동
                navigate(`/hospitals/${ hospitalId }`);

            } else {
                // > 수정 실패

                alert("검진가능 병원 수정에 실패했습니다.");
            }

        } catch (error) {

            console.error("수정 실패", error);
        }
    };

    return (
        <div className="detail-page">
            <PageHeader 
            title="병원 정보 수정" 
            description="병원정보를 수정합니다." 
            icon={Building2}/>

            <Card className="detail-info-card">
                <CardHeader>
                    <CardTitle>병원 정보 수정</CardTitle>
                    <CardDescription>
                        검진 가능 병원 정보를 수정해 주세요.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={updateHospital} onKeyDown={handleKeyDown}>
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
                                <Label htmlFor="phone">전화번호</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={hospital.phone || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="full-row">
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

                            <div className="full-row">
                                <Label htmlFor="url">병원 홈페이지</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    name="url"
                                    value={hospital.url || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="full-row w-full">
                                <Label htmlFor="description">병원 안내</Label>  
                                <div className="relative w-full">
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={6} // 기본 세로 줄 수 지정 (높이 조절)
                                        className="w-full min-h-[250px] resize-y pb-6" // 최소 높이 설정 및 세로 리사이즈 허용
                                        value={hospital.description || ""}
                                        onChange={handleInputChange}
                                    />
                                
                                    {/* 실시간 글자 수 표시 */}
                                    <span className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                                        {(hospital.description || "").length}글자
                                    </span>
                                </div>  
                            </div>

                            <div className="full-row">
                                <Label>검진가능 항목</Label>

                                <div className="flex items-center justify-start gap-1 !w-auto ">
                                    <label  className="flex items-center gap-0.5 !flex-[0_0_5.5rem]">
                                        <input
                                            type="checkbox"
                                            name="generalExamAvailable"
                                            checked={Boolean(hospital.generalExamAvailable)}
                                            onChange={handleInputChange}
                                            className="!grow-[0.3] !flex-none"
                                        />
                                        일반검진
                                    </label>

                                    <label  className="flex items-center gap-0.5 !flex-[0_0_5.5rem]">
                                        <input
                                            type="checkbox"
                                            name="stomachCancerExamAvailable"
                                            checked={Boolean(hospital.stomachCancerExamAvailable)}
                                            onChange={handleInputChange}
                                            className="!grow-[0.3] !flex-none"
                                        />
                                        위암검진
                                    </label>

                                    <label  className="flex items-center gap-0.5 !flex-[0_0_6.5rem]">
                                        <input
                                            type="checkbox"
                                            name="colonCancerExamAvailable"
                                            checked={Boolean(hospital.colonCancerExamAvailable)}
                                            onChange={handleInputChange}
                                            className="!grow-[0.3] !flex-none"
                                        />
                                        대장암검진
                                    </label>

                                    <label  className="flex items-center gap-0.5 !flex-[0_0_5.5rem]">
                                        <input
                                            type="checkbox"
                                            name="liverCancerExamAvailable"
                                            checked={Boolean(hospital.liverCancerExamAvailable)}
                                            onChange={handleInputChange}
                                            className="!grow-[0.3] !flex-none"
                                        />
                                        간암검진
                                    </label>

                                    <label  className="flex items-center gap-0.5 !flex-[0_0_5.5rem]">
                                        <input
                                            type="checkbox"
                                            name="lungCancerExamAvailable"
                                            checked={Boolean(hospital.lungCancerExamAvailable)}
                                            onChange={handleInputChange}
                                            className="!grow-[0.3] !flex-none"
                                        />
                                        폐암검진
                                    </label>
                                </div>
                            </div>
                        </dl>
                    </CardContent>

                    <CardFooter>
                        <Button
                            size="lg" className="cursor-pointer" 
                            onClick={() => navigate(`/hospitals/${hospitalId}`)}
                        >
                            이전으로
                        </Button>

                        <Button
                            size="lg" className="cursor-pointer"
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                        >
                            초기화
                        </Button>

                        <Button
                            size="lg" className="cursor-pointer"
                            type="submit"
                        >
                            수정
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
        
}
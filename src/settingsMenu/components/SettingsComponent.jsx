import "@/common/styles/ActionButton.css";
import "@/common/styles/Common.css"
import "../styles/SettingsComponent.css"

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/common/components/PageHeader";
import { Settings } from "lucide-react";

const RISK_LEVEL_MAP = {
    HIGH: "높음 단계",
    WARN: "주의 단계"
}

const METRICNAME_MAP = {
    SYSTOLIC_BP: "최고 혈압",
    DIASTOLIC_BP: "최저 혈압",
    HEART_RATE: "심박수"
}

const RISK_VARIANT_MAP = {
    HIGH: "destructive",
    WARN: "warning",
};

// 화면에 항상 노출되어야 하는 고정 항목 (DB 데이터와 무관하게 순서·구성 고정)
const FIXED_SETTINGS = [
    { metricName: "SYSTOLIC_BP", riskLevel: "HIGH" },
    { metricName: "SYSTOLIC_BP", riskLevel: "WARN" },
    { metricName: "DIASTOLIC_BP", riskLevel: "HIGH" },
    { metricName: "DIASTOLIC_BP", riskLevel: "WARN" },
    { metricName: "HEART_RATE", riskLevel: "HIGH" },
    { metricName: "HEART_RATE", riskLevel: "WARN" },
];

export default function SettingsComponent() {

    const [data, setData] = useState([]);

    useEffect(() => {

        const getSettings = async () => {
            try {
                const response = await axios.get("/healthgate/risks");

                setData(response.data.data);


            } catch(error) {
                console.log("시스템 설정 통신 실패");
            }

        }

        getSettings();

    }, [])

    // 고정 항목 기준으로 DB 데이터를 매칭. DB에 중복/잘못된 값이 있어도 첫 번째 매칭만 사용.
    const settings = FIXED_SETTINGS.map((fixed) => {
        const matched = data.find(
            (d) => d.metricName === fixed.metricName && d.riskLevel === fixed.riskLevel
        );

        return {
            ...fixed,
            id: matched?.id ?? null,
            value: matched?.value ?? "",
        };
    });

    const handleChange = (id, value) => {
        setData(prev => prev.map(i => i.id === id ? {...i, value: parseFloat(value)} : i ))
    };

    const handleSubmit = async () => {

        try {
            const response = await axios.put("/healthgate/risks", data);

            if (response.data.success) {
                alert("설정이 적용되었습니다.")
            } else {
                console.log("시스템 설정 등록 실패");

            }


        } catch(error) {
            console.log("시스템 설정 등록 통신 실패");
        }
    }

    return (
        <div className="list-page">
        <PageHeader title="설정" description="시스템 설정" icon={Settings}/>

        <Card className="settings-card">
            <CardHeader>
                <CardTitle>임계점 설정</CardTitle>
                <CardDescription>시스템 경고 임계값을 관리합니다.</CardDescription>
            </CardHeader>

            <CardContent>
                <div>
                    {settings.map((s) => {
                        const inputId = `threshold-${s.metricName}-${s.riskLevel}`;
                        return (
                            <div key={inputId}>
                                <Label htmlFor={inputId}>
                                    {METRICNAME_MAP[s.metricName]}
                                </Label>

                                <Badge variant={RISK_VARIANT_MAP[s.riskLevel]}>
                                    {RISK_LEVEL_MAP[s.riskLevel]}
                                </Badge>

                                <Input
                                    id={inputId}
                                    type="number"
                                    value={s.value}
                                    disabled={s.id === null}
                                    onChange={(e) => handleChange(s.id, Number(e.target.value))}
                                />
                            </div>
                        );
                    })}
                </div>
            </CardContent>

            <CardFooter>
                <Button size="lg" className="cursor-pointer" onClick={handleSubmit}>
                    적용
                </Button>
            </CardFooter>
        </Card>
        </div>
    )
}
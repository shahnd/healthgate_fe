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
import { Pagination } from "@/components/ui/pagination";
import PageHeader from "@/common/components/PageHeader";

export default function SettingsComponent() {

    const [data, setData] = useState([]);

    useEffect(() => {

        const getSettings = async () => {
            try {
                const response = await axios.get("http://localhost:8006/healthgate/risks");

                setData(response.data.data);
                
                
            } catch(error) {
                console.log("시스템 설정 통신 실패");
            }

        }

        getSettings();

    }, [])

    const handleChange = (id, value) => {
        setData(prev => prev.map(i => i.id === id ? {...i, value: parseFloat(value)} : i ))
    };

    const handleSubmit = async () => {

        try {
            const response = await axios.put("http://localhost:8006/healthgate/risks", data);

            if (response.data.success) {
                alert("설정이 적용되었습니다.")
            } else {
                console.log("시스템 설정 등록 실패");
                
            }


        } catch(error) {
            console.log("시스템 설정 등록 통신 실패");
        }
    }

    const RISK_LEVEL_MAP = {
        HIGH: "높음 단계",
        WARN: "주의 단계"
    }

    const METRICNAME_MAP = {
        SYSTOLIC_BP: "최고 혈압",
        DIASTOLIC_BP: "최저 혈압"
    }
    const RISK_VARIANT_MAP = {
        HIGH: "destructive",
        WARN: "warning",
    };

    return (
        <div className="list-page">
        <div className="page-header">
            <h1>설정</h1>
            <p>시스템 설정</p>
        </div>
        <PageHeader title="설정" description="시스템 설정"/>

        <Card className="settings-card">
            <CardHeader>
                <CardTitle>임계점 설정</CardTitle>
                <CardDescription>시스템 경고 임계값을 관리합니다.</CardDescription>
            </CardHeader>

            <CardContent>
                <div>
                    {data.map((s) => {
                        const inputId = `threshold-${s.id}`;
                        return (
                            <div key={s.id}>
                                <Label htmlFor={inputId}>
                                    {METRICNAME_MAP[s.metricName] || s.metricName}
                                </Label>

                                <Badge variant={RISK_VARIANT_MAP[s.riskLevel] ?? "default"}>
                                    {RISK_LEVEL_MAP[s.riskLevel] || s.riskLevel}
                                </Badge>

                                <Input
                                    id={inputId}
                                    type="number"
                                    value={s.value}
                                    onChange={(e) => handleChange(s.id, Number(e.target.value))}
                                />
                            </div>
                        );
                    })}
                </div>
            </CardContent>

            <CardFooter>
                <Button className="primary-button" onClick={handleSubmit}>
                    적용
                </Button>
            </CardFooter>
        </Card>
        </div>
    )
}
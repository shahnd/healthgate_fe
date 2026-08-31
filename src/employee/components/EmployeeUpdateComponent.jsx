import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeFormComponent from "./EmployeeFormComponent";
import "@/common/styles/Common.css"
import PageHeader from "@/common/components/PageHeader";
import { UserIcon } from "lucide-react";


export default function EmployeeUpdateComponent() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState(null);
    const [positionList, setPositionList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const [employeeResponse, initResponse] = await Promise.all([
                    axios.get(
                        `http://localhost:8006/healthgate/employees/${id}`
                    ),
                    axios.get(
                        "http://localhost:8006/healthgate/employees/init"
                    ),
                ]);

                const employee = employeeResponse.data.data;
                const initData = initResponse.data.data;

                setFormData({
                    ...employee,
                    departmentId: String(employee.departments?.id || ""),
                    positionId: String(employee.positions?.id || ""),
                });

                setDepartmentList(initData.departmentList);
                setPositionList(initData.positionList);
            } catch {
                console.log("직원정보 조회 통신 실패");
            }
        };

        getData();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const {
            departmentId,
            positionId,
            departments,
            positions,
            createdAt,
            updatedAt,
            ...employeeData
        } = formData;

        const sendData = {
            ...employeeData,
            departments: {
                id: Number(departmentId),
            },
            positions: {
                id: Number(positionId),
            },
        };

        try {
            await axios.put(
                `http://localhost:8006/healthgate/employees/${id}`,
                sendData
            );

            alert("수정 성공");
            navigate(`/employees/${id}`);
        } catch {
            console.log("직원 수정 통신 실패");
        }
    };

    if (!formData) {
        return <div>데이터 로딩중</div>;
    }

    return (
        <div className="detail-page">
            <PageHeader title="직원 정보 수정" description="직원 정보를 수정합니다." icon={UserIcon}/>
            <EmployeeFormComponent
                mode="update"
                formData={formData}
                departmentList={departmentList}
                positionList={positionList}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleSubmit}
                onCancel={() => navigate(`/employees/${id}`)}
            />
        </div>
    );
}
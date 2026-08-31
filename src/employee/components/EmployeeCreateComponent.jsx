import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeFormComponent from "./EmployeeFormComponent";
import PageHeader from "@/common/components/PageHeader";
import { UserIcon } from "lucide-react";


export default function EmployeeCreateComponent() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeNumber: "",
        password: "",
        name: "",
        hireDate: "",
        email: "",
        phone: "",
        role: "",
        departmentId: "",
        positionId: ""

    });

    const [dlist, setDlist] = useState([]);
    const [plist, setPlist] = useState([]);

    useEffect(() => {

        const getInitInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8006/healthgate/employees/init')

                setDlist(response.data.data.departmentList);
                setPlist(response.data.data.positionList);
                
            } catch(error) {
                console.log("초기 정보 통신 조회 실패");
            }
        }

        getInitInfo();

    }, [])

    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async e => {
        e.preventDefault();

        if (confirmPassword !== formData.password) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const {departmentId, positionId, ...rest} = formData;

        const sendData = {
            ...rest,
            departments: {
                id: Number(departmentId)
            },
            positions: {
                id: Number(positionId)
            }
        }

        try {
            const response = await axios.post('http://localhost:8006/healthgate/employees', sendData);

            alert("직원 등록에 성공했습니다.")
            navigate('/employees')

        } catch(error) {
            console.log("등록 통신 실패");
        }
    }

    return(
        <div className="detail-page">
            <PageHeader title="직원 등록" description="직원 정보를 등록합니다." icon={UserIcon}/>


            <EmployeeFormComponent
                    mode="create"
                    formData={formData}
                    departmentList={dlist}
                    positionList={plist}
                    confirmPassword={confirmPassword}
                    onChange={handleChange}
                    onConfirmPasswordChange={(event) =>
                        setConfirmPassword(event.target.value)
                    }
                    onSelectChange={(name, value) =>
                        setFormData((previous) => ({
                            ...previous,
                            [name]: value,
                        }))
                    }
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/employees")}
                />
        </div>
    );
}
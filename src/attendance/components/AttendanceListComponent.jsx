import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../common/components/Pagination";
import { useServerFilter } from "@/common/hooks/useServerFilter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RotateCcw, UserCheck } from "lucide-react";
import PageHeader from "@/common/components/PageHeader";

const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const EMPTY_CONDITION = {
    name: "",
    employeeNumber: "",
    departmentId: "",
    positionId: "",
    searchDate: getToday(),
    status: "",
};

export default function AttendanceListComponent() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [dlist, setDlist] = useState([]);
    const [plist, setPlist] = useState([]);

    // 여기는 팝오버/적용 버튼 없이 전부 즉시 반영이라 handleImmediateChange만 사용
    const { condition, handleImmediateChange, reset } = useServerFilter(EMPTY_CONDITION, {
        onApply: () => setPage(1),
    });

    useEffect(() => {
        const getEmployees = async () => {
            try {
                const [listRes, initRes] = await Promise.all([
                    axios.get("http://localhost:8006/healthgate/employees", {
                        params: { page, size, ...condition },
                    }),
                    axios.get("http://localhost:8006/healthgate/employees/init"),
                ]);

                setEmployees(listRes.data.data.content);
                setTotalPages(listRes.data.data.totalPages);
                setDlist(initRes.data.data.departmentList);
                setPlist(initRes.data.data.positionList);
            } catch (error) {
                console.log("직원 조회 통신 실패");
            }
        };

        getEmployees();
        const intervalId = setInterval(getEmployees, 5000);
        return () => clearInterval(intervalId);
    }, [page, size, condition]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        handleImmediateChange(name, value);
    };

 
    return (
        <div className="list-page">
            <PageHeader title="출근 조회" description="직원별 출근 현황을 조회합니다." icon={UserCheck}/>

            <div className="list-toolbar">
                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        name="name"
                        placeholder="이름 검색"
                        value={condition.name}
                        onChange={handleInputChange}
                    />

                    <Input
                        name="employeeNumber"
                        placeholder="사번 검색"
                        value={condition.employeeNumber}
                        onChange={handleInputChange}
                    />

                    <Select
                        value={String(condition.positionId)}
                        onValueChange={(value) => handleImmediateChange("positionId", value)}
                    >
                        <SelectTrigger className="w-[140px]" size="sm">
                            <SelectValue placeholder="직급 전체" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="">전체 직급</SelectItem>
                                {plist.map((position) => (
                                    <SelectItem key={position.id} value={String(position.id)}>
                                        {position.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={String(condition.departmentId)}
                        onValueChange={(value) => handleImmediateChange("departmentId", value)}
                    >
                        <SelectTrigger className="w-[140px]" size="sm">
                            <SelectValue placeholder="부서 전체" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="">전체 부서</SelectItem>
                                {dlist.map((department) => (
                                    <SelectItem key={department.id} value={String(department.id)}>
                                        {department.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Input
                        type="date"
                        name="searchDate"
                        value={condition.searchDate}
                        onChange={handleInputChange}
                    />

                    <Select
                        value={String(condition.status)}
                        onValueChange={(value) => handleImmediateChange("status", value)}
                    >
                        <SelectTrigger className="w-[140px]" size="sm">
                            <SelectValue placeholder="출근 상태 전체" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="">전체 상태</SelectItem>
                                <SelectItem value="ATTENDANCE">출근</SelectItem>
                                <SelectItem value="WARNING">출근(주의)</SelectItem>
                                <SelectItem value="DENY">출근거부</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={reset}>
                        <RotateCcw className="h-2 w-2"/>
                    </Button>
                </div>
            </div>

            <div className="list-table-wrapper">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>사번</TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>부서</TableHead>
                            <TableHead>직급</TableHead>
                            <TableHead>이메일</TableHead>
                            <TableHead>출근시간</TableHead>
                            <TableHead>출근상태</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id} onClick={() => navigate(`/employees/${employee.id}`)}>
                                <TableCell className="font-medium">{employee.employeeNumber}</TableCell>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.departmentName || "부서 미지정"}</TableCell>
                                <TableCell>{employee.positionName || "직급 미지정"}</TableCell>
                                <TableCell>{employee.email || "-"}</TableCell>
                                <TableCell>{employee.clockInAt || "-"}</TableCell>
                                <TableCell>{employee.attendanceStatus || "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
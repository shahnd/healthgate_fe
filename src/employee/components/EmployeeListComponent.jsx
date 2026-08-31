import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../common/components/Pagination";
import { useServerFilter } from "@/common/hooks/useServerFilter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterIcon, RotateCcw, SearchIcon, UserIcon, XIcon } from "lucide-react";
import "@/common/styles/ActionButton.css";
import "@/common/styles/ListComponent.css";
import "@/common/styles/Common.css"
import PageHeader from "@/common/components/PageHeader";

const EMPTY_CONDITION = {
    name: "",
    employeeNumber: "",
    departmentId: "",
    positionId: "",
};

export default function EmployeeListComponent() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    const [dlist, setDlist] = useState([]);
    const [plist, setPlist] = useState([]);

    const {
        condition,
        draftCondition,
        filterOpen,
        setFilterOpen,
        handleDraftChange,
        handleImmediateChange,
        submitDraft,
        reset,
    } = useServerFilter(EMPTY_CONDITION);

    // 검색 조건이 바뀌면 1페이지로 리셋
    useEffect(() => {
        setPage(1);
    }, [condition]);

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
    }, [page, size, condition]);

    return (
        <div className="list-page">
            <PageHeader title="직원 조회" description="직원 목록을 조회합니다." icon={UserIcon}/>

            <div className="list-toolbar">
                <div>
                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger
                            render={
                                <Button variant="outline" size="sm">
                                    <FilterIcon />
                                    이름/사번
                                </Button>
                            }
                        />

                        <PopoverContent align="start" className="w-[280px]">
                            <PopoverHeader>
                                <PopoverTitle>텍스트 검색</PopoverTitle>
                            </PopoverHeader>

                            <form onSubmit={submitDraft} className="flex flex-col gap-3">
                                <Input
                                    name="name"
                                    placeholder="이름"
                                    value={draftCondition.name}
                                    onChange={handleDraftChange}
                                />
                                <Input
                                    name="employeeNumber"
                                    placeholder="사번"
                                    value={draftCondition.employeeNumber}
                                    onChange={handleDraftChange}
                                />

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="submit">
                                        <SearchIcon />
                                        적용
                                    </Button>
                                </div>
                            </form>
                        </PopoverContent>
                    </Popover>

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

                    <Button type="button" variant="outline" size="sm" onClick={reset}>
                        <RotateCcw className="h-2 w-2"/>
                    </Button>
                </div>

                <Button size="sm" onClick={() => navigate("/employees/new")} size="lg" className="cursor-pointer">
                    직원 등록
                </Button>
            </div>

            <div className="list-table-wrapper">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">사번</TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>부서</TableHead>
                            <TableHead>직급</TableHead>
                            <TableHead className="text-right">이메일</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((e) => (
                            <TableRow key={e.id} onClick={() => navigate(`/employees/${e.id}`)}>
                                <TableCell className="font-medium">{e.employeeNumber}</TableCell>
                                <TableCell>{e.name}</TableCell>
                                <TableCell>{e.departmentName || "부서 미지정"}</TableCell>
                                <TableCell>{e.positionName || "직급 미지정"}</TableCell>
                                <TableCell className="text-right">{e.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
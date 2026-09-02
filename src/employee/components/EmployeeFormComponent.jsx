import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import "@/common/styles/FormComponent.css";
import "@/common/styles/Common.css"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export default function EmployeeFormComponent({
    formData,
    departmentList,
    positionList,
    confirmPassword,
    mode = "create",
    onChange,
    onSelectChange,
    onConfirmPasswordChange,
    onSubmit,
    onCancel,
}) {
    const isCreate = mode === "create";

    const ROLE_MAP = {
        EMPLOYEE: "직원",
        HR_ADMIN: "인사관리자",
        HEALTH_ADMIN: "보건관리자"
    }

    return (
        <Card className="detail-info-card">
            <CardHeader>
                <CardTitle>{isCreate ? "직원 등록" : "직원 정보 수정"}</CardTitle>
                <CardDescription>
                    {isCreate ? "직원 정보를 입력해 주세요." : "직원 정보를 수정해 주세요."}
                </CardDescription>
            </CardHeader>

            <form onSubmit={onSubmit}>
                <CardContent>
                    <dl>
                        <div>
                            <Label htmlFor="employeeNumber">사번</Label>
                            <Input
                                id="employeeNumber"
                                name="employeeNumber"
                                value={formData.employeeNumber || ""}
                                onChange={onChange}
                                required
                                readOnly={!isCreate}
                                maxLength={20}
                                placeholder="사번을 입력하세요"
                            />
                        </div>

                        <div>
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name || ""}
                                onChange={onChange}
                                required
                                maxLength={20}
                                placeholder="이름을 입력하세요"
                            />
                        </div>

                        {isCreate && (
                            <>
                                <div>
                                    <Label htmlFor="password">비밀번호</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password || ""}
                                        onChange={onChange}
                                        required
                                        maxLength={20}
                                        placeholder="비밀번호 입력"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={onConfirmPasswordChange}
                                        required
                                        maxLength={20}
                                        placeholder="비밀번호 입력"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={onChange}
                                placeholder="example@healthgate.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">전화번호</Label>
                            <Input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={onChange}
                                maxLength={13}
                                placeholder="010-0000-0000 (- 포함)"
                                pattern="010-\d{3,4}-\d{4}" 
                            />
                        </div>

                        <div>
                            <Label htmlFor="hireDate">입사일</Label>
                            <Input
                                id="hireDate"
                                type="date"
                                name="hireDate"
                                value={formData.hireDate || ""}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">권한</Label>
                            <Select
                                value={formData.role || ""}
                                onValueChange={(value) => onSelectChange("role", value)}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="권한을 선택하세요">
                                        {ROLE_MAP[formData.role] || "권한을 선택하세요"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="EMPLOYEE">직원</SelectItem>
                                        <SelectItem value="HR_ADMIN">인사 관리자</SelectItem>
                                        <SelectItem value="HEALTH_ADMIN">보건 관리자</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="departmentId">부서</Label>
                            <Select
                                value={String(formData.departmentId || "")}
                                onValueChange={(value) => onSelectChange("departmentId", value)}
                            >
                                <SelectTrigger id="departmentId">
                                    <SelectValue placeholder="부서를 선택하세요">
                                        {departmentList.find(d => String(d.id) === String(formData.departmentId))?.name}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {departmentList.map((department) => (
                                            <SelectItem key={department.id} value={String(department.id)}>
                                                {department.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="positionId">직급</Label>
                            <Select
                                value={String(formData.positionId || "")}
                                onValueChange={(value) => onSelectChange("positionId", value)}
                            >
                                <SelectTrigger id="positionId">
                                    <SelectValue placeholder="직급을 선택하세요">
                                        {positionList.find(p => String(p.id) === String(formData.positionId))?.name}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {positionList.map((position) => (
                                            <SelectItem key={position.id} value={String(position.id)}>
                                                {position.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </dl>
                </CardContent>

                <CardFooter>
                    <Button size="lg" className="cursor-pointer" type="button" variant="outline" onClick={onCancel}>
                        취소
                    </Button>
                    <Button size="lg" className="cursor-pointer" type="submit">{isCreate ? "등록" : "수정"}</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
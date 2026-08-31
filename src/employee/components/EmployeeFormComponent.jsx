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
                                    <SelectValue placeholder="권한을 선택하세요" />
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
                                    <SelectValue placeholder="부서를 선택하세요" />
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
                                    <SelectValue placeholder="직급을 선택하세요" />
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
    className,
    formRef,
    onSubmit,
    title = "로그인",
    description = "HealthGate 계정으로 로그인하세요.",
}) {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        {title}
                    </CardTitle>
                    <CardDescription>
                        {description}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        ref={formRef}
                        onSubmit={onSubmit}
                    >
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="employeeNumber">
                                    아이디
                                </FieldLabel>
                                <Input
                                    id="employeeNumber"
                                    name="employeeNumber"
                                    type="text"
                                    placeholder="아이디"
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">
                                    비밀번호
                                </FieldLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="비밀번호"
                                    required
                                />
                            </Field>

                            <Field>
                                <Button
                                    type="submit"
                                    className="login-button"
                                >
                                    로그인
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
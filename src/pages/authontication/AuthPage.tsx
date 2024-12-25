import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, ChangeEvent } from "react";
import { useLoginMutation, useRegisterMutation } from "@/features/api/authSlice";
import { Loader2 } from "lucide-react";
import { setUser } from "@/features/reducer/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

interface SignInForm {
    email: string;
    password: string;
}

interface SignUpForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    [key: string]: string;
}

interface Forms {
    signIn: SignInForm;
    signUp: SignUpForm;
}

// Validation schemas
const schemas = {
    signIn: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
    signUp: z
        .object({
            firstName: z.string().min(1, "First name is required"),
            lastName: z.string().min(1, "Last name is required"),
            email: z.string().email("Invalid email format"),
            password: z.string().min(6, "Password must be at least 6 characters"),
            confirmPassword: z.string().min(6, "Confirm password is required"),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't match",
            path: ["confirmPassword"],
        }),
} as const;

export function AuthPage() {
    const [signIn, { isLoading: isSignInLoading }] = useLoginMutation();
    const [signUp, { isLoading: isSignUpLoading }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [forms, setForms] = useState<Forms>({
        signIn: { email: "", password: "" },
        signUp: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleInputChange = (formType: keyof Forms) => (e: ChangeEvent<HTMLInputElement>) => {
        setForms({
            ...forms,
            [formType]: {
                ...forms[formType],
                [e.target.id]: e.target.value,
            },
        });
    };

    const validateForm = (formType: keyof Forms): boolean => {
        try {
            schemas[formType].parse(forms[formType]);
            setFormErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.reduce<FormErrors>(
                    (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
                    {}
                );
                setFormErrors(errors);
            }
            return false;
        }
    };

    const handleSubmit = async (formType:any) => {
        if (!validateForm(formType)) return;

        try {
            if (formType === "signIn") {
                const res = await signIn(forms.signIn).unwrap();
                dispatch(setUser({ token: res.data.token, userInfo: res.data.user }));
                toast.success("Successfully signed in!");
                navigate("/dashboard");
            } else {
                await signUp({
                    ...forms.signUp,
                    isEmailVerified: true,
                    userType: 1,
                }).unwrap();
                toast.success("Account created successfully!");
                (document.querySelector('[value="signIn"]') as HTMLElement)?.click();
            }
        } catch {
            toast.error(
                formType === "signIn" ? "Invalid email or password" : "Email already exists"
            );
        }
    };

    const renderInput = (id: string, label: string, type: string, formType: keyof Forms) => (
        <div className="space-y-1">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                placeholder={`Enter your ${label.toLowerCase()}`}
                onChange={handleInputChange(formType)}
                className={formErrors[id] && "border-red-500"}
            />
            {formErrors[id] && <span className="text-xs text-red-500">{formErrors[id]}</span>}
        </div>
    );

    return (
        <div className="flex items-center justify-center h-screen">
            <Tabs defaultValue="signIn" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signIn">Sign In</TabsTrigger>
                    <TabsTrigger value="signUp">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signIn">
                    <Card>
                        <CardContent className="space-y-2">
                            {renderInput("email", "Email", "email", "signIn")}
                            {renderInput("password", "Password", "password", "signIn")}
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleSubmit("signIn")}>
                                {isSignInLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="signUp">
                    <Card>
                        <CardContent className="space-y-2">
                            {renderInput("firstName", "First Name", "text", "signUp")}
                            {renderInput("lastName", "Last Name", "text", "signUp")}
                            {renderInput("email", "Email", "email", "signUp")}
                            {renderInput("password", "Password", "password", "signUp")}
                            {renderInput("confirmPassword", "Confirm Password", "password", "signUp")}
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleSubmit("signUp")}>
                                {isSignUpLoading ? <Loader2 className="animate-spin" /> : "Sign Up"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

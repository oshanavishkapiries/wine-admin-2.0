import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";
import {useLoginMutation, useRegisterMutation} from "@/features/api/authSlice";


export function AuthPage() {

    const [signIn, {isLoading: idSignInLoading}] = useLoginMutation();
    const [signUp, {isLoading: isSugnUpLoading}] = useRegisterMutation();

    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const [signInForm, setSignInForm] = useState({email: "", password: ""});
    const [signUpForm, setSignUpForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Handlers for form input changes
    const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignInForm({...signInForm, [e.target.id]: e.target.value});
    };

    const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({...signUpForm, [e.target.id]: e.target.value});
    };

    // Email validation function
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    // Validation for sign-in form
    const validateSignInForm = () => {
        const errors: Record<string, string> = {};
        if (!validateEmail(signInForm.email)) errors.email = "Invalid email format.";
        if (!signInForm.email) errors.email = "Email is required.";
        if (!signInForm.password) errors.password = "Password is required.";
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Validation for sign-up form
    const validateSignUpForm = () => {
        const errors: Record<string, string> = {};
        if (!signUpForm.firstName) errors.firstName = "First name is required.";
        if (!signUpForm.lastName) errors.lastName = "Last name is required.";
        if (!signUpForm.email) errors.email = "Email is required.";
        if (!signUpForm.password) errors.password = "Password is required.";
        if (!signUpForm.confirmPassword) errors.confirmPassword = "Confirm password is required.";
        if (signUpForm.password !== signUpForm.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handelSignIn = async () => {
        const isValid = validateSignInForm();
        console.log(isValid);
        if (isValid) {
            try {
                await signIn({email: signInForm.email, password: signInForm.password}).unwrap();
                console.log("Success")
            } catch (error) {
                console.log("error")
                setError("Invalid email or password.");
            }
        }
    };

    const handelSignUp = async () => {
        const isValid = validateSignUpForm();
        console.log(isValid);
        // if (isValid) {
        //     try {
        //         await signUp({
        //             firstName: signUpForm.firstName,
        //             lastName: signUpForm.lastName,
        //             email: signUpForm.email,
        //             password: signUpForm.password,
        //         }).unwrap();
        //     } catch (error) {
        //         setError("Email already exists.");
        //     }
        // }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <Tabs defaultValue="signIn" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signIn">Sign In</TabsTrigger>
                    <TabsTrigger value="signUp">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signIn">
                    <Card>
                        <CardHeader>
                            {/*<CardTitle>Account</CardTitle>*/}
                            {/*<CardDescription>*/}
                            {/*  Make changes to your account here. Click save when you're done.*/}
                            {/*</CardDescription>*/}
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name='email'
                                    type="email"
                                    placeholder="Enter your email"
                                    onChange={handleSignInChange}
                                    className={`${validationErrors.email && "border-red-500"}`}
                                />
                                {validationErrors.email && (
                                    <span className="text-xs text-red-500">{validationErrors.email}</span>)}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name='password'
                                    type="password"
                                    placeholder="Enter your password"
                                    onChange={handleSignInChange}
                                    className={`${validationErrors.password && "border-red-500"}`}
                                />
                                {validationErrors.password && (
                                    <span className="text-xs text-red-500">{validationErrors.password}</span>)}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handelSignIn()}>Sign In</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="signUp">
                    <Card>
                        <CardHeader>
                            {/*<CardTitle>Sign Up</CardTitle>*/}
                            {/*<CardDescription>*/}
                            {/*    Change your password here. After saving, you'll be logged out.*/}
                            {/*</CardDescription>*/}
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    name='firstName'
                                    type="text"
                                    placeholder="Enter your first name"
                                    onChange={handleSignUpChange}
                                    className={`${validationErrors.firstName && "border-red-500"}`}
                                />
                                {validationErrors.firstName && (
                                    <span className="text-xs text-red-500">{validationErrors.firstName}</span>)}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name='lastName'
                                    type="text"
                                    placeholder="Enter your last name"
                                    onChange={handleSignUpChange}
                                    className={`${validationErrors.lastName && "border-red-500"}`}
                                />
                                {validationErrors.lastName && (
                                    <span className="text-xs text-red-500">{validationErrors.lastName}</span>)}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name='email'
                                    type="email"
                                    placeholder="Enter your email"
                                    onChange={handleSignUpChange}
                                    className={`${validationErrors.email && "border-red-500"}`}
                                />
                                {validationErrors.email && (
                                    <span className="text-xs text-red-500">{validationErrors.email}</span>)}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name='password'
                                    type="password"
                                    placeholder={"Enter your password"}
                                    onChange={handleSignUpChange}
                                    className={`${validationErrors.password && "border-red-500"}`}
                                />
                                {validationErrors.password && (
                                    <span className="text-xs text-red-500">{validationErrors.password}</span>)}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword">Confirm password</Label>
                                <Input
                                    id="confirmPassword"
                                    name='confirmPassword'
                                    type="password"
                                    placeholder="Confirm your password"
                                    onChange={handleSignUpChange}
                                    className={`${validationErrors.confirmPassword && "border-red-500"}`}
                                />
                                {validationErrors.confirmPassword && (
                                    <span className="text-xs text-red-500">{validationErrors.confirmPassword}</span>)}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handelSignUp}>Sign Up</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

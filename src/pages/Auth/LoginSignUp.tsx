import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useSignupMutation } from "@/api/auth.api";

type FormFields = {
  name?: string;
  studentid?: string;
  email: string;
  password: string;
};

export const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signUp, { isLoading: signUpLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit = async (data: FormFields) => {
    try {
      if (isLogin) {
        await login({ email: data.email!, password: data.password! }).unwrap();
      } else {
        await signUp({
          email: data.email!,
          password: data.password!,
          name: data.name ?? "",
          studentid: data.studentid ?? "",
        }).unwrap();
      }
      reset();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  // Define fields dynamically
  const fields = [
    ...(!isLogin
      ? [
          { label: "Name", name: "name", type: "text", required: true },
        
        ]
      : []),
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Password", name: "password", type: "password", required: true },
  ];

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="max-w-sm mx-auto p-6 border w-[50%] rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                type={field.type}
                id={field.name}
                {...register(field.name as keyof FormFields, {
                  required: field.required,
                })}
              />
              {errors[field.name as keyof FormFields] && (
                <p className="text-red-500 text-sm">{field.label} is required</p>
              )}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full"
            disabled={loginLoading || signUpLoading}
          >
            {isLogin
              ? loginLoading
                ? "Logging in..."
                : "Login"
              : signUpLoading
              ? "Signing up..."
              : "Sign Up"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

type FormFields = {
  name?: string;
  email: string;
  password: string;
};

// Turn Firebase's technical auth error codes into friendly, actionable messages.
const friendlyAuthError = (err: unknown): string => {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: unknown }).code)
      : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "That email is already registered. Try logging in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled.";
    default:
      return err instanceof Error ? err.message : "Something went wrong. Please try again.";
  }
};

export const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit = async (data: FormFields) => {
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        const credential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        if (data.name) {
          await updateProfile(credential.user, { displayName: data.name });
        }
      }
      reset();
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Authentication failed",
        description: friendlyAuthError(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Google sign-in failed",
        description: friendlyAuthError(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Define fields dynamically
  const fields = [
    ...(!isLogin
      ? [{ label: "Name", name: "name", type: "text", required: true }]
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

          <Button type="submit" className="w-full" disabled={loading}>
            {isLogin
              ? loading
                ? "Logging in..."
                : "Login"
              : loading
              ? "Signing up..."
              : "Sign Up"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </Button>

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

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/shared/get-image";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeClosed,
  EyeClosedIcon,
  EyeOff,
  Loader,
  Loader2,
  Loader2Icon,
} from "lucide-react";
import { fa } from "zod/v4/locales";
import { signIn, signUp } from "@/lib/authClient";
import { toast } from "sonner";
import { CssVariable } from "next/dist/compiled/@next/font";

export default function AuthPage() {
  const [value, setValue] = useState("login");
  async function handleGoogleLogin() {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${getImageUrl("Background3.jpg")})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-h-screen  ">
      <div
        style={backgroundStyle}
        className=" min-h-screen h-full w-full border lg:col-span-2 ">
        {" "}
      </div>
      {/* Auth section */}
      <div className=" w-full  bg-white px-6 min-h-screen py-20">
        <div>
          <div>
            <h1 className=" text-xl md:text-2xl lg:text-3xl font-bold text-center">
              Welcome Back !
            </h1>
          </div>
          <div>
            <p className=" text-center ">Login to continue</p>
          </div>
          {/* Google auth */}
          <div className=" w-full mt-5">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className=" w-full cursor-pointer"
              variant={"outline"}>
              {" "}
              <Image
                src={getImageUrl("google-logo.png")}
                alt="google logo"
                height={30}
                width={30}
              />
              Login With Google
            </Button>
          </div>
        </div>
        <div>
          {/* Or sign in with email section */}
          <div className=" flex justify-center items-center gap-4 mb-5 mt-5">
            <div className=" h-0.5 bg-gray-300 w-[100%]" />
            <div className=" flex-11/12">
              <p className=" text-[12px]">Or sign in with Email</p>
            </div>
            <div className=" h-0.5 bg-gray-300 w-[100%]" />
          </div>
          {/* Email and password */}

          <Tabs value={value} onValueChange={setValue} className=" w-full">
            <TabsList className=" w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm switchValue={() => setValue("login")} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  const LoginSchema = z.object({
    email: z.email(),
    password: z.string(),
  });

  type loginTypes = z.infer<typeof LoginSchema>;

  const form = useForm<loginTypes>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isloding, setIsLoading] = useState(false);

  async function handleLoginForm(values: loginTypes) {
    setIsLoading(true);
    console.log(values.email, values.password);

    try {
      const data = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/",
      });
      if (data.error) {
        console.log(data.error?.message, "Error ");
        toast.error(data.error?.message);
        return;
      }

      toast.success("Login `successful`");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLoginForm)}
          className=" space-y-4 mt-2">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className=" relative w-full ">
                    <Input
                      type={isVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <Button
                      type="button"
                      onClick={() => setIsVisible(!isVisible)}
                      variant={"ghost"}
                      size={"icon"}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer hover:bg-transparent">
                      {isVisible ? <Eye /> : <EyeOff />}
                    </Button>
                    <Button
                      type="button"
                      variant={"link"}
                      className="  absolute cursor-pointer">
                      <p className=" text-[12px]"> Forget Password ?</p>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className=" w-full mt-10 cursor-pointer">
            {isloding ? <Loader2Icon className=" animate-spin" /> : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
export function RegisterForm({ switchValue }: { switchValue: () => void }) {
  const RegisterSchema = z
    .object({
      email: z.email(),
      password: z
        .string()
        .min(4, "Your password cannot be less than 4 characters"),
      confirmPassword: z.string(),
      name: z.string().min(4, "Your name cannot be less than 4 letters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Your password does not match",
      path: ["confirmPassword"],
    });

  type RegisterTypes = z.infer<typeof RegisterSchema>;

  const form = useForm<RegisterTypes>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isloding, setIsLoading] = useState(false);

  const handleRegisterForm = async (values: RegisterTypes) => {
    setIsLoading(true);

    try {
      const data = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (data.error) {
        console.log(data.error);
        toast.error(data.error.message);
        return;
      }
      toast.success("Registration successful, Please login to continue");
      switchValue();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegisterForm)}
          className=" space-y-4 mt-2">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className=" relative w-full ">
                    <Input
                      type={isVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <Button
                      type="button"
                      onClick={() => setIsVisible(!isVisible)}
                      variant={"ghost"}
                      size={"icon"}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer hover:bg-transparent">
                      {isVisible ? <Eye /> : <EyeOff />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className=" relative w-full ">
                    <Input
                      type={isVisible ? "text" : "password"}
                      placeholder="Enter your password again"
                      {...field}
                    />
                    <Button
                      type="button"
                      onClick={() => setIsVisible(!isVisible)}
                      variant={"ghost"}
                      size={"icon"}
                      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer hover:bg-transparent">
                      {isVisible ? <Eye /> : <EyeOff />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className=" w-full mt-5 cursor-pointer">
            {isloding ? <Loader2Icon className=" animate-spin" /> : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

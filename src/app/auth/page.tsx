'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/lib/shared/get-image'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { signIn, signUp } from '@/lib/authClient'
import { toast } from 'sonner'

export default function AuthPage() {
  const [value, setValue] = useState('login')

  async function handleGoogleLogin() {
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    })
  }

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${getImageUrl('Background9.jpg')})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-h-screen">
      <div
        style={backgroundStyle}
        className="hidden md:block min-h-screen h-full w-full lg:col-span-2"
      />
      {/* Auth section */}
      <div className="w-full bg-white px-6 py-20 flex items-center justify-center min-h-screen col-span-1">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold">Welcome Back!</CardTitle>
            <CardDescription>Login to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google auth */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mb-6"
              variant="outline"
            >
              <Image
                src={getImageUrl('google-logo.png')}
                alt="Google logo"
                height={20}
                width={20}
                className="mr-2"
              />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gray-300 flex-1" />
              <span className="px-3 text-sm text-gray-500">Or continue with email</span>
              <div className="h-px bg-gray-300 flex-1" />
            </div>

            {/* Tabs */}
            <Tabs value={value} onValueChange={setValue} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm switchValue={() => setValue('login')} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function LoginForm() {
  const LoginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })

  type LoginTypes = z.infer<typeof LoginSchema>

  const form = useForm<LoginTypes>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLoginForm(values: LoginTypes) {
    setIsLoading(true)
    try {
      const data = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/',
      })
      if (data.error) {
        toast.error(data.error.message)
        return
      }
      toast.success('Login successful')
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLoginForm)} className="space-y-4">
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
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <Button type="button" variant="link" className="p-0 text-sm h-auto">
                  Forgot password?
                </Button>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
        </Button>
      </form>
    </Form>
  )
}

export function RegisterForm({ switchValue }: { switchValue: () => void }) {
  const RegisterSchema = z
    .object({
      name: z.string().min(4, 'Name must be at least 4 characters'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(4, 'Password must be at least 4 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })

  type RegisterTypes = z.infer<typeof RegisterSchema>

  const form = useForm<RegisterTypes>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleRegisterForm(values: RegisterTypes) {
    setIsLoading(true)
    try {
      const data = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      if (data.error) {
        toast.error(data.error.message)
        return
      }
      toast.success('Registration successful. Please login to continue.')
      switchValue()
    } catch (error) {
      console.log(error)

      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegisterForm)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
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
                <div className="relative">
                  <Input
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
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
                <div className="relative">
                  <Input
                    type={isConfirmVisible ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                  >
                    {isConfirmVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Register'}
        </Button>
      </form>
    </Form>
  )
}

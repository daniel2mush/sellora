import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signIn } from '@/lib/authClient'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

export default function LoginForm() {
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

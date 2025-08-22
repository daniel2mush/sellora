'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { signIn } from '@/lib/authClient'
import LoginForm from './loginForm'
import RegisterForm from './registerForm'

export default function AuthPage() {
  const [value, setValue] = useState('login')

  async function handleGoogleLogin() {
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    })
  }

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755277663/Background9_pxnhvr.jpg)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left image section */}
        <div style={backgroundStyle} className="hidden md:block" />

        {/* Right auth section */}
        <div className="flex items-center justify-center p-6">
          <Card className="w-full border-none shadow-none rounded-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold">Welcome Back!</CardTitle>
              <CardDescription>Login to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full mb-6"
                variant="outline"
              >
                <Image
                  src="https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755276939/google-logo_qxfrig.png"
                  alt="Google logo"
                  height={20}
                  width={20}
                  className="mr-2"
                />
                Continue with Google
              </Button>

              <div className="flex items-center justify-center mb-6">
                <div className="h-px bg-gray-300 flex-1" />
                <span className="px-3 text-sm text-gray-500">Or continue with email</span>
                <div className="h-px bg-gray-300 flex-1" />
              </div>

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
    </div>
  )
}

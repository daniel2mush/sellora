'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/lib/shared/get-image'
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

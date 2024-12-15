'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

import BrandLogo from '@/lib/assets/brand-logo.svg'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useRouter } from 'next/navigation'

function SignInScreen() {
  const features = [
    {
      title: 'Track Stock',
      description: 'Keep an accurate count of your inventory in real-time.',
    },
    {
      title: 'Analyze Trends',
      description: 'Access insights and reports to improve decision-making.',
    },
    {
      title: 'Stay Connected',
      description: 'Manage your stock from anywhere, anytime.',
    },
  ]

  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  })
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      const result = await axios.post(
        `${window.location.origin}/api/auth/sign-in`,
        {
          email: loginDetails?.email,
          password: loginDetails?.password,
        },
      )
      if (result.data?.uid) {
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error(
        'Error during sign-in:',
        error?.response?.data || error.message,
      )
    }
  }

  return (
    <div className="flex h-screen w-full flex-row bg-background">
      <div className="hidden h-full w-1/2 bg-accent p-2 md:flex">
        <div className="flex h-full w-full flex-col gap-8 rounded-md bg-primary p-2">
          <div className="flex flex-row items-center gap-4">
            <Image src={BrandLogo} alt={'brand-logo-not-found'} />
            <Label className="text-lg font-bold text-secondary">
              FusionFox InfoTech
            </Label>
          </div>
          <div className="flex w-full flex-1 justify-center">
            <Card className="flex w-[60%] flex-col gap-4 self-center rounded-md bg-accent p-4">
              <CardHeader>
                <CardTitle>Stock Management</CardTitle>
                <CardDescription>
                  Simplify your inventory management with an easy-to-use
                  solution designed to:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {features.map((feature, index) => {
                  return (
                    <div key={index}>
                      <Label className="text-sm font-bold text-primary">
                        {feature.title}:{' '}
                      </Label>
                      <Label className="text-sm text-primary">
                        {feature.description}
                      </Label>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-1 flex-col gap-8 p-4">
        <div className="flex flex-row items-center gap-4 md:hidden">
          <Image src={BrandLogo} alt={'brand-logo-not-found'} />
          <Label className="text-lg font-bold text-primary">
            FusionFox InfoTech
          </Label>
        </div>
        <div className="flex w-full flex-col items-center justify-center py-4">
          <Label className="text-lg font-bold">Welcome User!</Label>
          <Label className="text-sm">Sign In to rock your business..!</Label>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="user-name" className="text-md font-semibold">
              User Name
            </Label>
            <Input
              id="user-name"
              placeholder="Enter your user Name"
              onChange={(e) => {
                setLoginDetails((prev) => ({
                  ...prev,
                  email: e.target?.value,
                }))
              }}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password" className="text-md font-semibold">
              Password
            </Label>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setLoginDetails((prev) => ({
                  ...prev,
                  password: e.target?.value,
                }))
              }}
            />
          </div>
          <Button onClick={() => handleSignIn()}>Sign In</Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" type="button">
          <Icons.google className="mr-2 h-4 w-4" color="" />
          Google
        </Button>
      </div>
    </div>
  )
}

export default SignInScreen

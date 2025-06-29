"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';
import { Mail, User, Lock, Globe } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  timezone: z.string().default('UTC'),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData | LoginFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: isLogin
      ? {
          email: '',
          password: '',
        }
      : {
          email: '',
          password: '',
          name: '',
          timezone: 'UTC',
        },
  });

  const onSubmit = async (data: RegisterFormData | LoginFormData) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      toast.error('API URL is not configured');
      return;
    }

    const url = isLogin
      ? `${baseUrl}/auth/login`
      : `${baseUrl}/auth/register`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success(`Successfully ${isLogin ? 'logged in' : 'registered'}`);
      if (isLogin) {
        localStorage.setItem('token', result.data.token);
        router.push('/dashboard');
      } else {
        setIsLogin(true);
        reset();
      }
    } else {
      toast.error(result.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Log in to your account' : 'Enter your details to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    {...register('name')}
                    placeholder="Full Name"
                    className="pl-10"
                  />
                </div>
                {'name' in errors && errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
            )}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  className="pl-10"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    {...register('timezone')}
                    placeholder="Timezone (e.g., UTC)"
                    className="pl-10"
                    defaultValue="UTC"
                  />
                </div>
                {(!isLogin && 'timezone' in errors && errors.timezone) && (
                  <p className="text-red-500 text-sm">{errors.timezone?.message}</p>
                )}
              </div>
            )}
            <Button type="submit" className="w-full">
              {isLogin ? 'Log In' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? 'Register' : 'Log In'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
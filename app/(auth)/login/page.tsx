'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'

type AuthMethod = 'email' | 'phone'

export default function LoginPage() {
  const router = useRouter()
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login - replace with actual auth logic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to dashboard after login
    router.push('/dashboard')
  }

  return (
    <Container>
      <div className="min-h-screen flex flex-col py-4 safe-area-pt">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="h-11 w-11 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center border border-[rgb(var(--color-border-light))] touch-feedback active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[rgb(var(--color-text))]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[rgb(var(--color-text))]">
              ยินดีต้อนรับกลับ
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              เข้าสู่ระบบบัญชีของคุณ
            </p>
          </div>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`flex-1 h-12 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              authMethod === 'email'
                ? 'bg-[rgb(var(--color-primary))] text-white shadow-lg shadow-[rgb(var(--color-primary))]/30'
                : 'bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text-secondary))] border border-[rgb(var(--color-border-light))]'
            }`}
          >
            <Mail className="h-4 w-4" />
            อีเมล
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 h-12 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              authMethod === 'phone'
                ? 'bg-[rgb(var(--color-primary))] text-white shadow-lg shadow-[rgb(var(--color-primary))]/30'
                : 'bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text-secondary))] border border-[rgb(var(--color-border-light))]'
            }`}
          >
            <Phone className="h-4 w-4" />
            เบอร์โทร
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 flex-1">
          {authMethod === 'email' ? (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-[rgb(var(--color-text))]">
                อีเมล
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[rgb(var(--color-text-tertiary))]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm text-[rgb(var(--color-text))]">
                เบอร์โทรศัพท์
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[rgb(var(--color-text-tertiary))]" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="081-234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 pl-12"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm text-[rgb(var(--color-text))]">
                รหัสผ่าน
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-[rgb(var(--color-primary))] font-medium"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[rgb(var(--color-text-tertiary))]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="กรอกรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))]"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[rgb(var(--color-border-light))]" />
          <span className="text-sm text-[rgb(var(--color-text-tertiary))]">หรือ</span>
          <div className="flex-1 h-px bg-[rgb(var(--color-border-light))]" />
        </div>

        {/* OTP Option */}
        <button
          type="button"
          className="w-full h-12 rounded-xl bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text))] font-medium border border-[rgb(var(--color-border-light))] touch-feedback active:scale-[0.98] transition-all"
        >
          เข้าสู่ระบบด้วย OTP
        </button>

        {/* Sign up link */}
        <p className="text-center text-sm text-[rgb(var(--color-text-secondary))] mt-6 pb-safe">
          ยังไม่มีบัญชี?{' '}
          <Link href="/login" className="text-[rgb(var(--color-primary))] font-medium">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </Container>
  )
}

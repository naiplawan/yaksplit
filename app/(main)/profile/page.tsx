'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ArrowLeft,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Save,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function ProfilePage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('ผู้ใช้')
  const [promptpayId, setPromptpayId] = useState('')
  const [showPromptpaySheet, setShowPromptpaySheet] = useState(false)
  const [tempPromptpay, setTempPromptpay] = useState('')

  // Mock user data - replace with actual user data
  const user = {
    display_name: displayName,
    email: 'user@example.com',
    promptpay_id: promptpayId || null,
  }

  const handleSavePromptpay = () => {
    setPromptpayId(tempPromptpay)
    setShowPromptpaySheet(false)
  }

  const handleLogout = () => {
    // Clear auth state and redirect to landing page
    router.push('/')
  }

  const menuItems = [
    {
      icon: Bell,
      label: 'การแจ้งเตือน',
      description: 'จัดการการแจ้งเตือน',
      href: '#',
    },
    {
      icon: Shield,
      label: 'ความปลอดภัย',
      description: 'รหัสผ่านและการยืนยันตัวตน',
      href: '#',
    },
    {
      icon: HelpCircle,
      label: 'ช่วยเหลือ',
      description: 'ติดต่อเรา',
      href: '#',
    },
  ]

  return (
    <Container>
      <div className="py-4 safe-area-pt space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="h-11 w-11 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center border border-[rgb(var(--color-border-light))] touch-feedback active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[rgb(var(--color-text))]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[rgb(var(--color-text))]">
              โปรไฟล์
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              จัดการบัญชีของคุณ
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card-mobile p-6 text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-[rgb(var(--color-primary))]/20">
            <AvatarFallback className="bg-[rgb(var(--color-primary))] text-white text-2xl font-bold">
              {user.display_name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))] mb-1">
            {user.display_name}
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            {user.email}
          </p>
        </div>

        {/* PromptPay Section */}
        <div className="card-mobile p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[rgb(var(--color-primary))]/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-[rgb(var(--color-primary))]" />
              </div>
              <div>
                <div className="font-medium text-[rgb(var(--color-text))]">
                  พร้อมเพย์
                </div>
                <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                  {user.promptpay_id || 'ยังไม่ได้ตั้งค่า'}
                </div>
              </div>
            </div>
            <Sheet open={showPromptpaySheet} onOpenChange={setShowPromptpaySheet}>
              <SheetTrigger asChild>
                <button
                  onClick={() => setTempPromptpay(promptpayId)}
                  className="h-11 px-4 rounded-xl bg-[rgb(var(--color-primary))] text-white text-sm font-medium touch-feedback active:scale-95 transition-all"
                >
                  {user.promptpay_id ? 'แก้ไข' : 'เพิ่ม'}
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>พร้อมเพย์ ID</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                    กรอกเบอร์โทรหรือเลขบัตรประชาชนสำหรับพร้อมเพย์ จะใช้สร้าง QR Code สำหรับรับเงิน
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="promptpay">เบอร์โทรหรือเลขบัตรประชาชน</Label>
                    <Input
                      id="promptpay"
                      placeholder="081-234-5678 หรือ 1-1234-56789-01-2"
                      value={tempPromptpay}
                      onChange={(e) => setTempPromptpay(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSavePromptpay}
                    disabled={!tempPromptpay.trim()}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    บันทึก
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="card-mobile p-4 flex items-center justify-between touch-feedback active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
                </div>
                <div>
                  <div className="font-medium text-[rgb(var(--color-text))]">
                    {item.label}
                  </div>
                  <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                    {item.description}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-[rgb(var(--color-text-tertiary))]" />
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="card-mobile p-4 w-full flex items-center justify-center gap-2 text-[rgb(var(--color-error))] font-medium touch-feedback active:scale-[0.99] transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>ออกจากระบบ</span>
        </button>

        {/* Version */}
        <p className="text-center text-xs text-[rgb(var(--color-text-tertiary))] pb-safe">
          YakSplit เวอร์ชัน 1.0.0
        </p>
      </div>
    </Container>
  )
}

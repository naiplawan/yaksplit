import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import {
  QrCode,
  Users,
  ArrowRight,
  Shield,
  CheckCircle,
  Clock,
  ThumbsUp,
  CreditCard,
  Share2,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-[rgb(var(--color-bg))] min-h-screen">
      {/* Hero Section - Mobile First */}
      <section className="relative overflow-hidden gradient-thai-subtle px-4 pt-8 pb-12 safe-area-pt">
        <Container>
          <div className="text-center max-w-lg mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--color-primary))]/10 px-4 py-2 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[rgb(var(--color-primary))] animate-pulse" />
              <span className="text-sm font-medium text-[rgb(var(--color-primary))]">
                ทำเพื่อกรุงเทพฯ
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[rgb(var(--color-text))] mb-4 leading-tight">
              แบ่งบิล{' '}
              <span className="text-[rgb(var(--color-primary))]">ง่ายนิดเดียว</span>
            </h1>

            <p className="text-base text-[rgb(var(--color-text-secondary))] mb-6 leading-relaxed">
              สร้าง QR Code พร้อมเพย์ได้ทันที
              <br className="hidden sm:block" />
              ไม่ต้องสมัคร ไม่ต้องล็อกอิน
            </p>

            {/* CTA Buttons - Stack on mobile */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full h-14 text-base"
                asChild
              >
                <Link href="/events/new">
                  สร้างกิจกรรมใหม่
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full h-12"
                asChild
              >
                <Link href="#how-it-works">
                  ดูวิธีใช้งาน
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-[rgb(var(--color-text-tertiary))]">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {['ก', 'ข', 'ค', 'ง'][i - 1]}
                  </div>
                ))}
              </div>
              <span>500+ คนใช้งานแล้ว</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section - Horizontal scroll on mobile */}
      <section className="py-8 px-4">
        <Container>
          <h2 className="text-xl font-bold text-center mb-6 text-[rgb(var(--color-text))]">
            ทำไมต้อง YakSplit?
          </h2>

          {/* Horizontal scroll cards */}
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
            <FeatureCard
              icon={<QrCode className="h-6 w-6" />}
              title="QR Code ทันที"
              description="สร้าง QR พร้อมเพย์สำหรับแต่ละคน"
              color="primary"
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="แบ่งใน 30 วิ"
              description="สร้างและแบ่งได้ในไม่กี่วินาที"
              color="accent"
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6" />}
              title="แชร์ลิงก์"
              description="ส่งลิงก์ให้เพื่อน จ่ายได้เลย"
              color="secondary"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="ไม่ต้องล็อกอิน"
              description="ไม่ต้องสมัครสมาชิก"
              color="primary"
            />
          </div>
        </Container>
      </section>

      {/* How It Works - Mobile First Vertical Steps */}
      <section id="how-it-works" className="py-8 px-4 bg-[rgb(var(--color-bg-alt))] scroll-mt-16">
        <Container>
          <h2 className="text-xl font-bold text-center mb-8 text-[rgb(var(--color-text))]">
            วิธีใช้งาน
          </h2>

          {/* Vertical Timeline Steps */}
          <div className="max-w-sm mx-auto">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--color-primary))] text-white flex items-center justify-center shadow-lg shadow-[rgb(var(--color-primary))]/30">
                  <Users className="h-6 w-6" />
                </div>
                <div className="w-0.5 flex-1 bg-[rgb(var(--color-border-light))] my-2" />
              </div>
              <div className="flex-1 pb-6">
                <div className="card-mobile p-4">
                  <div className="text-xs text-[rgb(var(--color-primary))] font-semibold mb-1">
                    ขั้นตอนที่ 1
                  </div>
                  <h3 className="text-base font-bold text-[rgb(var(--color-text))] mb-1">
                    สร้างกิจกรรม
                  </h3>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                    ตั้งชื่อกิจกรรม เพิ่มชื่อเพื่อน เสร็จ!
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--color-accent))] text-white flex items-center justify-center shadow-lg shadow-[rgb(var(--color-accent))]/30">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="w-0.5 flex-1 bg-[rgb(var(--color-border-light))] my-2" />
              </div>
              <div className="flex-1 pb-6">
                <div className="card-mobile p-4">
                  <div className="text-xs text-[rgb(var(--color-accent))] font-semibold mb-1">
                    ขั้นตอนที่ 2
                  </div>
                  <h3 className="text-base font-bold text-[rgb(var(--color-text))] mb-1">
                    เพิ่มรายจ่าย
                  </h3>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                    กรอกยอด เลือกคนจ่าย แบ่งอัตโนมัติ
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--color-secondary))] text-white flex items-center justify-center shadow-lg shadow-[rgb(var(--color-secondary))]/30">
                  <QrCode className="h-6 w-6" />
                </div>
              </div>
              <div className="flex-1">
                <div className="card-mobile p-4">
                  <div className="text-xs text-[rgb(var(--color-secondary))] font-semibold mb-1">
                    ขั้นตอนที่ 3
                  </div>
                  <h3 className="text-base font-bold text-[rgb(var(--color-text))] mb-1">
                    แชร์และเก็บเงิน
                  </h3>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                    ส่งลิงก์ เพื่อนสแกน QR จ่ายตรงเข้าพร้อมเพย์
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Section */}
      <section className="py-8 px-4">
        <Container>
          <div className="card-mobile text-center p-6">
            <div className="h-16 w-16 rounded-full bg-[rgb(var(--color-success))]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-[rgb(var(--color-success))]" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[rgb(var(--color-text))]">
              ไม่ต้องถามอีกว่า
            </h3>
            <p className="text-2xl font-bold text-[rgb(var(--color-primary))] mb-3">
              "ใครค้างเท่าไหร่?"
            </p>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
              YakSplit ติดตามให้อัตโนมัติ บอกลาบทสนทนาเรื่องเงินที่อึดอัด
            </p>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-10 px-4 gradient-thai text-white">
        <Container>
          <div className="text-center max-w-sm mx-auto">
            <ThumbsUp className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">
              พร้อมแบ่งบิลแรก?
            </h2>
            <p className="text-base mb-6 opacity-90">
              ฟรี! ไม่ต้องสมัคร ไม่ต้องล็อกอิน
            </p>
            <Button
              size="lg"
              className="w-full h-14 bg-white text-[rgb(var(--color-primary))] hover:bg-gray-50 text-base font-semibold"
              asChild
            >
              <Link href="/events/new">
                สร้างกิจกรรมใหม่
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-[rgb(var(--color-border-light))] bg-[rgb(var(--color-bg-alt))]">
        <Container>
          <div className="text-center">
            <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
              © 2025 YakSplit • สร้างด้วยใจในกรุงเทพฯ 🇹🇭
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

// Compact Feature Card for horizontal scroll
function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'accent' | 'secondary'
}) {
  const colors = {
    primary: {
      bg: 'bg-[rgb(var(--color-primary))]/10',
      text: 'text-[rgb(var(--color-primary))]',
    },
    accent: {
      bg: 'bg-[rgb(var(--color-accent))]/10',
      text: 'text-[rgb(var(--color-accent))]',
    },
    secondary: {
      bg: 'bg-[rgb(var(--color-bg-alt))]/10',
      text: 'text-[rgb(var(--color-secondary))]',
    },
  }

  return (
    <div className="flex-shrink-0 w-40 snap-start">
      <div className="card-mobile p-4 h-full">
        <div className={`h-12 w-12 rounded-xl ${colors[color].bg} flex items-center justify-center mb-3`}>
          <div className={colors[color].text}>
            {icon}
          </div>
        </div>
        <h3 className="text-sm font-bold mb-1 text-[rgb(var(--color-text))]">
          {title}
        </h3>
        <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

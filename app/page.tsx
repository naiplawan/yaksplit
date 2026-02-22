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
  Wallet,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-[var(--surface-background)] min-h-screen">
      {/* Hero Section */}
      <section className="px-4 pt-12 pb-16 safe-area-pt">
        <Container>
          <div className="text-center max-w-lg mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-primary-100)] px-4 py-2 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[var(--color-brand-primary-500)]" />
              <span className="text-sm font-medium text-[var(--color-brand-primary-600)]">
                ทำเพื่อกรุงเทพฯ
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[rgb(var(--color-text))] mb-4 leading-tight">
              แบ่งบิล{' '}
              <span className="text-[var(--color-brand-primary-500)]">ง่ายนิดเดียว</span>
            </h1>

            <p className="text-base text-[rgb(var(--color-text-secondary))] mb-8 leading-relaxed">
              สร้าง QR Code พร้อมเพย์ได้ทันที
              <br />
              ไม่ต้องสมัคร ไม่ต้องล็อกอิน
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button size="lg" className="w-full h-12" asChild>
                <Link href="/events/new">
                  สร้างกิจกรรมใหม่
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="w-full h-11" asChild>
                <Link href="#how-it-works">
                  ดูวิธีใช้งาน
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center justify-center gap-3 text-sm text-[rgb(var(--color-text-tertiary))]">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      backgroundColor: `hsl(${(i * 40) % 360}, 70%, 60%)`,
                    }}
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

      {/* Features */}
      <section className="py-8 px-4">
        <Container>
          <h2 className="text-xl font-bold text-center mb-6 text-[rgb(var(--color-text))]">
            ทำไมต้อง YakSplit?
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <FeatureCard
              icon={<QrCode className="h-5 w-5" />}
              title="QR Code ทันที"
              description="สร้าง QR พร้อมเพย์สำหรับแต่ละคน"
            />
            <FeatureCard
              icon={<Clock className="h-5 w-5" />}
              title="แบ่งใน 30 วิ"
              description="สร้างและแบ่งได้ในไม่กี่วินาที"
            />
            <FeatureCard
              icon={<Share2 className="h-5 w-5" />}
              title="แชร์ลิงก์"
              description="ส่งลิงก์ให้เพื่อน จ่ายได้เลย"
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="ไม่ต้องล็อกอิน"
              description="ไม่ต้องสมัครสมาชิก"
            />
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-10 px-4 bg-[var(--surface-background-alt)] scroll-mt-16">
        <Container>
          <h2 className="text-xl font-bold text-center mb-8 text-[rgb(var(--color-text))]">
            วิธีใช้งาน
          </h2>

          <div className="max-w-sm mx-auto space-y-6">
            <Step
              number={1}
              icon={<Users className="h-5 w-5" />}
              title="สร้างกิจกรรม"
              description="ตั้งชื่อกิจกรรม เพิ่มชื่อเพื่อน เสร็จ!"
            />
            <Step
              number={2}
              icon={<CreditCard className="h-5 w-5" />}
              title="เพิ่มรายจ่าย"
              description="กรอกยอด เลือกคนจ่าย แบ่งอัตโนมัติ"
            />
            <Step
              number={3}
              icon={<QrCode className="h-5 w-5" />}
              title="แชร์และเก็บเงิน"
              description="ส่งลิงก์ เพื่อนสแกน QR จ่ายตรงเข้าพร้อมเพย์"
            />
          </div>
        </Container>
      </section>

      {/* Trust Section */}
      <section className="py-10 px-4">
        <Container>
          <div className="card-mobile text-center p-6 max-w-sm mx-auto">
            <div className="h-14 w-14 rounded-xl bg-[var(--color-semantic-success-100)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-7 w-7 text-[var(--color-semantic-success-500)]" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[rgb(var(--color-text))]">
              ไม่ต้องถามอีกว่า
            </h3>
            <p className="text-2xl font-bold text-[var(--color-brand-primary-500)] mb-3">
              "ใครค้างเท่าไหร่?"
            </p>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
              YakSplit ติดตามให้อัตโนมัติ บอกลาบทสนทนาเรื่องเงินที่อึดอัด
            </p>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-4">
        <Container>
          <div className="text-center max-w-sm mx-auto">
            <div className="h-14 w-14 rounded-xl bg-[var(--color-brand-primary-100)] flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-7 w-7 text-[var(--color-brand-primary-500)]" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-[rgb(var(--color-text))]">
              พร้อมแบ่งบิลแรก?
            </h2>
            <p className="text-base mb-6 text-[rgb(var(--color-text-secondary))]">
              ฟรี! ไม่ต้องสมัคร ไม่ต้องล็อกอิน
            </p>
            <Button size="lg" className="w-full h-12 max-w-xs" asChild>
              <Link href="/events/new">
                สร้างกิจกรรมใหม่
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-[rgb(var(--color-border-light))] bg-[var(--surface-background-alt)]">
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card-mobile p-4 h-full">
      <div className="h-10 w-10 rounded-xl bg-[var(--color-brand-primary-100)] flex items-center justify-center mb-3">
        <div className="text-[var(--color-brand-primary-500)]">
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-semibold mb-1 text-[rgb(var(--color-text))]">
        {title}
      </h3>
      <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: number
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-xl bg-[var(--color-brand-primary-500)] text-white flex items-center justify-center">
          {icon}
        </div>
        {number < 3 && (
          <div className="w-0.5 flex-1 bg-[rgb(var(--color-border-light))] my-2" />
        )}
      </div>
      <div className="flex-1 pb-2">
        <div className="card-mobile p-4">
          <div className="text-xs text-[var(--color-brand-primary-500)] font-semibold mb-1">
            ขั้นตอนที่ {number}
          </div>
          <h3 className="text-base font-bold text-[rgb(var(--color-text))] mb-1">
            {title}
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

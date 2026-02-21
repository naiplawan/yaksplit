import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import {
  QrCode,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Smartphone,
  CheckCircle,
  Clock,
  ThumbsUp,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-[rgb(var(--color-bg))] min-h-screen">
      {/* Hero Section - Mobile First */}
      <section className="relative overflow-hidden gradient-thai-subtle px-4 pt-8 pb-16 safe-area-pt">
        <Container>
          <div className="text-center max-w-lg mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--color-primary))]/10 px-4 py-2 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[rgb(var(--color-primary))] animate-pulse" />
              <span className="text-sm font-medium text-[rgb(var(--color-primary))]">
                Made for Bangkok
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-hero text-[rgb(var(--color-text))] mb-4">
              Split Bills{' '}
              <span className="text-[rgb(var(--color-primary))]">Easy</span>
            </h1>

            <p className="text-lg text-[rgb(var(--color-text-secondary))] mb-8">
              Generate PromptPay QR codes instantly. No app download needed for your friends.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="btn-primary w-full sm:w-auto"
                asChild
              >
                <Link href="/login">
                  Start Splitting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="btn-secondary w-full sm:w-auto"
                asChild
              >
                <Link href="#how-it-works">
                  How it Works
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-[rgb(var(--color-text-tertiary))]">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-[rgb(var(--color-border))] border-2 border-[rgb(var(--color-bg))]"
                    />
                  ))}
                </div>
                <span>500+ Bangkok users</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section - Mobile Cards */}
      <section className="py-12 px-4">
        <Container>
          <h2 className="text-section text-center mb-8">
            Why YakSplit?
          </h2>

          {/* Horizontal scroll on mobile */}
          <div className="flex gap-4 overflow-x-auto snap-x-mobile pb-4 scrollbar-hide">
            <FeatureCard
              icon={<QrCode className="h-7 w-7" />}
              title="Instant QR Codes"
              description="Generate unique PromptPay QR codes for each person. Scan with K Plus, SCB Easy, or any Thai banking app."
            />
            <FeatureCard
              icon={<Clock className="h-7 w-7" />}
              title="30-Second Splits"
              description="Create an event, add members, and split expenses in under 30 seconds. Focus on your friends, not math."
            />
            <FeatureCard
              icon={<Users className="h-7 w-7" />}
              title="Share Links"
              description="Send a link to friends. They can view their split and pay without logging in or downloading an app."
            />
            <FeatureCard
              icon={<Shield className="h-7 w-7" />}
              title="No Login Required"
              description="Friends can view and pay their share instantly. Only you need to create an account."
            />
          </div>
        </Container>
      </section>

      {/* How It Works - Steps */}
      <section id="how-it-works" className="py-12 px-4 bg-[rgb(var(--color-bg-alt))]">
        <Container>
          <h2 className="text-section text-center mb-8">
            How It Works
          </h2>

          <div className="max-w-md mx-auto space-y-6">
            <StepCard
              step="1"
              title="Create Event"
              description="Start a new event and add your friends by name. That's it!"
              icon={<Users className="h-6 w-6" />}
            />
            <StepCard
              step="2"
              title="Add Bills"
              description="Add expenses as they come. Enter who paid and how to split. We handle the math."
              icon={<Smartphone className="h-6 w-6" />}
            />
            <StepCard
              step="3"
              title="Share & Collect"
              description="Each person gets a QR code. They scan and pay directly to your PromptPay."
              icon={<QrCode className="h-6 w-6" />}
            />
          </div>
        </Container>
      </section>

      {/* Testimonial / Trust */}
      <section className="py-12 px-4">
        <Container>
          <div className="card-mobile text-center p-6">
            <CheckCircle className="h-12 w-12 text-[rgb(var(--color-success))] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-[rgb(var(--color-text))]">
              No More "Who Owes What"
            </h3>
            <p className="text-[rgb(var(--color-text-secondary))]">
              YakSplit automatically tracks who has paid and who still owes. Say goodbye to awkward money conversations.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 gradient-thai text-white">
        <Container>
          <div className="text-center max-w-md mx-auto">
            <ThumbsUp className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl font-bold mb-3">
              Ready to Split Your First Bill?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join hundreds of Bangkok users splitting bills the easy way.
            </p>
            <Button
              size="lg"
              className="bg-white text-[rgb(var(--color-primary))] hover:bg-gray-50 btn-primary"
              asChild
            >
              <Link href="/login">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[rgb(var(--color-border-light))]">
        <Container>
          <div className="text-center text-sm text-[rgb(var(--color-text-tertiary))]">
            <p>© 2025 YakSplit • Made with ใจ in Bangkok 🇹🇭</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

// Mobile Feature Card Component
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
    <div className="card-mobile flex-shrink-0 w-72 snap-center">
      <div className="h-14 w-14 rounded-2xl bg-[rgb(var(--color-primary))]/10 flex items-center justify-center mb-4">
        <div className="text-[rgb(var(--color-primary))]">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-[rgb(var(--color-text))]">
        {title}
      </h3>
      <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
        {description}
      </p>
    </div>
  )
}

// Step Card Component
function StepCard({
  step,
  title,
  description,
  icon,
}: {
  step: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full bg-[rgb(var(--color-primary))] text-white flex items-center justify-center text-lg font-bold">
          {step}
        </div>
      </div>
      <div className="flex-1">
        <div className="h-10 w-10 rounded-xl bg-[rgb(var(--color-primary))]/10 flex items-center justify-center mb-3">
          <div className="text-[rgb(var(--color-primary))]">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-1 text-[rgb(var(--color-text))]">
          {title}
        </h3>
        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
          {description}
        </p>
      </div>
    </div>
  )
}

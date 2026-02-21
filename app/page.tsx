import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Container } from '@/components/layout/Container'
import {
  QrCode,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Check,
  Smartphone,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-32">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              Made for Bangkok
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Split Bills the{' '}
              <span className="text-primary">Thai Way</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Powered by <span className="font-semibold">YakSplit</span> 💸
            </p>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The easiest way to split bills with friends in Bangkok. Generate PromptPay QR codes for each person in seconds. No app download required for your friends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg">
                <Link href="/login">
                  Start Splitting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why YakSplit?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for how Thai friends split bills
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">PromptPay QR Codes</h3>
                <p className="text-muted-foreground">
                  Generate unique QR codes for each person. Your friends can scan with any Thai banking app - K Plus, SCB Easy, Krungthai NEXT, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">30-Second Splits</h3>
                <p className="text-muted-foreground">
                  Create an event, add members, and split expenses in under 30 seconds. Focus on enjoying time with friends, not doing math.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Links</h3>
                <p className="text-muted-foreground">
                  Send a link to friends. They can view their split and payment QR code without logging in. Perfect for large groups.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
                <p className="text-muted-foreground">
                  Designed for phones. Easy to use at the dinner table, at a bar, or anywhere you need to split a bill.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Login Required</h3>
                <p className="text-muted-foreground">
                  Your friends can view and pay their share without creating an account. Only hosts need to sign up.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Splitting</h3>
                <p className="text-muted-foreground">
                  Split equally, custom amounts, or by percentage. Handle any splitting situation - from dinner to trips.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-muted/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to split your bill
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create an Event</h3>
                <p className="text-muted-foreground">
                  Start a new event, give it a name like &quot;Friday Dinner&quot; or &quot;Chiang Mai Trip&quot;, and add your friends by name.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Add Expenses</h3>
                <p className="text-muted-foreground">
                  Add bills as they come. Enter the amount, who paid, and how to split. We handle the math automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Share & Collect</h3>
                <p className="text-muted-foreground">
                  Each person sees exactly what they owe with a personalized PromptPay QR code. One scan and they&apos;re done!
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Split Your First Bill?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of Bangkok users splitting bills the easy way.
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg">
              <Link href="/login">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <Container>
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 YakSplit. Made with ใจ in Bangkok.</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

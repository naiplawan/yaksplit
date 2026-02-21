# YakSplit 💸

> *"Yak" (แยก) means "to split" or "to separate" in Thai*

A modern bill-splitting app designed for Bangkok users, featuring PromptPay QR code generation for easy peer-to-peer payments.

## Features

- **PromptPay QR Codes**: Generate unique QR codes for each person to scan with their Thai banking app (K Plus, SCB Easy, Krungthai NEXT, etc.)
- **Quick Splits**: Create events and split bills in under 30 seconds
- **Share Links**: Send a link to friends - they can view their split and pay without logging in
- **Flexible Splitting**: Split equally, custom amounts, or by percentage
- **Mobile-First Design**: Optimized for phone screens, perfect for use at restaurants and bars

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Phone + OTP)
- **State**: React Query (TanStack Query)
- **Validation**: Zod
- **QR Generation**: promptpay-qr + qrcode libraries

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (get one free at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd yaksplit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Run database migrations:
```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in supabase/migrations/001_initial_schema.sql
# in your Supabase SQL editor
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
yaksplit/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Auth routes
│   ├── (main)/                # Main app routes (dashboard, events, etc.)
│   ├── share/[code]/          # Public share page
│   ├── api/                   # API routes
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/                # Header, BottomNav, Container
│   ├── event/                 # Event-related components
│   ├── expense/               # Expense-related components
│   └── payment/               # Payment-related components
├── lib/
│   ├── supabase/              # Supabase clients (browser, server, admin)
│   ├── qr/                    # PromptPay QR generation
│   ├── utils/                 # Utility functions
│   ├── services/              # Service layer (EventService, ExpenseService)
│   ├── hooks/                 # React Query hooks
│   └── validations/           # Zod schemas
├── types/                     # TypeScript type definitions
└── supabase/
    └── migrations/            # Database migrations
```

## Database Schema

- `users` - User profiles
- `events` - Bill split events
- `event_members` - Event participants
- `expenses` - Individual expenses
- `splits` - How expenses are divided
- `payments` - Payment records
- `friendships` - User friendships

## API Routes

### Events
- `GET /api/events` - List user's events
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `GET /api/events/code/[code]` - Get event by share code

### Members
- `GET /api/events/[id]/members` - List event members
- `POST /api/events/[id]/members` - Add member
- `PUT /api/events/[id]/members/[mid]` - Update member
- `DELETE /api/events/[id]/members/[mid]` - Remove member

### Expenses
- `GET /api/events/[id]/expenses` - List event expenses
- `POST /api/events/[id]/expenses` - Create expense
- `GET /api/expenses/[id]` - Get expense details
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

### Splits & Payments
- `GET /api/splits/[id]/qr` - Generate PromptPay QR code
- `PUT /api/splits/[id]` - Mark split as paid
- `POST /api/splits/[id]/payment` - Record payment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

---

Made with ใจ in Bangkok 🇹🇭

import { createClient } from '@/lib/supabase/server'
import { generatePromptPayQR } from '@/lib/qr/promptpay'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

type SplitWithRelations = Database['public']['Tables']['splits']['Row'] & {
  expense: {
    currency: string
    title: string
    payer: {
      promptpay_id: string | null
      nickname: string
    } | null
  } | null
}

// GET /api/splits/[id]/qr - Generate QR code for a split
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get split with member and expense info
    const { data: split, error } = await supabase
      .from('splits')
      .select(`
        *,
        member:event_members(*),
        expense:expenses(
          *,
          event:events(*),
          payer:event_members(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error || !split) {
      return NextResponse.json({ error: 'Split not found' }, { status: 404 })
    }

    // Type assertion for nested data
    const splitData = split as unknown as SplitWithRelations

    // Get promptpay_id from payer (the person receiving money)
    const payerPromptPayId = splitData.expense?.payer?.promptpay_id

    if (!payerPromptPayId) {
      return NextResponse.json(
        { error: 'PromptPay ID not set for the payer' },
        { status: 400 }
      )
    }

    // Calculate remaining amount
    const amountOwed = Number(splitData.amount_owed)
    const amountPaid = Number(splitData.amount_paid)
    const remainingAmount = Math.max(0, amountOwed - amountPaid)

    if (remainingAmount <= 0) {
      return NextResponse.json(
        { error: 'This split has already been paid' },
        { status: 400 }
      )
    }

    // Generate QR code
    const qrData = await generatePromptPayQR(payerPromptPayId, remainingAmount)

    return NextResponse.json({
      data: {
        qr_code: qrData.dataUrl,
        amount: remainingAmount,
        currency: splitData.expense?.currency || 'THB',
        payer_name: splitData.expense?.payer?.nickname || 'Payer',
        expense_title: splitData.expense?.title,
      },
    })
  } catch (error: any) {
    console.error('Error generating QR code:', error)

    return NextResponse.json(
      { error: error.message || 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

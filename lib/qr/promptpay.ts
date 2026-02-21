import generatePayload from 'promptpay-qr'
import QRCode from 'qrcode'

export interface PromptPayQROptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
}

export interface PromptPayQRResult {
  dataUrl: string
  payload: string
}

/**
 * Generate a PromptPay QR code as a data URL
 * @param phoneNumber - Thai phone number (with or without dashes)
 * @param amount - Amount to transfer in THB
 * @param options - QR code generation options
 * @returns Promise with dataUrl and raw payload
 */
export async function generatePromptPayQR(
  phoneNumber: string,
  amount: number,
  options: PromptPayQROptions = {}
): Promise<PromptPayQRResult> {
  const {
    width = 300,
    margin = 2,
    color = {
      dark: '#000000',
      light: '#FFFFFF',
    },
  } = options

  // Remove dashes, spaces, and +66 prefix from phone number
  // Thai phone numbers can be:
  // - 081-234-5678 (with dashes)
  // - 081 234 5678 (with spaces)
  // - +66812345678 (with country code)
  // - 0812345678 (raw 10 digits)
  // - PromptPay ID (13 digits)
  let cleanPhone = phoneNumber
    .replace(/-/g, '')
    .replace(/\s/g, '')
    .replace(/^\+66/, '0') // Convert +66 to 0 prefix

  // Validate Thai phone number (10 digits starting with 0) or PromptPay ID (13 digits)
  const isValidPhone = /^0\d{9}$/.test(cleanPhone)
  const isValidPromptPayId = /^\d{13}$/.test(cleanPhone)

  if (!isValidPhone && !isValidPromptPayId) {
    throw new Error(
      'Invalid phone number or PromptPay ID. Phone must be 10 digits starting with 0, or PromptPay ID must be 13 digits.'
    )
  }

  // Validate amount
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  if (amount > 500000) {
    throw new Error('Amount cannot exceed 500,000 THB')
  }

  // Generate PromptPay payload
  const payload = generatePayload(cleanPhone, { amount })

  // Convert to QR code data URL
  const dataUrl = await QRCode.toDataURL(payload, {
    width,
    margin,
    color,
    errorCorrectionLevel: 'M', // Medium error correction
  })

  return {
    dataUrl,
    payload,
  }
}

/**
 * Generate PromptPay QR code as SVG string
 * @param phoneNumber - Thai phone number
 * @param amount - Amount to transfer in THB
 * @returns Promise with SVG string and raw payload
 */
export async function generatePromptPayQRSVG(
  phoneNumber: string,
  amount: number
): Promise<{ svg: string; payload: string }> {
  // Remove formatting from phone number
  let cleanPhone = phoneNumber
    .replace(/-/g, '')
    .replace(/\s/g, '')
    .replace(/^\+66/, '0')

  // Validate
  const isValidPhone = /^0\d{9}$/.test(cleanPhone)
  const isValidPromptPayId = /^\d{13}$/.test(cleanPhone)

  if (!isValidPhone && !isValidPromptPayId) {
    throw new Error('Invalid phone number or PromptPay ID')
  }

  if (amount <= 0 || amount > 500000) {
    throw new Error('Invalid amount')
  }

  // Generate PromptPay payload
  const payload = generatePayload(cleanPhone, { amount })

  // Convert to QR code SVG
  const svg = await QRCode.toString(payload, {
    type: 'svg',
    errorCorrectionLevel: 'M',
  })

  return { svg, payload }
}

/**
 * Format Thai phone number for display
 * @param phoneNumber - Raw phone number
 * @returns Formatted phone number (e.g., 081-234-5678)
 */
export function formatThaiPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/-/g, '').replace(/\s/g, '').replace(/^\+66/, '0')

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return phoneNumber
}

/**
 * Validate Thai phone number or PromptPay ID
 * @param phoneNumber - Phone number or PromptPay ID to validate
 * @returns True if valid
 */
export function isValidThaiPhoneOrPromptPayId(phoneNumber: string): boolean {
  const cleaned = phoneNumber
    .replace(/-/g, '')
    .replace(/\s/g, '')
    .replace(/^\+66/, '0')

  return /^0\d{9}$/.test(cleaned) || /^\d{13}$/.test(cleaned)
}

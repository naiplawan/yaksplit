'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Crown, Check } from 'lucide-react'
import { formatThaiCurrency, formatThaiPhone } from '@/lib/utils/format'

export interface MemberWithBalance {
  id: string
  nickname: string
  role?: string
  promptpay_id?: string | null
  totalOwed?: number
  totalPaid?: number
  balance?: number
}

interface MemberListProps {
  members: MemberWithBalance[]
  showBalances?: boolean
  onMemberClick?: (member: MemberWithBalance) => void
}

export function MemberList({
  members,
  showBalances = false,
  onMemberClick,
}: MemberListProps) {
  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isPaid = showBalances && (member.balance ?? 0) <= 0
        const isPartial = showBalances && (member.balance ?? 0) > 0 && (member.totalPaid ?? 0) > 0

        return (
          <button
            key={member.id}
            onClick={() => onMemberClick?.(member)}
            className={`card-mobile p-4 w-full flex items-center justify-between text-left touch-feedback active:scale-[0.99] transition-all ${
              onMemberClick ? 'cursor-pointer' : 'cursor-default'
            }`}
            disabled={!onMemberClick}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback
                  className={`${
                    showBalances && isPaid
                      ? 'bg-[rgb(var(--color-success))]/10 text-[rgb(var(--color-success))]'
                      : showBalances && (member.balance ?? 0) > 0
                      ? 'bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))]'
                      : 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                  } text-sm font-medium`}
                >
                  {member.nickname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-[rgb(var(--color-text))] flex items-center gap-2">
                  {member.nickname}
                  {member.role === 'creator' && (
                    <Crown className="h-3.5 w-3.5 text-[rgb(var(--color-secondary))]" />
                  )}
                </div>
                {showBalances && member.totalOwed !== undefined ? (
                  <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                    ค้าง: {formatThaiCurrency(member.totalOwed)}
                  </div>
                ) : member.promptpay_id ? (
                  <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                    {formatThaiPhone(member.promptpay_id)}
                  </div>
                ) : null}
              </div>
            </div>

            {showBalances && (
              <div className="text-right">
                {isPaid ? (
                  <div className="flex items-center gap-1 text-[rgb(var(--color-success))] font-semibold">
                    <Check className="h-4 w-4" />
                    <span className="text-sm">จ่ายแล้ว</span>
                  </div>
                ) : (
                  <>
                    <div
                      className={`font-bold ${
                        isPartial
                          ? 'text-[rgb(var(--color-warning))]'
                          : 'text-[rgb(var(--color-error))]'
                      }`}
                    >
                      {formatThaiCurrency(member.balance ?? 0)}
                    </div>
                    {isPartial && (
                      <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                        จ่ายแล้ว {formatThaiCurrency(member.totalPaid ?? 0)}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

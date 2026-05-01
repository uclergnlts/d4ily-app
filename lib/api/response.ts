import { NextResponse } from "next/server"

type ApiMeta = Record<string, unknown>

export function apiSuccess<T>(data: T, meta?: ApiMeta, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    { status },
  )
}

export function apiError(message: string, status = 500, details?: ApiMeta) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        ...(details ? { details } : {}),
      },
    },
    { status },
  )
}

export function parseLimit(value: string | null, fallback = 20, max = 100) {
  const parsed = Number.parseInt(value ?? "", 10)

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback
  }

  return Math.min(parsed, max)
}

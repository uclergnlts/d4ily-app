"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // API Call
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubscribed(true)

        // Clear success message after 5 seconds to allow re-sub
        setTimeout(() => {
          setSubscribed(false)
          setEmail("")
        }, 5000)
      } else {
        alert(data.message || 'Bir hata oluştu.')
      }
    } catch (err) {
      console.error(err)
      alert("Bağlantı hatası.")
    }
  }

  return (
    <section className="py-12 lg:py-16" style={{ backgroundColor: "#0066FF" }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-5xl mx-auto bg-stone-100 rounded-3xl p-6 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left side - Text content */}
            <div className="flex-1 space-y-3">
              <p className="text-xs font-medium text-gray-500 tracking-wider uppercase">İLK SEN OKU GÜNDEMİ</p>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                Son gelişmeleri kaçırma 📰
                <br />
                Kısa gündem özetleri için <span className="text-red-600">mail adresini</span>
                <br />
                bırak 📧
              </h2>
              <p className="text-sm font-medium text-gray-900">
                Tamamen <span className="font-bold">ÜCRETSİZ!</span>
              </p>
            </div>

            {/* Right side - Form */}
            <div className="lg:w-96">
              {subscribed ? (
                <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-green-700 font-bold text-center animate-in fade-in shadow-sm">
                  Abonelik başarılı! Hoşgeldiniz 🎉
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Mail adresini gir..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-12 text-sm bg-white border-gray-300 rounded-lg px-5"
                  />
                  <Button
                    type="submit"
                    className="h-12 px-6 text-sm font-semibold whitespace-nowrap rounded-lg bg-red-600 hover:bg-red-700"
                  >
                    Abone Ol
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

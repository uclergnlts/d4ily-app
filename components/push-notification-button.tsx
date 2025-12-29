'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Check, Loader2 } from 'lucide-react'

type SubscriptionStatus = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed'

export function PushNotificationButton() {
    const [status, setStatus] = useState<SubscriptionStatus>('loading')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        checkSubscriptionStatus()
    }, [])

    async function checkSubscriptionStatus() {
        // Check if push notifications are supported
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setStatus('unsupported')
            return
        }

        // Check permission status
        const permission = Notification.permission
        if (permission === 'denied') {
            setStatus('denied')
            return
        }

        // Check if already subscribed
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            setStatus(subscription ? 'subscribed' : 'unsubscribed')
        } catch (error) {
            console.error('Error checking subscription:', error)
            setStatus('unsubscribed')
        }
    }

    async function subscribe() {
        setIsLoading(true)
        try {
            // Request permission
            const permission = await Notification.requestPermission()
            if (permission !== 'granted') {
                setStatus('denied')
                setIsLoading(false)
                return
            }

            // Get service worker registration
            const registration = await navigator.serviceWorker.ready

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
                ),
            })

            // Send subscription to server
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription),
            })

            setStatus('subscribed')
        } catch (error) {
            console.error('Failed to subscribe:', error)
            // If VAPID key is missing, show as unsupported
            if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
                setStatus('unsupported')
            }
        }
        setIsLoading(false)
    }

    async function unsubscribe() {
        setIsLoading(true)
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()

            if (subscription) {
                // Unsubscribe from push
                await subscription.unsubscribe()

                // Remove subscription from server
                await fetch('/api/push/unsubscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                })
            }

            setStatus('unsubscribed')
        } catch (error) {
            console.error('Failed to unsubscribe:', error)
        }
        setIsLoading(false)
    }

    // Convert VAPID key
    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }

    // Don't render anything if unsupported
    if (status === 'unsupported') {
        return null
    }

    // Denied state
    if (status === 'denied') {
        return (
            <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg cursor-not-allowed"
                title="Bildirimler tarayıcı ayarlarından engellenmiş"
            >
                <BellOff className="h-4 w-4" />
                <span className="hidden sm:inline">Bildirimler Engelli</span>
            </button>
        )
    }

    // Loading state
    if (status === 'loading' || isLoading) {
        return (
            <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg"
            >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Yükleniyor...</span>
            </button>
        )
    }

    // Subscribed state
    if (status === 'subscribed') {
        return (
            <button
                onClick={unsubscribe}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                title="Bildirimleri kapat"
            >
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Bildirimler Açık</span>
            </button>
        )
    }

    // Unsubscribed state - main CTA
    return (
        <button
            onClick={subscribe}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            title="Yeni özet geldiğinde bildirim al"
        >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Bildirimleri Aç</span>
        </button>
    )
}

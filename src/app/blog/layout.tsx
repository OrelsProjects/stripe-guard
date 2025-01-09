import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "Stripe Webhook Protection Blog | StripeProtect",
    template: "%s | StripeProtect Blog"
  },
  description: "Expert insights on Stripe webhook management, monitoring, and protection. Learn about webhook security, failure prevention, and best practices for your Stripe integration.",
  keywords: ["stripe webhooks", "webhook monitoring", "stripe integration", "webhook security", "stripe payments", "webhook protection", "stripe webhook guide"],
  authors: [{ name: "Orel Zilberman", url: "https://linkedin.com/in/orelzilberman" }],
  creator: "StripeProtect",
  publisher: "StripeProtect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stripeprotect.com'),
  alternates: {
    canonical: '/blog',
    languages: {
      'en-US': '/blog',
    },
  },
  openGraph: {
    title: "Stripe Webhook Protection Blog | StripeProtect",
    description: "Expert insights on Stripe webhook management, monitoring, and protection. Learn about webhook security, failure prevention, and best practices.",
    url: 'https://stripeprotect.com/blog',
    siteName: 'StripeProtect',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'StripeProtect Blog'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stripe Webhook Protection Blog | StripeProtect',
    description: 'Expert insights on Stripe webhook management, monitoring, and protection.',
    creator: '@orelzilberman',
    images: ['/og-blog.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    other: {
      'facebook-domain-verification': 'your-facebook-domain-verification'
    }
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

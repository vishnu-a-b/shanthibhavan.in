'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { CheckCircle, Download, Home, Heart, Loader2 } from "lucide-react";
import { Suspense, useState } from 'react';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const receiptNumber = searchParams.get('receiptNumber');

  const [downloading, setDownloading] = useState(false);

  const downloadReceipt = async () => {
    if (!receiptNumber) return;
    setDownloading(true);
    try {
      const res = await fetch(`${API_URL}/api/donation/receipt/download/${receiptNumber}`);
      if (!res.ok) {
        alert('Receipt not ready yet. Please try again shortly.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${receiptNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="bg-gradient-to-r from-green-600 to-green-500 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-4">Thank You!</h1>
        <p className="text-white/90 max-w-2xl mx-auto px-4">
          Your donation has been received successfully.
        </p>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6 mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600">Payment Successful</CardTitle>
              <CardDescription>
                Your generosity helps us provide free healthcare to those in need.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Transaction Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                {orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono font-medium">{orderId}</span>
                  </div>
                )}
                {receiptNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipt Number:</span>
                    <span className="font-mono font-medium">{receiptNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">What&apos;s Next?</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc ml-4">
                  <li>A confirmation email with your receipt has been sent to your email address.</li>
                  <li>If you provided your PAN, your 80G receipt is attached to that email.</li>
                  <li>You can also download your receipt directly using the button below.</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {receiptNumber && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={downloadReceipt}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {downloading ? 'Downloading...' : 'Download Receipt'}
                  </Button>
                )}
                <Button asChild className="flex-1">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Return Home
                  </Link>
                </Button>
              </div>

              {/* Donate Again */}
              <div className="text-center pt-4 border-t">
                <p className="text-gray-600 mb-4">Want to make another donation?</p>
                <Button asChild variant="outline">
                  <Link href="/donate">
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Again
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-white items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

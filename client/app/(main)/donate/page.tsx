'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Link from "next/link";
import { Heart, Users, Target, Loader2, ArrowRight, Calendar, IndianRupee, ExternalLink, X } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface Campaign {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  image?: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  startDate: string;
  endDate?: string;
}

interface PendingPayment {
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  donationType: string;
  panNumber?: string;
  address?: string;
  notes?: string;
  campaignId?: string;
  campaignTitle?: string;
  isAnonymous?: boolean;
}

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;

const FELLOWSHIP_URL = 'https://fellowship.shanthibhavan.in/fellowship-packages';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function DonateContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const campaignSlug = searchParams.get('campaign');

  const [activeTab, setActiveTab] = useState(tabParam || 'general');
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Phone states (separate for PhoneInput component)
  const [generalPhone, setGeneralPhone] = useState<string | undefined>();
  const [campaignPhone, setCampaignPhone] = useState<string | undefined>();

  // Validation errors
  const [generalPanError, setGeneralPanError] = useState('');
  const [campaignPanError, setCampaignPanError] = useState('');

  // Confirmation modal
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);

  // Form states
  const [generalForm, setGeneralForm] = useState({
    donorName: '',
    email: '',
    amount: '',
    panNumber: '',
    address: '',
    notes: '',
    isAnonymous: false
  });

  const [campaignForm, setCampaignForm] = useState({
    donorName: '',
    email: '',
    amount: '',
    panNumber: '',
    address: '',
    isAnonymous: false
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Update active tab when URL param changes
  useEffect(() => {
    if (tabParam && ['general', 'fellowship', 'campaign'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Pre-select campaign from URL slug
  useEffect(() => {
    if (campaignSlug && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.slug === campaignSlug);
      if (campaign) {
        setSelectedCampaign(campaign);
        setActiveTab('campaign');
      }
    }
  }, [campaignSlug, campaigns]);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaign/active`);
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const openRazorpayCheckout = async (options: PendingPayment) => {
    setLoading(true);
    try {
      // Create order on backend
      const res = await fetch(`${API_URL}/api/donation/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.error || 'Failed to initiate payment');
        setLoading(false);
        return;
      }

      // Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      const rzpOptions = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: 'INR',
        name: 'Shanthibhavan Hospital',
        description: options.donationType === 'campaign'
          ? `Campaign Donation`
          : 'General Donation',
        order_id: data.razorpayOrderId,
        prefill: {
          name: options.donorName,
          email: options.email,
          contact: options.phone || '',
        },
        theme: { color: '#0e5c6b' },
        handler: async (response: any) => {
          // Verify payment on backend
          try {
            const verifyRes = await fetch(`${API_URL}/api/donation/verify-razorpay`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                donationId: data.donationId,
              })
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              window.location.href = `/donate/success?orderId=${verifyData.orderId}&receiptNumber=${verifyData.receiptNumber}`;
            } else {
              alert('Payment verification failed. Please contact support.');
              setLoading(false);
            }
          } catch {
            alert('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.on('payment.failed', async (response: any) => {
        // Notify backend of failure
        fetch(`${API_URL}/api/donation/razorpay-failure`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ donationId: data.donationId, error: response.error })
        }).catch(() => {});
        window.location.href = `/donate/failed?message=${encodeURIComponent(response.error?.description || 'Payment failed')}`;
      });

      rzp.open();
      setLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment');
      setLoading(false);
    }
  };

  const handleGeneralDonation = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralPanError('');

    if (!generalPhone) {
      alert('Phone number is required to send your receipt via WhatsApp.');
      return;
    }

    if (generalForm.panNumber && !PAN_REGEX.test(generalForm.panNumber)) {
      setGeneralPanError('Invalid PAN format. Expected: ABCDE1234F');
      return;
    }

    setPendingPayment({
      donorName: generalForm.donorName,
      email: generalForm.email,
      phone: generalPhone,
      amount: parseFloat(generalForm.amount),
      donationType: 'general',
      panNumber: generalForm.panNumber || undefined,
      address: generalForm.address || undefined,
      notes: generalForm.notes || undefined,
      isAnonymous: generalForm.isAnonymous,
    });
  };

  const handleCampaignDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) {
      alert('Please select a campaign');
      return;
    }
    setCampaignPanError('');

    if (!campaignPhone) {
      alert('Phone number is required to send your receipt via WhatsApp.');
      return;
    }

    if (campaignForm.panNumber && !PAN_REGEX.test(campaignForm.panNumber)) {
      setCampaignPanError('Invalid PAN format. Expected: ABCDE1234F');
      return;
    }

    setPendingPayment({
      donorName: campaignForm.donorName,
      email: campaignForm.email,
      phone: campaignPhone,
      amount: parseFloat(campaignForm.amount),
      donationType: 'campaign',
      panNumber: campaignForm.panNumber || undefined,
      address: campaignForm.address || undefined,
      campaignId: selectedCampaign._id,
      campaignTitle: selectedCampaign.title,
      isAnonymous: campaignForm.isAnonymous,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-140 md:min-h-160 flex flex-col justify-end overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/image/hero.jpeg')" }}
        />

        {/* Light dark overlay — keeps photo visible */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Strong gradient only at bottom so text is readable */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content — anchored to bottom */}
        <div className="relative z-10 px-6 pb-14 md:pb-20 max-w-4xl mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-white/30 backdrop-blur-sm text-white/85 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <Heart className="w-3 h-3 fill-white/50" />
            Shanthibhavan Palliative Hospital
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-white leading-tight mb-4 drop-shadow-md">
            Be a Hand That Holds<br className="hidden sm:block" /> in the Darkest Hour
          </h1>

          {/* Subtext */}
          <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
            At Shanthibhavan, every patient receives dignity, comfort, and compassionate palliative care —
            free of cost, always. Your generosity is the only reason we can keep our doors open.
          </p>

          {/* Stat cards */}
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'No Bills', label: 'Ever — all care is free' },
              { value: '100%', label: 'Donation funded' },
              { value: '80G', label: 'Tax exemption' },
            ].map(({ value, label }) => (
              <div
                key={value}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-3 text-white"
              >
                <div className="text-lg font-bold leading-none">{value}</div>
                <div className="text-white/65 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          {/* Introduction */}
          <div className="mb-8 md:mb-12 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mx-auto">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Where Every Rupee Becomes Comfort</h2>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg max-w-3xl mx-auto">
              At Shanthibhavan, we believe no one should face their final journey alone or burdened by medical bills.
              Our dedicated team provides specialised palliative care, pain management, emotional support, and free
              accommodation — sustained entirely by the kindness of people like you.
            </p>
          </div>

          {/* Donation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Modern tab selector */}
            <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1.5 bg-gray-100 rounded-2xl gap-1">
              <TabsTrigger
                value="general"
                className="flex flex-col sm:flex-row items-center gap-1.5 py-3 px-4 rounded-xl text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <Heart className="w-4 h-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger
                value="fellowship"
                className="flex flex-col sm:flex-row items-center gap-1.5 py-3 px-4 rounded-xl text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <Users className="w-4 h-4" />
                <span>Fellowship</span>
              </TabsTrigger>
              <TabsTrigger
                value="campaign"
                className="flex flex-col sm:flex-row items-center gap-1.5 py-3 px-4 rounded-xl text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <Target className="w-4 h-4" />
                <span>Campaign</span>
              </TabsTrigger>
            </TabsList>

            {/* General Donation */}
            <TabsContent value="general">
              <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Card header accent */}
                <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">One-Time Donation</h3>
                      <p className="text-white/75 text-sm">Every rupee helps provide free care to those in need.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <form onSubmit={handleGeneralDonation} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                        <Input
                          required
                          value={generalForm.donorName}
                          onChange={(e) => setGeneralForm({ ...generalForm, donorName: e.target.value })}
                          placeholder="Enter your full name"
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                        <Input
                          type="email"
                          required
                          value={generalForm.email}
                          onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                          placeholder="your@email.com"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-400 font-normal ml-1">(for WhatsApp receipt)</span>
                      </label>
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={generalPhone}
                        onChange={setGeneralPhone}
                        className="phone-input-custom"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">PAN Number <span className="text-xs text-gray-400">(for 80G receipt)</span></label>
                        <Input
                          value={generalForm.panNumber}
                          onChange={(e) => {
                            setGeneralPanError('');
                            setGeneralForm({ ...generalForm, panNumber: e.target.value.toUpperCase() });
                          }}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          className="rounded-lg"
                        />
                        {generalPanError && <p className="text-red-500 text-xs mt-1">{generalPanError}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                        <Input
                          value={generalForm.address}
                          onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
                          placeholder="Your complete address"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (INR) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          required
                          min="1"
                          value={generalForm.amount}
                          onChange={(e) => setGeneralForm({ ...generalForm, amount: e.target.value })}
                          placeholder="Enter amount"
                          className="pl-9 rounded-lg"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {[500, 1000, 2500, 5000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setGeneralForm({ ...generalForm, amount: amt.toString() })}
                            className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
                              generalForm.amount === amt.toString()
                                ? 'bg-primary text-white border-primary'
                                : 'border-gray-200 hover:border-primary hover:text-primary'
                            }`}
                          >
                            {formatCurrency(amt)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes <span className="text-xs text-gray-400">(optional)</span></label>
                      <Input
                        value={generalForm.notes}
                        onChange={(e) => setGeneralForm({ ...generalForm, notes: e.target.value })}
                        placeholder="Any message or dedication"
                        className="rounded-lg"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={generalForm.isAnonymous}
                        onChange={(e) => setGeneralForm({ ...generalForm, isAnonymous: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary"
                      />
                      Make my donation anonymous (your name won&apos;t appear in public records)
                    </label>
                    <Button type="submit" disabled={loading} className="w-full rounded-xl" size="lg">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Donate Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>

            {/* Fellowship — external portal with confirmation UI */}
            <TabsContent value="fellowship">
              <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Fellowship Program</h3>
                      <p className="text-white/75 text-sm">Monthly giving for sustained, long-term impact.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: Calendar, text: 'Predictable support helps us plan long-term programs' },
                      { icon: Heart, text: 'Monthly updates on how your contribution helps' },
                      { icon: Users, text: 'Special recognition in our annual report' },
                      { icon: ExternalLink, text: '80G tax exemption certificate for each payment' },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm text-gray-600 leading-snug">{text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-gray-600 text-sm">
                      Visit our dedicated fellowship portal to choose a package and complete your subscription.
                    </p>
                    <Button asChild size="lg" className="w-full sm:w-auto rounded-xl">
                      <a href={FELLOWSHIP_URL} target="_blank" rel="noopener noreferrer">
                        <Users className="w-4 h-4 mr-2" />
                        Join Fellowship Program
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    <p className="text-xs text-gray-400">You will be redirected to our secure fellowship portal.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Campaign Donation */}
            <TabsContent value="campaign">
              <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Donation Campaigns</h3>
                      <p className="text-white/75 text-sm">Support targeted initiatives that need your help.</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  {loadingCampaigns ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-gray-500">Loading campaigns...</p>
                    </div>
                  ) : campaigns.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="font-medium text-gray-500">No active campaigns at the moment</p>
                      <p className="text-sm mt-1">Please check back later or make a general donation.</p>
                    </div>
                  ) : (
                    <>
                      {/* Campaign Selection */}
                      <div className="space-y-3 mb-6">
                        <label className="block text-sm font-medium text-gray-700">Select a Campaign <span className="text-red-500">*</span></label>
                        <div className="grid gap-3">
                          {campaigns.map((campaign) => (
                            <div
                              key={campaign._id}
                              onClick={() => setSelectedCampaign(campaign)}
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${
                                selectedCampaign?._id === campaign._id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-800">{campaign.title}</h4>
                                <span className="text-xs bg-green-100 text-green-700 font-medium px-2.5 py-0.5 rounded-full">Active</span>
                              </div>
                              {campaign.shortDescription && (
                                <p className="text-sm text-gray-500 mb-3">{campaign.shortDescription}</p>
                              )}
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>{formatCurrency(campaign.raisedAmount)} raised</span>
                                  <span className="font-medium text-gray-700">{formatCurrency(campaign.goalAmount)} goal</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-primary h-1.5 rounded-full transition-all"
                                    style={{ width: `${getProgressPercentage(campaign.raisedAmount, campaign.goalAmount)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>{getProgressPercentage(campaign.raisedAmount, campaign.goalAmount)}% funded</span>
                                  <span>{campaign.donorCount} donors</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Donation Form */}
                      {selectedCampaign && (
                        <form onSubmit={handleCampaignDonation} className="space-y-5 border-t border-gray-100 pt-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                              <Input
                                required
                                value={campaignForm.donorName}
                                onChange={(e) => setCampaignForm({ ...campaignForm, donorName: e.target.value })}
                                placeholder="Enter your full name"
                                className="rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                              <Input
                                type="email"
                                required
                                value={campaignForm.email}
                                onChange={(e) => setCampaignForm({ ...campaignForm, email: e.target.value })}
                                placeholder="your@email.com"
                                className="rounded-lg"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Phone <span className="text-red-500">*</span>
                              <span className="text-xs text-gray-400 font-normal ml-1">(for WhatsApp receipt)</span>
                            </label>
                            <PhoneInput
                              international
                              defaultCountry="IN"
                              value={campaignPhone}
                              onChange={setCampaignPhone}
                              className="phone-input-custom"
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">PAN Number <span className="text-xs text-gray-400">(for 80G receipt)</span></label>
                              <Input
                                value={campaignForm.panNumber}
                                onChange={(e) => {
                                  setCampaignPanError('');
                                  setCampaignForm({ ...campaignForm, panNumber: e.target.value.toUpperCase() });
                                }}
                                placeholder="ABCDE1234F"
                                maxLength={10}
                                className="rounded-lg"
                              />
                              {campaignPanError && <p className="text-red-500 text-xs mt-1">{campaignPanError}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                              <Input
                                value={campaignForm.address}
                                onChange={(e) => setCampaignForm({ ...campaignForm, address: e.target.value })}
                                placeholder="Your complete address"
                                className="rounded-lg"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (INR) <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="number"
                                required
                                min="1"
                                value={campaignForm.amount}
                                onChange={(e) => setCampaignForm({ ...campaignForm, amount: e.target.value })}
                                placeholder="Enter amount"
                                className="pl-9 rounded-lg"
                              />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2.5">
                              {[500, 1000, 2500, 5000].map((amt) => (
                                <button
                                  key={amt}
                                  type="button"
                                  onClick={() => setCampaignForm({ ...campaignForm, amount: amt.toString() })}
                                  className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
                                    campaignForm.amount === amt.toString()
                                      ? 'bg-primary text-white border-primary'
                                      : 'border-gray-200 hover:border-primary hover:text-primary'
                                  }`}
                                >
                                  {formatCurrency(amt)}
                                </button>
                              ))}
                            </div>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
                            <input
                              type="checkbox"
                              checked={campaignForm.isAnonymous}
                              onChange={(e) => setCampaignForm({ ...campaignForm, isAnonymous: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 text-primary"
                            />
                            Make my donation anonymous
                          </label>
                          <Button type="submit" disabled={loading} className="w-full rounded-xl" size="lg">
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                Donate to {selectedCampaign.title}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Benevity CTA */}
          <div className="mt-12 relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-secondary/10 to-primary/5 border border-primary/15 p-8 md:p-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="shrink-0 flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Does Your Company Match Donations?</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Shanthibhavan is registered on <span className="font-semibold text-primary">Benevity</span> — the corporate giving platform.
                  If your employer offers donation matching or a workplace giving program, your contribution could go twice as far.
                </p>
              </div>
              <div className="shrink-0">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-md">
                  <Link href="/benevity" className="flex items-center gap-2">
                    Learn About Benevity
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Confirmation Modal */}
      {pendingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Confirm Your Donation</h2>
              <button
                onClick={() => setPendingPayment(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-5">Please review the details before proceeding to payment.</p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{pendingPayment.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{pendingPayment.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900 capitalize">
                  {pendingPayment.campaignTitle || pendingPayment.donationType}
                </span>
              </div>
              {pendingPayment.panNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">PAN</span>
                  <span className="font-mono font-medium text-gray-900">{pendingPayment.panNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-1">
                <span className="text-gray-700 font-semibold">Amount</span>
                <span className="text-2xl font-bold text-primary">₹{pendingPayment.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPendingPayment(null)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const opts = pendingPayment;
                  setPendingPayment(null);
                  await openRazorpayCheckout(opts);
                }}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-white items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading donation options...</p>
      </div>
    }>
      <DonateContent />
    </Suspense>
  );
}

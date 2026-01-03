import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with core ATS-friendly generation.',
    features: [
      '1 Master Profile',
      '2 tailored resumes / month',
      'PDF export only'
    ]
  },
  {
    name: 'Pro',
    price: '$24/mo',
    description: 'Unlimited tailored resumes with advanced ATS insights.',
    features: [
      'Unlimited tailored resumes',
      'PDF + DOCX exports',
      'Bulk ZIP exports',
      'Advanced ATS checks'
    ]
  }
];

export default function PricingPage() {
  return (
    <div>
      <SiteHeader />
      <main className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold">Simple, transparent pricing</h1>
          <p className="mt-3 text-muted-foreground">
            Upgrade when you are ready to accelerate your job search.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {tiers.map((tier) => (
            <Card key={tier.name}>
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{tier.price}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/auth">
                    <Button>{tier.name === 'Free' ? 'Start free' : 'Go Pro'}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

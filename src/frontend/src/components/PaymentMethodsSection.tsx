import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useUpdatePaymentMethods } from '../hooks/useQueries';
import type { PaymentMethodsConfig } from '../backend';
import { Save, Eye, EyeOff, CreditCard } from 'lucide-react';

interface PaymentMethodsSectionProps {
  paymentMethods?: PaymentMethodsConfig;
}

export default function PaymentMethodsSection({ paymentMethods }: PaymentMethodsSectionProps) {
  const [enableStripe, setEnableStripe] = useState(false);
  const [stripeApiKey, setStripeApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [acceptedCardTypes, setAcceptedCardTypes] = useState<string[]>([]);

  const updatePaymentMethods = useUpdatePaymentMethods();

  const cardTypes = ['Visa', 'MasterCard', 'Amex', 'Discover'];

  useEffect(() => {
    if (paymentMethods) {
      setEnableStripe(paymentMethods.enableStripe);
      setStripeApiKey(paymentMethods.stripeApiKey || '');
      setAcceptedCardTypes(paymentMethods.acceptedCardTypes);
    }
  }, [paymentMethods]);

  const handleCardTypeToggle = (cardType: string) => {
    setAcceptedCardTypes((prev) =>
      prev.includes(cardType)
        ? prev.filter((type) => type !== cardType)
        : [...prev, cardType]
    );
  };

  const handleSave = async () => {
    try {
      await updatePaymentMethods.mutateAsync({
        enableStripe,
        stripeApiKey: stripeApiKey || undefined,
        acceptedCardTypes,
      });
      toast.success('Payment methods updated successfully');
    } catch (error) {
      toast.error('Failed to update payment methods');
      console.error(error);
    }
  };

  return (
    <Card className="bg-noirBlack border-softPink/20">
      <CardHeader>
        <CardTitle className="text-white">Payment Methods</CardTitle>
        <CardDescription className="text-gray-400">
          Configure payment gateway settings and accepted payment methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-noirBlack border border-softPink/20 rounded-lg">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-softPink" />
            <div>
              <p className="text-white font-semibold">Stripe Payment Gateway</p>
              <p className="text-sm text-gray-400">Accept credit and debit card payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={enableStripe ? 'default' : 'secondary'} className={enableStripe ? 'bg-green-500' : 'bg-gray-500'}>
              {enableStripe ? 'Active' : 'Inactive'}
            </Badge>
            <Switch
              checked={enableStripe}
              onCheckedChange={setEnableStripe}
            />
          </div>
        </div>

        {enableStripe && (
          <>
            <div className="space-y-2">
              <Label htmlFor="stripeApiKey" className="text-white">Stripe Secret Key</Label>
              <div className="relative">
                <Input
                  id="stripeApiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={stripeApiKey}
                  onChange={(e) => setStripeApiKey(e.target.value)}
                  placeholder="sk_test_..."
                  className="bg-noirBlack border-softPink/20 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Accepted Card Types</Label>
              <div className="grid grid-cols-2 gap-3">
                {cardTypes.map((cardType) => (
                  <div key={cardType} className="flex items-center space-x-2 p-3 bg-noirBlack border border-softPink/20 rounded-lg">
                    <Checkbox
                      id={cardType}
                      checked={acceptedCardTypes.includes(cardType)}
                      onCheckedChange={() => handleCardTypeToggle(cardType)}
                    />
                    <label
                      htmlFor={cardType}
                      className="text-white text-sm font-medium cursor-pointer"
                    >
                      {cardType}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Button
          onClick={handleSave}
          disabled={updatePaymentMethods.isPending}
          className="bg-softPink hover:bg-softPink/80 text-noirBlack font-semibold"
        >
          <Save className="w-4 h-4 mr-2" />
          {updatePaymentMethods.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}

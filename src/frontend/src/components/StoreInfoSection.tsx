import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUpdateStoreInfo } from '../hooks/useQueries';
import type { StoreInfo } from '../backend';
import { Save } from 'lucide-react';

interface StoreInfoSectionProps {
  storeInfo?: StoreInfo;
}

export default function StoreInfoSection({ storeInfo }: StoreInfoSectionProps) {
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const updateStoreInfo = useUpdateStoreInfo();

  useEffect(() => {
    if (storeInfo) {
      setName(storeInfo.name);
      setContactEmail(storeInfo.contactEmail);
      setPhoneNumber(storeInfo.phoneNumber);
      setAddress(storeInfo.address);
    }
  }, [storeInfo]);

  const handleSave = async () => {
    try {
      await updateStoreInfo.mutateAsync({
        name,
        contactEmail,
        phoneNumber,
        address,
      });
      toast.success('Store information updated successfully');
    } catch (error) {
      toast.error('Failed to update store information');
      console.error(error);
    }
  };

  return (
    <Card className="bg-noirBlack border-softPink/20">
      <CardHeader>
        <CardTitle className="text-white">Store Information</CardTitle>
        <CardDescription className="text-gray-400">
          Update your store's basic information and contact details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storeName" className="text-white">Store Name</Label>
          <Input
            id="storeName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Noir Penguin Fashion"
            className="bg-noirBlack border-softPink/20 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="text-white">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="contact@noirpenguin.com"
            className="bg-noirBlack border-softPink/20 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="bg-noirBlack border-softPink/20 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-white">Business Address</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Fashion Street, New York, NY 10001"
            rows={3}
            className="bg-noirBlack border-softPink/20 text-white"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={updateStoreInfo.isPending}
          className="bg-softPink hover:bg-softPink/80 text-noirBlack font-semibold"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateStoreInfo.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetStoreSettings, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Store, CreditCard, Truck, Receipt, Users, Image, Palette } from 'lucide-react';
import StoreInfoSection from '../components/StoreInfoSection';
import PaymentMethodsSection from '../components/PaymentMethodsSection';
import ShippingRatesSection from '../components/ShippingRatesSection';
import TaxSettingsSection from '../components/TaxSettingsSection';
import AdminRolesSection from '../components/AdminRolesSection';
import LogoUploadSection from '../components/LogoUploadSection';
import ThemeColorsSection from '../components/ThemeColorsSection';

export default function AdminSettingsPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: storeSettings, isLoading: settingsLoading } = useGetStoreSettings();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noirBlack">
        <Card className="bg-noirBlack border-softPink/20">
          <CardContent className="p-8">
            <p className="text-white text-center">Please log in to access admin settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdminLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noirBlack">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noirBlack">
        <Card className="bg-noirBlack border-softPink/20">
          <CardContent className="p-8">
            <p className="text-white text-center">Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noirBlack py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-softPink" />
            <h1 className="font-playfair text-3xl font-bold text-white">Store Settings</h1>
          </div>
          <p className="text-gray-400">Manage your store configuration and preferences</p>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="bg-noirBlack border border-softPink/20 p-1">
            <TabsTrigger value="store" className="data-[state=active]:bg-softPink/20 data-[state=active]:text-softPink">
              <Store className="w-4 h-4 mr-2" />
              Store Info
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-softPink/20 data-[state=active]:text-softPink">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="shipping" className="data-[state=active]:bg-softPink/20 data-[state=active]:text-softPink">
              <Truck className="w-4 h-4 mr-2" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="tax" className="data-[state=active]:bg-softPink/20 data-[state=active]:text-softPink">
              <Receipt className="w-4 h-4 mr-2" />
              Tax
            </TabsTrigger>
            <TabsTrigger value="admins" className="data-[state=active]:bg-softPink/20 data-[state=active]:text-softPink">
              <Users className="w-4 h-4 mr-2" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="logo" className="data-[state=active]:bg-softPink/20 data-[state=active]:text-softPink">
              <Image className="w-4 h-4 mr-2" />
              Logo
            </TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-softPink/20 data-[state=active]:text-softPink">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <StoreInfoSection storeInfo={storeSettings?.storeInfo} />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentMethodsSection paymentMethods={storeSettings?.paymentMethods} />
          </TabsContent>

          <TabsContent value="shipping">
            <ShippingRatesSection shippingRates={storeSettings?.shippingRates} />
          </TabsContent>

          <TabsContent value="tax">
            <TaxSettingsSection taxSettings={storeSettings?.taxSettings} />
          </TabsContent>

          <TabsContent value="admins">
            <AdminRolesSection adminRoles={storeSettings?.adminRoles || []} />
          </TabsContent>

          <TabsContent value="logo">
            <LogoUploadSection logo={storeSettings?.logo} />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeColorsSection themeColors={storeSettings?.themeColors} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

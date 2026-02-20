import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useUpdateTaxSettings } from '../hooks/useQueries';
import type { TaxSettings } from '../backend';
import { Save, X } from 'lucide-react';

interface TaxSettingsSectionProps {
  taxSettings?: TaxSettings;
}

export default function TaxSettingsSection({ taxSettings }: TaxSettingsSectionProps) {
  const [salesTaxPercentage, setSalesTaxPercentage] = useState('0');
  const [taxExemptRegions, setTaxExemptRegions] = useState<string[]>([]);
  const [newRegion, setNewRegion] = useState('');

  const updateTaxSettings = useUpdateTaxSettings();

  useEffect(() => {
    if (taxSettings) {
      setSalesTaxPercentage(taxSettings.salesTaxPercentage.toString());
      setTaxExemptRegions(taxSettings.taxExemptRegions);
    }
  }, [taxSettings]);

  const handleAddRegion = () => {
    if (newRegion && !taxExemptRegions.includes(newRegion)) {
      setTaxExemptRegions([...taxExemptRegions, newRegion]);
      setNewRegion('');
    }
  };

  const handleRemoveRegion = (region: string) => {
    setTaxExemptRegions(taxExemptRegions.filter((r) => r !== region));
  };

  const handleSave = async () => {
    try {
      await updateTaxSettings.mutateAsync({
        salesTaxPercentage: parseFloat(salesTaxPercentage),
        taxExemptRegions,
      });
      toast.success('Tax settings updated successfully');
    } catch (error) {
      toast.error('Failed to update tax settings');
      console.error(error);
    }
  };

  return (
    <Card className="bg-noirBlack border-softPink/20">
      <CardHeader>
        <CardTitle className="text-white">Tax Settings</CardTitle>
        <CardDescription className="text-gray-400">
          Configure sales tax percentage and tax-exempt regions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="salesTax" className="text-white">Sales Tax Percentage (%)</Label>
          <Input
            id="salesTax"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={salesTaxPercentage}
            onChange={(e) => setSalesTaxPercentage(e.target.value)}
            placeholder="8.5"
            className="bg-noirBlack border-softPink/20 text-white"
          />
          <p className="text-xs text-gray-400">This tax rate will be applied to all orders unless the region is tax-exempt</p>
        </div>

        <div className="space-y-3">
          <Label className="text-white">Tax-Exempt Regions</Label>
          
          <div className="flex gap-2">
            <Input
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRegion()}
              placeholder="Enter region name (e.g., Oregon, Delaware)"
              className="bg-noirBlack border-softPink/20 text-white flex-1"
            />
            <Button
              onClick={handleAddRegion}
              variant="outline"
              className="border-softPink/20 text-softPink hover:bg-softPink/20"
            >
              Add
            </Button>
          </div>

          {taxExemptRegions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {taxExemptRegions.map((region) => (
                <Badge
                  key={region}
                  variant="secondary"
                  className="bg-softPink/20 text-white border-softPink/40 pr-1"
                >
                  {region}
                  <button
                    onClick={() => handleRemoveRegion(region)}
                    className="ml-2 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={updateTaxSettings.isPending}
          className="bg-softPink hover:bg-softPink/80 text-noirBlack font-semibold"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateTaxSettings.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}

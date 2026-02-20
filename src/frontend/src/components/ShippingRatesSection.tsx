import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useUpdateShippingRates } from '../hooks/useQueries';
import type { ShippingRates } from '../backend';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ShippingRatesSectionProps {
  shippingRates?: ShippingRates;
}

export default function ShippingRatesSection({ shippingRates }: ShippingRatesSectionProps) {
  const [flatRate, setFlatRate] = useState('0');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('0');
  const [regionRates, setRegionRates] = useState<Array<{ region: string; cost: string }>>([]);
  const [newRegion, setNewRegion] = useState('');
  const [newCost, setNewCost] = useState('');

  const updateShippingRates = useUpdateShippingRates();

  useEffect(() => {
    if (shippingRates) {
      setFlatRate((Number(shippingRates.flatRate) / 100).toFixed(2));
      setFreeShippingThreshold((Number(shippingRates.freeShippingThreshold) / 100).toFixed(2));
      setRegionRates(
        shippingRates.regionShippingCosts.map(([region, cost]) => ({
          region,
          cost: (Number(cost) / 100).toFixed(2),
        }))
      );
    }
  }, [shippingRates]);

  const handleAddRegion = () => {
    if (newRegion && newCost) {
      setRegionRates([...regionRates, { region: newRegion, cost: newCost }]);
      setNewRegion('');
      setNewCost('');
    }
  };

  const handleRemoveRegion = (index: number) => {
    setRegionRates(regionRates.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateShippingRates.mutateAsync({
        flatRate: BigInt(Math.round(parseFloat(flatRate) * 100)),
        freeShippingThreshold: BigInt(Math.round(parseFloat(freeShippingThreshold) * 100)),
        regionShippingCosts: regionRates.map(({ region, cost }) => [
          region,
          BigInt(Math.round(parseFloat(cost) * 100)),
        ]),
      });
      toast.success('Shipping rates updated successfully');
    } catch (error) {
      toast.error('Failed to update shipping rates');
      console.error(error);
    }
  };

  return (
    <Card className="bg-noirBlack border-softPink/20">
      <CardHeader>
        <CardTitle className="text-white">Shipping Rates</CardTitle>
        <CardDescription className="text-gray-400">
          Configure shipping costs and free shipping thresholds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="flatRate" className="text-white">Flat Rate Shipping ($)</Label>
            <Input
              id="flatRate"
              type="number"
              step="0.01"
              value={flatRate}
              onChange={(e) => setFlatRate(e.target.value)}
              placeholder="9.99"
              className="bg-noirBlack border-softPink/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeShipping" className="text-white">Free Shipping Threshold ($)</Label>
            <Input
              id="freeShipping"
              type="number"
              step="0.01"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              placeholder="100.00"
              className="bg-noirBlack border-softPink/20 text-white"
            />
            <p className="text-xs text-gray-400">Orders above this amount ship free</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-white">Region-Specific Rates</Label>
          
          <div className="flex gap-2">
            <Input
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              placeholder="Region name (e.g., Europe)"
              className="bg-noirBlack border-softPink/20 text-white flex-1"
            />
            <Input
              type="number"
              step="0.01"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
              placeholder="Cost ($)"
              className="bg-noirBlack border-softPink/20 text-white w-32"
            />
            <Button
              onClick={handleAddRegion}
              variant="outline"
              className="border-softPink/20 text-softPink hover:bg-softPink/20"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {regionRates.length > 0 && (
            <div className="border border-softPink/20 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-softPink/20">
                    <TableHead className="text-white">Region</TableHead>
                    <TableHead className="text-white">Cost</TableHead>
                    <TableHead className="text-white w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionRates.map((rate, index) => (
                    <TableRow key={index} className="border-softPink/20">
                      <TableCell className="text-white">{rate.region}</TableCell>
                      <TableCell className="text-white">${rate.cost}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleRemoveRegion(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={updateShippingRates.isPending}
          className="bg-softPink hover:bg-softPink/80 text-noirBlack font-semibold"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateShippingRates.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}

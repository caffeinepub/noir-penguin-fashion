import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUpdateThemeColors } from '../hooks/useQueries';
import type { ThemeColors } from '../backend';
import { Save, RotateCcw } from 'lucide-react';

interface ThemeColorsSectionProps {
  themeColors?: ThemeColors;
}

const defaultColors: ThemeColors = {
  primary1: '#000000',
  primary2: '#FFC0CB',
  primary3: '#C0C0C0',
  secondary1: '#E6E6FA',
  secondary2: '#ADD8E6',
};

export default function ThemeColorsSection({ themeColors }: ThemeColorsSectionProps) {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  const updateThemeColors = useUpdateThemeColors();

  useEffect(() => {
    if (themeColors) {
      setColors(themeColors);
    }
  }, [themeColors]);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors({ ...colors, [key]: value });
  };

  const handleReset = () => {
    setColors(defaultColors);
  };

  const handleSave = async () => {
    try {
      await updateThemeColors.mutateAsync(colors);
      toast.success('Theme colors updated successfully');
    } catch (error) {
      toast.error('Failed to update theme colors');
      console.error(error);
    }
  };

  const colorLabels = {
    primary1: 'Matte Black',
    primary2: 'Soft Pink',
    primary3: 'Silver',
    secondary1: 'Lavender',
    secondary2: 'Icy Blue',
  };

  return (
    <Card className="bg-noirBlack border-softPink/20">
      <CardHeader>
        <CardTitle className="text-white">Theme Colors</CardTitle>
        <CardDescription className="text-gray-400">
          Customize your brand color palette
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(colors) as Array<keyof ThemeColors>).map((key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-white">
                {colorLabels[key]}
              </Label>
              <div className="flex gap-2">
                <div
                  className="w-12 h-10 rounded border border-softPink/20 shrink-0"
                  style={{ backgroundColor: colors[key] }}
                />
                <Input
                  id={key}
                  type="color"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="bg-noirBlack border-softPink/20 text-white h-10 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-400 font-mono">{colors[key]}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-noirBlack border border-softPink/20 rounded-lg">
          <p className="text-white text-sm font-medium mb-3">Color Preview</p>
          <div className="flex gap-2">
            {(Object.keys(colors) as Array<keyof ThemeColors>).map((key) => (
              <div
                key={key}
                className="flex-1 h-16 rounded"
                style={{ backgroundColor: colors[key] }}
                title={colorLabels[key]}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={updateThemeColors.isPending}
            className="bg-softPink hover:bg-softPink/80 text-noirBlack font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateThemeColors.isPending ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            className="border-softPink/20 text-softPink hover:bg-softPink/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

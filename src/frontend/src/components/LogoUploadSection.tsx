import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUpdateLogo } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface LogoUploadSectionProps {
  logo?: ExternalBlob;
}

export default function LogoUploadSection({ logo }: LogoUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateLogo = useUpdateLogo();

  const currentLogoUrl = logo?.getDirectURL() || '/assets/generated/penguin-logo.dim_200x200.png';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      toast.error('Please select a PNG, JPG, or SVG image');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      await updateLogo.mutateAsync(blob);
      toast.success('Logo uploaded successfully');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error(error);
    }
  };

  return (
    <Card className="bg-noirBlack border-softPink/20">
      <CardHeader>
        <CardTitle className="text-white">Store Logo</CardTitle>
        <CardDescription className="text-gray-400">
          Upload your store logo (PNG, JPG, or SVG, max 2MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-white text-sm font-medium">Current Logo</p>
            <div className="flex items-center justify-center p-8 bg-noirBlack border border-softPink/20 rounded-lg">
              <img
                src={currentLogoUrl}
                alt="Current logo"
                className="max-w-full max-h-40 object-contain"
              />
            </div>
          </div>

          {previewUrl && (
            <div className="space-y-3">
              <p className="text-white text-sm font-medium">New Logo Preview</p>
              <div className="flex items-center justify-center p-8 bg-noirBlack border border-softPink/20 rounded-lg">
                <img
                  src={previewUrl}
                  alt="New logo preview"
                  className="max-w-full max-h-40 object-contain"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-softPink/20 text-softPink hover:bg-softPink/20"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Select Image
            </Button>

            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={updateLogo.isPending}
                className="bg-softPink hover:bg-softPink/80 text-noirBlack font-semibold"
              >
                <Upload className="w-4 h-4 mr-2" />
                {updateLogo.isPending ? 'Uploading...' : 'Upload Logo'}
              </Button>
            )}
          </div>

          {selectedFile && (
            <p className="text-sm text-gray-400">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

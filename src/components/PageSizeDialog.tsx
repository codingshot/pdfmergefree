import { useState } from 'react';
import { Ruler, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { PageSizeSettings } from '@/types/pdf';

const PAGE_PRESETS = {
  'original': { name: 'Original (Keep)', width: 0, height: 0 },
  'a4': { name: 'A4 (210 × 297 mm)', width: 595.28, height: 841.89 },
  'letter': { name: 'US Letter (8.5 × 11 in)', width: 612, height: 792 },
  'legal': { name: 'US Legal (8.5 × 14 in)', width: 612, height: 1008 },
  'a3': { name: 'A3 (297 × 420 mm)', width: 841.89, height: 1190.55 },
  'a5': { name: 'A5 (148 × 210 mm)', width: 419.53, height: 595.28 },
  'tabloid': { name: 'Tabloid (11 × 17 in)', width: 792, height: 1224 },
  'custom': { name: 'Custom Size', width: 612, height: 792 },
};

interface PageSizeDialogProps {
  settings: PageSizeSettings;
  onSettingsChange: (settings: PageSizeSettings) => void;
}

export function PageSizeDialog({ settings, onSettingsChange }: PageSizeDialogProps) {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<PageSizeSettings>(settings);

  const handlePresetChange = (preset: string) => {
    const presetData = PAGE_PRESETS[preset as keyof typeof PAGE_PRESETS];
    setLocalSettings({
      ...localSettings,
      preset: preset as PageSizeSettings['preset'],
      width: presetData.width,
      height: presetData.height,
    });
  };

  const handleOrientationToggle = () => {
    setLocalSettings({
      ...localSettings,
      orientation: localSettings.orientation === 'portrait' ? 'landscape' : 'portrait',
      // Swap width and height
      width: localSettings.height,
      height: localSettings.width,
    });
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setOpen(false);
  };

  const handleReset = () => {
    const defaultSettings: PageSizeSettings = {
      preset: 'original',
      width: 0,
      height: 0,
      orientation: 'portrait',
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
    setOpen(false);
  };

  const isCustomized = settings.preset !== 'original';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isCustomized ? 'secondary' : 'ghost'}
          size="sm"
          title="Page Size & Orientation"
        >
          <Ruler className={`w-4 h-4 sm:mr-2 ${isCustomized ? 'text-primary' : ''}`} />
          <span className="hidden sm:inline">
            {isCustomized ? PAGE_PRESETS[settings.preset]?.name?.split(' ')[0] || 'Custom' : 'Page Size'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Page Size & Orientation
          </DialogTitle>
          <DialogDescription>
            Customize the page size and orientation of your merged PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Page Size Preset</Label>
            <Select value={localSettings.preset} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAGE_PRESETS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {localSettings.preset === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (pt)</Label>
                <Input
                  id="width"
                  type="number"
                  value={localSettings.width}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      width: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (pt)</Label>
                <Input
                  id="height"
                  type="number"
                  value={localSettings.height}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      height: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Orientation</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={localSettings.orientation === 'portrait' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setLocalSettings({ ...localSettings, orientation: 'portrait' })}
                disabled={localSettings.preset === 'original'}
              >
                <div className="w-4 h-6 border-2 border-current rounded-sm mr-2" />
                Portrait
              </Button>
              <Button
                type="button"
                variant={localSettings.orientation === 'landscape' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setLocalSettings({ ...localSettings, orientation: 'landscape' })}
                disabled={localSettings.preset === 'original'}
              >
                <div className="w-6 h-4 border-2 border-current rounded-sm mr-2" />
                Landscape
              </Button>
            </div>
          </div>

          {localSettings.preset !== 'original' && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Size:</strong>{' '}
                {Math.round(localSettings.width)} × {Math.round(localSettings.height)} points
                {' '}({Math.round(localSettings.width / 72 * 25.4)} × {Math.round(localSettings.height / 72 * 25.4)} mm)
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isCustomized && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button onClick={handleSave}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

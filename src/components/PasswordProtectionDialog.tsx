import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PasswordProtectionDialogProps {
  enabled: boolean;
  password: string;
  onPasswordChange: (password: string) => void;
  onEnabledChange: (enabled: boolean) => void;
}

export function PasswordProtectionDialog({
  enabled,
  password,
  onPasswordChange,
  onEnabledChange,
}: PasswordProtectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localPassword, setLocalPassword] = useState(password);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (localPassword && localPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (localPassword && localPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    setError('');
    onPasswordChange(localPassword);
    onEnabledChange(!!localPassword);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalPassword('');
    setConfirmPassword('');
    onPasswordChange('');
    onEnabledChange(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={enabled ? 'secondary' : 'ghost'}
          size="sm"
          title="Password Protection"
        >
          <Lock className={`w-4 h-4 sm:mr-2 ${enabled ? 'text-primary' : ''}`} />
          <span className="hidden sm:inline">
            {enabled ? 'Protected' : 'Password'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password Protection
          </DialogTitle>
          <DialogDescription>
            Add a password to protect your merged PDF. Recipients will need this password to open the file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                value={localPassword}
                onChange={(e) => {
                  setLocalPassword(e.target.value);
                  setError('');
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password..."
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Password protection uses PDF encryption. 
              The password will be required to open the merged PDF in any PDF reader.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {enabled && (
            <Button variant="outline" onClick={handleClear}>
              Remove Protection
            </Button>
          )}
          <Button onClick={handleSave}>
            {localPassword ? 'Set Password' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

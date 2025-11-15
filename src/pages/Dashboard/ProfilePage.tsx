import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { updateProfile, sendConfirmationEmail } from '@/services/apiService';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [emailSentMessage, setEmailSentMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    try {
      const updatedUser = { name, email, password, password_confirmation: passwordConfirmation };
      await updateProfile(updatedUser);
      login({ name, email });
      setSuccessMessage(t('profile.success.profileUpdated'));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Profile update failed:', error);
      }
    }
  };

  const handleConfirmEmail = async () => {
    setEmailSentMessage('');
    try {
      await sendConfirmationEmail();
      setEmailSentMessage(t('profile.emailConfirmation.sentDescription'));
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  };

  const isDevelopment = true; // <-- use isso para ativar/desativar o overlay facilmente

  return (
    <div className="relative">
      {isDevelopment && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-white text-center p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">{t('profile.devOverlay.title')}</h2>
          <p className="text-sm opacity-90 max-w-md">
            {t('profile.devOverlay.description')}
          </p>
        </div>
      )}

      {successMessage && (
        <Alert className="mb-4">
          <AlertTitle>{t('profile.success.title')}</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('profile.update.title')}</CardTitle>
          <CardDescription>{t('profile.update.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.update.name')}</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('profile.update.email')}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('profile.update.newPassword')}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-confirmation">{t('profile.update.confirmPassword')}</Label>
              <Input
                id="password-confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
            <Button type="submit">{t('profile.update.button')}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.emailConfirmation.title')}</CardTitle>
          <CardDescription>{t('profile.emailConfirmation.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {emailSentMessage && (
            <Alert className="mb-4">
              <AlertTitle>{t('profile.emailConfirmation.sentTitle')}</AlertTitle>
              <AlertDescription>{emailSentMessage}</AlertDescription>
            </Alert>
          )}
          {user?.email_verified_at ? (
            <p>{t('profile.emailConfirmation.confirmed')}</p>
          ) : (
            <div className="flex items-center justify-between">
              <p>{t('profile.emailConfirmation.notConfirmed')}</p>
              <Button onClick={handleConfirmEmail}>{t('profile.emailConfirmation.button')}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Turnstile } from '@marsidev/react-turnstile';
import { ThemeContext, SecretInput, Spinner, Button, isDark } from '@librechat/client';
import type { TLoginUser, TStartupConfig } from 'librechat-data-provider';
import type { TAuthContext } from '~/common';
import { useResendVerificationEmail, useGetStartupConfig } from '~/data-provider';
import { validateEmail } from '~/utils';
import { useLocalize } from '~/hooks';

type TLoginFormProps = {
  onSubmit: (data: TLoginUser) => void;
  startupConfig: TStartupConfig;
  error: Pick<TAuthContext, 'error'>['error'];
  setError: Pick<TAuthContext, 'setError'>['setError'];
};

const LoginForm: React.FC<TLoginFormProps> = ({ onSubmit, startupConfig, error, setError }) => {
  const localize = useLocalize();
  const { theme } = useContext(ThemeContext);
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginUser>();
  const [showResendLink, setShowResendLink] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const { data: config } = useGetStartupConfig();
  const useUsernameLogin = config?.ldap?.username;
  const validTheme = isDark(theme) ? 'dark' : 'light';
  const requireCaptcha = Boolean(startupConfig.turnstile?.siteKey);
  const authInputClassName =
    'peer h-[58px] w-full rounded-none border-0 border-b border-[#C9C5BC] bg-transparent px-0 pb-[7px] pt-[21px] text-[15px] text-[#1B1B18] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-transparent focus:border-[#4B6A55] focus:shadow-[0_1px_0_#4B6A55]';
  const authSecretInputClassName = `${authInputClassName} pr-12`;
  const authLabelClassName =
    'absolute left-0 top-[19px] text-[11px] uppercase tracking-[1.8px] text-[#77756E] pointer-events-none transition-transform duration-200 peer-focus:-translate-y-[15px] peer-focus:text-[#4B6A55] peer-[&:not(:placeholder-shown)]:-translate-y-[15px] peer-[&:not(:placeholder-shown)]:text-[#4B6A55]';
  const authSecretButtonClassName = 'size-9 text-[#77756E] hover:bg-transparent hover:text-[#1B1B18]';

  useEffect(() => {
    if (error && error.includes('422') && !showResendLink) {
      setShowResendLink(true);
    }
  }, [error, showResendLink]);

  const resendLinkMutation = useResendVerificationEmail({
    onMutate: () => {
      setError(undefined);
      setShowResendLink(false);
    },
  });

  if (!startupConfig) {
    return null;
  }

  const renderError = (fieldName: string) => {
    const errorMessage = errors[fieldName]?.message;
    return errorMessage ? (
      <span role="alert" className="mt-1 text-sm text-red-600 dark:text-red-500">
        {String(errorMessage)}
      </span>
    ) : null;
  };

  const handleResendEmail = () => {
    const email = getValues('email');
    if (!email) {
      return setShowResendLink(false);
    }
    resendLinkMutation.mutate({ email });
  };

  return (
    <>
      {showResendLink && (
        <div className="mt-2 rounded-md border border-green-500 bg-green-500/10 px-3 py-2 text-sm text-gray-600 dark:text-gray-200">
          {localize('com_auth_email_verification_resend_prompt')}
          <button
            type="button"
            className="ml-2 text-blue-600 hover:underline"
            onClick={handleResendEmail}
            disabled={resendLinkMutation.isLoading}
          >
            {localize('com_auth_email_resend_link')}
          </button>
        </div>
      )}
      <form
        className="mt-6 flex flex-col gap-[25px]"
        aria-label="Login form"
        method="POST"
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <div className="relative animate-rise" style={{ animationDelay: '0.18s' }}>
          <div className="relative">
            <input
              type="text"
              id="email"
              autoComplete={useUsernameLogin ? 'username' : 'email'}
              aria-label={localize('com_auth_email')}
              {...register('email', {
                required: localize('com_auth_email_required'),
                maxLength: { value: 120, message: localize('com_auth_email_max_length') },
                validate: useUsernameLogin
                  ? undefined
                  : (value) => validateEmail(value, localize('com_auth_email_pattern')),
              })}
              aria-invalid={!!errors.email}
              className={authInputClassName}
              placeholder=" "
            />
            <label htmlFor="email" className={authLabelClassName}>
              {useUsernameLogin
                ? localize('com_auth_username').replace(/ \(.*$/, '')
                : localize('com_auth_email_address')}
            </label>
          </div>
          {renderError('email')}
        </div>
        <div className="relative animate-rise" style={{ animationDelay: '0.28s' }}>
          <div className="relative">
            <SecretInput
              id="password"
              autoComplete="current-password"
              aria-label={localize('com_auth_password')}
              {...register('password', {
                required: localize('com_auth_password_required'),
                minLength: {
                  value: startupConfig?.minPasswordLength || 8,
                  message: localize('com_auth_password_min_length'),
                },
                maxLength: { value: 128, message: localize('com_auth_password_max_length') },
              })}
              aria-invalid={!!errors.password}
              className={authSecretInputClassName}
              placeholder=" "
              label={localize('com_auth_password')}
              labelClassName={authLabelClassName}
              controlsClassName="right-2"
              buttonClassName={authSecretButtonClassName}
            />
          </div>
          {renderError('password')}
        </div>
        {startupConfig.passwordResetEnabled && (
          <a
            href="/forgot-password"
            className="-mt-2 animate-rise self-end border-b border-transparent text-[13px] text-[#4B6A55] no-underline transition-colors duration-200 hover:border-[#4B6A55] hover:text-[#1B1B18] focus-visible:border-[#4B6A55] focus-visible:text-[#1B1B18]"
            style={{ animationDelay: '0.36s' }}
          >
            {localize('com_auth_password_forgot')}
          </a>
        )}

        {requireCaptcha && (
          <div className="my-4 flex justify-center">
            <Turnstile
              siteKey={startupConfig.turnstile!.siteKey}
              options={{
                ...startupConfig.turnstile!.options,
                theme: validTheme,
              }}
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
        )}

        <div className="mt-0.5 animate-rise" style={{ animationDelay: '0.44s' }}>
          <Button
            aria-label={localize('com_auth_continue')}
            data-testid="login-button"
            type="submit"
            disabled={(requireCaptcha && !turnstileToken) || isSubmitting}
            variant="submit"
            className="h-[54px] w-full rounded-none border border-[#4B6A55] bg-[#4B6A55] text-[14px] tracking-[0.6px] text-[#FFFDF8] transition-[background-color,box-shadow] duration-200 hover:bg-[#385441] hover:shadow-[0_7px_18px_#4b6a5530] active:bg-[#294333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B1B18] focus-visible:outline-offset-[3px]"
          >
            {isSubmitting ? <Spinner /> : localize('com_auth_continue')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;

import { useLocalize } from '~/hooks';
import { TStartupConfig } from 'librechat-data-provider';

function Footer({
  startupConfig,
  className,
  linkClassName,
  hideDivider = false,
}: {
  startupConfig: TStartupConfig | null | undefined;
  className?: string;
  linkClassName?: string;
  hideDivider?: boolean;
}) {
  const localize = useLocalize();
  if (!startupConfig) {
    return null;
  }
  const privacyPolicy = startupConfig.interface?.privacyPolicy;
  const termsOfService = startupConfig.interface?.termsOfService;

  const defaultLinkClassName =
    'text-sm text-green-600 underline decoration-transparent transition-all duration-200 hover:text-green-700 hover:decoration-green-700 focus:text-green-700 focus:decoration-green-700 dark:text-green-500 dark:hover:text-green-400 dark:hover:decoration-green-400 dark:focus:text-green-400 dark:focus:decoration-green-400';

  const privacyPolicyRender = privacyPolicy?.externalUrl && (
    <a
      className={linkClassName ?? defaultLinkClassName}
      href={privacyPolicy.externalUrl}
      // Removed for WCAG compliance
      // target={privacyPolicy.openNewTab ? '_blank' : undefined}
      rel="noreferrer"
    >
      {localize('com_ui_privacy_policy')}
    </a>
  );

  const termsOfServiceRender = termsOfService?.externalUrl && (
    <a
      className={linkClassName ?? defaultLinkClassName}
      href={termsOfService.externalUrl}
      // Removed for WCAG compliance
      // target={termsOfService.openNewTab ? '_blank' : undefined}
      rel="noreferrer"
    >
      {localize('com_ui_terms_of_service')}
    </a>
  );

  return (
    <div className={className ?? 'align-end m-4 flex justify-center gap-2'} role="contentinfo">
      {privacyPolicyRender}
      {!hideDivider && privacyPolicyRender && termsOfServiceRender && (
        <div className="border-r-[1px] border-gray-300 dark:border-gray-600" />
      )}
      {termsOfServiceRender}
    </div>
  );
}

export default Footer;

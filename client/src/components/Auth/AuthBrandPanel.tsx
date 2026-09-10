import { TStartupConfig } from 'librechat-data-provider';
import { useLocalize } from '~/hooks';

/** Decorative brand panel shown beside the auth card on large screens. */
function AuthBrandPanel({ startupConfig }: { startupConfig?: TStartupConfig | null }) {
  const localize = useLocalize();
  const appTitle = startupConfig?.appTitle ?? 'LibreChat';

  return (
    <div className="relative hidden overflow-hidden bg-gray-900 lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,163,127,0.45),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(59,130,246,0.35),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full border border-white/10"
      />
      <div className="relative z-10">
        <img
          src="assets/logo.svg"
          className="h-9 w-auto object-contain brightness-0 invert"
          alt={localize('com_ui_logo', { 0: appTitle })}
        />
      </div>
      <div className="relative z-10 max-w-md">
        <h2 className="text-4xl font-semibold leading-tight text-white">{appTitle}</h2>
        <p className="mt-4 text-lg leading-relaxed text-white/70">
          {localize('com_nav_welcome_message')}
        </p>
      </div>
      <div className="relative z-10 text-sm text-white/50">{appTitle}</div>
    </div>
  );
}

export default AuthBrandPanel;

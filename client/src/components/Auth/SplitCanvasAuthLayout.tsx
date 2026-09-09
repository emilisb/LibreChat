import { ThemeSelector } from '@librechat/client';
import { TStartupConfig } from 'librechat-data-provider';
import SocialLoginRender from './SocialLoginRender';
import Footer from './Footer';
import { useLocalize } from '~/hooks';

const heroImage =
  'https://media.base44.com/images/public/6aa11e1576c8f2752c974627/43346efca_generated_ad3edd9d.jpg';

function SplitCanvasAuthLayout({
  children,
  header,
  startupConfig,
  displayError,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  startupConfig: TStartupConfig | null | undefined;
  displayError: React.ReactNode;
}) {
  const localize = useLocalize();

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#FFFDF8] sm:flex-row">
      <section className="relative z-[2] flex w-full flex-col bg-[#FFFDF8] px-6 py-10 sm:w-[40%] sm:px-[66px] sm:py-[82px]">
        <div className="mb-10 h-[46px] w-full animate-rise sm:mb-[170px]">
          <img
            src="assets/logo.svg"
            className="h-full w-auto object-contain object-left"
            alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'LibreChat' })}
          />
        </div>
        {header != null && header !== '' && (
          <h1
            className="mb-[42px] animate-rise text-[46px] font-normal leading-[1.08] tracking-[-1.5px] text-[#1B1B18]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', animationDelay: '0.08s' }}
          >
            {header}
          </h1>
        )}
        {displayError}
        {children}
        <SocialLoginRender
          startupConfig={startupConfig}
          containerClassName="mt-[76px] animate-rise"
          containerStyle={{ animationDelay: '0.6s' }}
          dividerClassName="mb-[22px] flex items-center gap-[13px] text-[10px] uppercase tracking-[2px] text-[#A19D94] before:h-px before:flex-1 before:bg-[#DED9CF] before:content-[''] after:h-px after:flex-1 after:bg-[#DED9CF] after:content-['']"
          buttonWrapperClassName="mb-[10px]"
          buttonClassName="flex h-12 w-full items-center space-x-3 rounded-none border border-[#D6D0C5] bg-[#FFFDF8] px-[15px] text-left text-[13px] text-[#1B1B18] transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#4B6A55] hover:bg-[#F7F4ED] hover:shadow-[0_4px_10px_#4b6a5514] active:bg-[#EEE9DE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4B6A55] focus-visible:outline-offset-2"
        />
        <div
          className="mt-auto flex animate-rise items-center gap-2.5 pt-10 text-xs text-[#77756E]"
          style={{ animationDelay: '0.68s' }}
        >
          <span>Theme</span>
          <ThemeSelector returnThemeOnly />
        </div>
        <Footer
          startupConfig={startupConfig}
          className="mt-7 flex gap-[18px]"
          linkClassName="border-b border-transparent text-[11px] text-[#77756E] no-underline transition-colors duration-200 hover:border-[#4B6A55] hover:text-[#4B6A55] focus-visible:border-[#4B6A55] focus-visible:text-[#4B6A55]"
          hideDivider
        />
      </section>
      <section className="relative hidden min-h-screen overflow-hidden bg-[#F1EDE3] sm:block sm:w-[60%]">
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#F1EDE3aa] via-[#F1EDE322] to-[#1B1B1808]" />
        <img src={heroImage} alt="" className="h-full w-full animate-drift object-cover" />
        <div className="absolute bottom-[82px] left-[38px] top-[82px] z-[2] w-px bg-[#FFFDF899]" />
      </section>
    </div>
  );
}

export default SplitCanvasAuthLayout;

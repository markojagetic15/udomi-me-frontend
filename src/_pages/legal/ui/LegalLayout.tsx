import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '_shared';

// Operator details shown in the legal pages. The site is run by its author,
// a private individual.
export const LEGAL = {
  operator: 'Udomi me',
  operatorDetails: {
    hr: 'fizička osoba - vlasnik i autor stranice',
    en: "a private individual - the site's owner and author",
  },
  email: 'info@udomi-me.com',
  effective: '27.10.2026',
};

export const LegalLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  return (
    <div className='container max-w-3xl py-8 sm:py-12'>
      <h1 className='text-3xl font-extrabold sm:text-4xl'>{title}</h1>
      <p className='mt-2 text-sm text-muted-foreground'>
        {t('legal.effective', { date: LEGAL.effective })}
      </p>
      <Card className='mt-8 p-6 sm:p-8'>
        <div className='prose-legal flex flex-col gap-6 text-[15px] leading-relaxed text-foreground/85 [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5'>
          {children}
        </div>
      </Card>
    </div>
  );
};

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estratégia Chinesa',
  description: 'Receba sinais de trading simulados em tempo real.',
};

export default function AnalisadorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

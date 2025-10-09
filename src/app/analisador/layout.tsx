import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analisador de Sinais - AlphaTrade',
  description: 'Receba sinais de trading simulados em tempo real.',
};

export default function AnalisadorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

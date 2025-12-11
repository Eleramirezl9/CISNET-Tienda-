import type { Metadata } from 'next';
import { AsociadosContent } from '@/asociados/componentes/AsociadosContent';

export const metadata: Metadata = {
  title: 'Asociados - CISNET | Red de Colaboradores Tecnológicos',
  description: 'Conoce a los profesionales y empresas que forman parte de nuestra red de asociados. Únete a la comunidad de expertos tecnológicos de CISNET en Latinoamérica.',
  keywords: ['asociados CISNET', 'colaboradores tecnológicos', 'red de profesionales', 'partners tecnológicos', 'alianzas estratégicas'],
  openGraph: {
    title: 'Asociados - CISNET',
    description: 'Conoce a nuestra red de colaboradores y profesionales tecnológicos en Latinoamérica.',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function AsociadosPage() {
  return <AsociadosContent />;
}

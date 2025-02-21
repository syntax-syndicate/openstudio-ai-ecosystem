import { TubeProvider } from '@/modules/tube/providers/tube-provider';
import { TubeLayout } from '@/modules/tube/ui/layouts/tube-layout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <TubeProvider>
      <TubeLayout>{children}</TubeLayout>
    </TubeProvider>
  );
};

export default Layout;

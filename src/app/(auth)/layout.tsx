import AuthLayout from "@/app/layouts/authLayout";
import AnimationProvider from "@/app/providers/AnimationProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: RootLayoutProps) {
  return (
    <AuthLayout>
      <AnimationProvider>{children}</AnimationProvider>
    </AuthLayout>
  );
}

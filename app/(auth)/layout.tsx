export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary/5 to-red-600/5">
      {children}
    </section>
  );
}



export default function PaymentAccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The shared admin layout at /admin/layout.tsx handles auth & chrome.
  // This layout is now a simple pass-through.
  return <>{children}</>;
}

// Course player layout — fills the entire viewport, sitting above the dashboard chrome.
// Uses fixed positioning so it completely covers the dashboard layout,
// avoiding padding conflicts with the parent <main>.
export default function CoursePlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {children}
    </div>
  );
}

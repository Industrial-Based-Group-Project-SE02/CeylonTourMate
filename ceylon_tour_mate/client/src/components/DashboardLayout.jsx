import Sidebar from './Sidebar';

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 ml-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
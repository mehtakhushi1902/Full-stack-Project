import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  FileSpreadsheet
} from 'lucide-react';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import { Dashboard } from './Layouts/Dashboard';
import { Form } from './Layouts/Form';
import { Reactquery } from './Layouts/Reactquery';
import { Payment } from './Layouts/payment';
import { PaymentSuccess } from './Layouts/PaymentSuccess';
import { PaymentFail } from './Layouts/PaymentFail';

const PlaceholderPage = ({ pageName }: { pageName: string }) => (
  <div className="flex flex-col items-center justify-center h-placeholder-page text-center max-w-md mx-auto">
    <div className="w-16 h-16 bg-metric-purple-bg rounded-2xl flex items-center justify-center text-brand-purple mb-4">
      <FileSpreadsheet className="w-8 h-8" />
    </div>
    <h2 className="text-xl font-bold text-brand-dark mb-2 capitalize">{pageName} Page</h2>
    <p className="text-sm text-brand-gray">
      This page layout is currently under construction. Active development is focused on the pixel-perfect implementation of the core Sales Dashboard.
    </p>
  </div>
);

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-brand-bg">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-x-hidden overflow-auto">
        <Header onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 px-6 pb-8 lg:px-8 lg:pb-12">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form" element={<Form />} />
            <Route path="/react-query" element={<Reactquery />} />

            <Route path="/payment" element={<Payment />}>

            </Route>
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/fail" element={<PaymentFail />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;

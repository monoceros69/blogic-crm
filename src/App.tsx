import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';

// Lazy load all pages except Login
const ContractsPage = lazy(() => import('./pages/ContractsPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const AdvisorsPage = lazy(() => import('./pages/AdvisorsPage'));
const ContractDetailsPage = lazy(() => import('./pages/ContractDetailsPage'));
const ClientDetailsPage = lazy(() => import('./pages/ClientDetailsPage'));
const AdvisorDetailsPage = lazy(() => import('./pages/AdvisorDetailsPage'));

const PageLoader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

function isAuthenticated() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/contracts" /> : <LoginPage />} />

          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <>
                  <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
                        <button
                          onClick={() => handleLogout()}
                          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                    <nav className="bg-gray-200 shadow-inner">
                      <div className="max-w-7xl mx-auto px-0">
                        <div className="flex flex-col sm:flex-row">
                          <NavLink
                            to="/contracts"
                            className={({ isActive }) =>
                              `py-2 text-base font-semibold text-center w-full sm:flex-grow ${
                                isActive
                                  ? 'bg-gray-300 text-gray-900'
                                  : 'text-gray-700 hover:bg-gray-300'
                              }`
                            }
                          >
                            <span className="px-4 sm:px-3 lg:px-8">CONTRACTS</span>
                          </NavLink>
                          <NavLink
                            to="/clients"
                            className={({ isActive }) =>
                              `py-2 text-base font-semibold text-center w-full sm:flex-grow ${
                                isActive
                                  ? 'bg-gray-300 text-gray-900'
                                  : 'text-gray-700 hover:bg-gray-300'
                              }`
                            }
                          >
                            <span className="px-4 sm:px-3 lg:px-8">CLIENTS</span>
                          </NavLink>
                          <NavLink
                            to="/advisors"
                            className={({ isActive }) =>
                              `py-2 text-base font-semibold text-center w-full sm:flex-grow ${
                                isActive
                                  ? 'bg-gray-300 text-gray-900'
                                  : 'text-gray-700 hover:bg-gray-300'
                              }`
                            }
                          >
                            <span className="px-4 sm:px-3 lg:px-8">ADVISORS</span>
                          </NavLink>
                        </div>
                      </div>
                    </nav>
                  </header>

                  <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/contracts" element={<ContractsPage />} />
                        <Route path="/contracts/:id" element={<ContractDetailsPage />} />
                        <Route path="/clients" element={<ClientsPage />} />
                        <Route path="/clients/:id" element={<ClientDetailsPage />} />
                        <Route path="/advisors" element={<AdvisorsPage />} />
                        <Route path="/advisors/:id" element={<AdvisorDetailsPage />} />
                        <Route path="*" element={<Navigate to="/contracts" />} />
                      </Routes>
                    </Suspense>
                  </main>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

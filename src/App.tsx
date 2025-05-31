import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ContractsPage } from './pages/ContractsPage';
import { ClientsPage } from './pages/ClientsPage';
import { AdvisorsPage } from './pages/AdvisorsPage';
import { ContractDetailsPage } from './pages/ContractDetailsPage';
import { ClientDetailsPage } from './pages/ClientDetailsPage';
import { AdvisorDetailsPage } from './pages/AdvisorDetailsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
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
          <Routes>
            <Route path="/" element={<ContractsPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/contracts/:id" element={<ContractDetailsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetailsPage />} />
            <Route path="/advisors" element={<AdvisorsPage />} />
            <Route path="/advisors/:id" element={<AdvisorDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

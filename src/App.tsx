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
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Contract Management</h1>
                </div>
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink
                    to="/contracts"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    Contracts
                  </NavLink>
                  <NavLink
                    to="/clients"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    Clients
                  </NavLink>
                  <NavLink
                    to="/advisors"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    Advisors
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>

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

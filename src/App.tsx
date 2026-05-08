import AppProviders from "./AppContext";
import Dashboard from "./components/dashboard/Dashboard";
import Summary from "./components/summary/Summary";
import ReportsProvider from "./components/reports/ReportsContext";
import Reports from "./components/reports/Reports";
import ChartView from "./components/chart-view/ChartView";
import Aside from "./components/aside/Aside";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AppProviders>
        <Dashboard>
          <Summary />
          <ReportsProvider>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 flex flex-col gap-6">
                <ChartView />
                <Reports />
              </div>
              <div className="flex flex-col gap-6">
                <Aside />
              </div>
            </div>
          </ReportsProvider>
        </Dashboard>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;

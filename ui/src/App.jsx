import { Routes, Route, Link } from 'react-router-dom';
import Campaigns from './pages/Campaigns';
import CreateCampaign from './pages/CreateCampaign';
import Recipients from './pages/Recipients';
import CampaignLogs from './pages/CampaignLogs'
import Navbar from "./Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Campaigns />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/recipients" element={<Recipients />} />
        <Route path="/campaign/:id/logs" element={<CampaignLogs />} /> {/* new route */}
      </Routes>
    </div>
  );
}

export default App;

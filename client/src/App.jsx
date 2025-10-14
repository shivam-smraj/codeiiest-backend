// In /codeiiest-backend/client/src/App.jsx (Updated to use Layout)

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import ManageEvents from './pages/admin/ManageEvents';
import CreateEvent from './pages/admin/CreateEvent';
import EditEvent from './pages/admin/EditEvent';
import ManageTeamMembers from './pages/admin/ManageTeamMembers';
import CreateTeamMember from './pages/admin/CreateTeamMember';
import EditTeamMember from './pages/admin/EditTeamMember';
import ManageChapters from './pages/admin/ManageChapters';
import CreateChapter from './pages/admin/CreateChapter';
import EditChapter from './pages/admin/EditChapter';

import EditProfilePage from './pages/EditProfilePage'; 
// import LeaderboardPage from './pages/LeaderboardPage'; // This is the portal's leaderboard, which we will style later
import Layout from './components/Layout'; // <-- NEW IMPORT

function App() {
  return (
    <Router>
      <Layout> {/* Wrap all routes with the Layout component */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} /> 
          
          {/* Admin Routes */}
          <Route path="/admin/events" element={<ManageEvents />} />
          <Route path="/admin/events/create" element={<CreateEvent />} />
          <Route path="/admin/events/edit/:id" element={<EditEvent />} />

          <Route path="/admin/team-members" element={<ManageTeamMembers />} />
          <Route path="/admin/team-members/create" element={<CreateTeamMember />} />
          <Route path="/admin/team-members/edit/:id" element={<EditTeamMember />} />

          <Route path="/admin/chapters" element={<ManageChapters />} />
          <Route path="/admin/chapters/create" element={<CreateChapter />} />
          <Route path="/admin/chapters/edit/:id" element={<EditChapter />} />

          {/* Portal's Leaderboard (will be styled) */}
          {/* <Route path="/leaderboard" element={<LeaderboardPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
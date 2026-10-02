import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

import Home from './pages/Home';
import Explore from './pages/Explore';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import ContentDetails from './pages/ContentDetails';
import Characters from './pages/Characters';
import CharacterDetails from './pages/CharacterDetails';
import Merchandise from './pages/Merchandise';
import MerchandiseDetails from './pages/MerchandiseDetails';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import EventCalendarPage from './pages/EventCalendarPage';
import FanCreations from './pages/FanCreations';
import Media from './pages/Media';
import About from './pages/About';
import NotFound from './pages/NotFound';

import Movies from './pages/Movies';
import Anime from './pages/Anime';
import Videos from './pages/Videos';
import Games from './pages/Games';
import Wallpapers from './pages/Wallpapers';
import Audio from './pages/Audio';
import SeriesPage from './pages/SeriesPage';
import SeriesDetails from './pages/SeriesDetails';
import WatchEpisode from './pages/WatchEpisode';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import Submit from './pages/Submit';
import Feedback from './pages/Feedback';
import MyBookings from './pages/MyBookings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminContent from './pages/admin/AdminContent';
import AdminSeries from './pages/admin/AdminSeries';
import AdminCharacters from './pages/admin/AdminCharacters';
import AdminMerchandise from './pages/admin/AdminMerchandise';
import AdminEvents from './pages/admin/AdminEvents';
import AdminFanSubmissions from './pages/admin/AdminFanSubmissions';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminMedia from './pages/admin/AdminMedia';
import AdminReviews from './pages/admin/AdminReviews';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:slug" element={<CategoryDetails />} />
                <Route path="/content/:slug" element={<ContentDetails />} />
                <Route path="/characters" element={<Characters />} />
                <Route path="/characters/:slug" element={<CharacterDetails />} />
                <Route path="/merchandise" element={<Merchandise />} />
                <Route path="/merchandise/:slug" element={<MerchandiseDetails />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/calendar" element={<EventCalendarPage />} />
                <Route path="/events/:slug" element={<EventDetails />} />
                <Route path="/media" element={<Media />} />
                <Route path="/articles" element={<FanCreations />} />
                <Route path="/fan-creations" element={<FanCreations />} />
                <Route path="/about" element={<About />} />

                {/* Media & Series Categories Routes */}
                <Route path="/series" element={<SeriesPage />} />
                <Route path="/series/:slug" element={<SeriesDetails />} />
                <Route path="/watch/episode/:episodeId" element={<WatchEpisode />} />
                <Route path="/watch/:seriesSlug/season/:seasonNum/episode/:episodeNum" element={<WatchEpisode />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/anime" element={<Anime />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/games" element={<Games />} />
                <Route path="/wallpapers" element={<Wallpapers />} />
                <Route path="/audio" element={<Audio />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
                <Route path="/submit" element={<ProtectedRoute><Submit /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                <Route path="/feedback" element={<Feedback />} />

                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="series" element={<AdminSeries />} />
                <Route path="characters" element={<AdminCharacters />} />
                <Route path="merchandise" element={<AdminMerchandise />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="fan-submissions" element={<AdminFanSubmissions />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

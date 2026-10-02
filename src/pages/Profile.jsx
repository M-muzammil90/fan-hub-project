import React, { useState } from 'react';
import { User, Mail, Shield, Check, Edit2, Camera, Calendar, MapPin, Phone, Heart, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  
  // States
  const [name, setName] = useState(currentUser?.name || 'M Muzammil');
  const email = currentUser?.email || 'muzammil@gmail.com'; // Non-editable
  const [phone, setPhone] = useState('0313-8318499');
  const [location, setLocation] = useState('Karachi, Pakistan');
  const [dob, setDob] = useState('15 Jan 2003');
  const [gender, setGender] = useState('Male');
  const [bio, setBio] = useState(currentUser?.bio || 'Passionate about web development, technology and building creative solutions. Always eager to learn and grow.');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://i.pravatar.cc/150?img=11');
  const role = currentUser?.role || 'User';
  const joinedDate = currentUser?.joinedDate || 'Jan 2025';

  const [statusMessage, setStatusMessage] = useState('');

  const handleSave = (e) => {
    if (e) e.preventDefault();
    updateProfile({ name, email, bio, avatar, role });
    setStatusMessage('Profile saved successfully!');
    setIsEditing(false);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-6 text-zinc-100 selection:bg-red-500/30 font-sans">
      
      {/* Top Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0a0204] border border-white/5 shadow-2xl shadow-red-900/10 p-8 sm:p-10">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-gradient-to-bl from-red-600/30 via-red-900/10 to-transparent blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-950/20 to-transparent" />
        </div>
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
          
          {/* Avatar Area */}
          <div className="relative shrink-0 z-10">
            <img
              src={avatar}
              alt={name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-[3px] ring-red-600 shadow-lg shadow-red-600/20"
            />
            <button className="absolute bottom-1 right-1 p-2.5 bg-[#150508] border border-red-500/30 rounded-full text-zinc-300 hover:text-white hover:bg-red-950 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4 w-full z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{name}</h1>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Mail className="w-4 h-4 text-red-500" />
                  <span>{email}</span>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-3">
                <div className="hidden md:flex items-center gap-3 text-sm text-zinc-300 font-medium">
                  <span>Build</span> <span className="text-red-600 font-bold">•</span>
                  <span>Create</span> <span className="text-red-600 font-bold">•</span>
                  <span>Grow</span>
                </div>
                {isEditing ? (
                  <button onClick={handleSave} className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-colors flex items-center gap-2">
                    <Check className="w-4 h-4" /> Save Profile
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-5 py-2 rounded-full border border-red-500/50 hover:bg-red-950/50 text-red-400 hover:text-red-300 text-sm font-bold transition-colors flex items-center gap-2">
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-900/50">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-xs font-bold text-red-200">Active</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-10 relative z-10">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-0.5">Joined</p>
              <p className="text-sm font-medium text-white">{joinedDate}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/10" />
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-0.5">Role</p>
              <p className="text-sm font-medium text-white">{role}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/10" />
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-sm font-medium text-white">{location}</p>
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Personal Information */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0a0204] border border-white/5 p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <User className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">Personal Information</h2>
          </div>

          <div className="space-y-6 md:space-y-8">
            <InfoField icon={User} label="Full Name" value={name} isEditing={isEditing} onChange={setName} />
            
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 pb-2">
                <p className="text-[13px] text-zinc-400 mb-1">Email Address</p>
                <input
                  type="text"
                  value={email}
                  disabled
                  className="w-full bg-transparent text-sm font-medium text-zinc-300 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <InfoField icon={Phone} label="Phone Number" value={phone} isEditing={isEditing} onChange={setPhone} />
            <InfoField icon={MapPin} label="Location" value={location} isEditing={isEditing} onChange={setLocation} />
            <InfoField icon={Calendar} label="Date of Birth" value={dob} isEditing={isEditing} onChange={setDob} />
            
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><path d="M12 17v5"/><path d="M9 20h6"/><path d="M15.5 8.5L19 5"/><path d="M19 9V5h-4"/>
                </svg>
              </div>
              <div className="flex-1 pb-2">
                <p className="text-[13px] text-zinc-400 mb-1">Gender</p>
                {isEditing ? (
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full max-w-xs bg-[#150508] border border-red-500/30 rounded-lg px-3 py-2 text-sm font-medium text-white focus:outline-none focus:border-red-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-white">{gender}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Profile Picture Card */}
          <div className="rounded-3xl bg-[#0a0204] border border-white/5 p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-white" />
              <h2 className="text-lg font-bold text-white">Profile Picture</h2>
            </div>
            <div className="flex items-center gap-4">
              <img src={avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover ring-2 ring-red-600/50" />
              <div className="flex-1">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={avatar} 
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="Image URL"
                    className="w-full bg-[#150508] border border-red-500/30 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 mb-3"
                  />
                ) : null}
                <button className="px-4 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5" /> Change Photo
                </button>
              </div>
            </div>
          </div>

          {/* About Me Card */}
          <div className="rounded-3xl bg-[#0a0204] border border-white/5 p-6 md:p-8 shadow-xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-white" />
                <h2 className="text-lg font-bold text-white">About Me</h2>
              </div>
              <Edit2 className="w-4 h-4 text-zinc-600" />
            </div>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-[#150508] border border-red-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
              />
            ) : (
              <p className="text-[13px] text-zinc-300 leading-relaxed font-medium">
                {bio}
              </p>
            )}
          </div>

          {/* Favorite Category Card */}
          <div className="rounded-3xl bg-[#0a0204] border border-white/5 p-6 md:p-8 shadow-xl relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-white" />
                <h2 className="text-lg font-bold text-white">Favorite Category</h2>
              </div>
              <Edit2 className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {['Web Development', 'UI/UX Design', 'Technology', 'Gaming'].map((cat, i) => (
                <span key={cat} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${i === 0 ? 'bg-red-600 text-white border-red-600' : 'bg-transparent text-zinc-300 border-white/10 hover:border-red-500/50'}`}>
                  {cat}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Account Settings Banner */}
      <button className="w-full rounded-2xl bg-[#0a0204] border border-white/5 p-5 md:p-6 flex items-center justify-between group hover:bg-[#110306] transition-colors shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-950/50 text-red-500">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-white mb-1">Account Settings</h3>
            <p className="text-[13px] text-zinc-400 font-medium">Manage your account preferences and security.</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-red-400 transition-colors" />
      </button>

    </div>
  );
}

// Helper Component for Fields
function InfoField({ icon: Icon, label, value, isEditing, onChange }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-1">
        <Icon className="w-5 h-5 text-red-600" />
      </div>
      <div className="flex-1 pb-2">
        <p className="text-[13px] text-zinc-400 mb-1">{label}</p>
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full max-w-sm bg-[#150508] border border-red-500/30 rounded-lg px-3 py-2 text-sm font-medium text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        ) : (
          <p className="text-sm font-medium text-white">{value}</p>
        )}
      </div>
    </div>
  );
}

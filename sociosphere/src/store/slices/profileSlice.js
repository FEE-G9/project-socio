import { createSlice } from '@reduxjs/toolkit';
import { updateUser as updateMockUser } from '../../data/mockUsers.js';

// Helper to safely load auth user from localStorage
const getSavedAuthUser = () => {
  try {
    const raw = localStorage.getItem('sociosphere_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const savedUser = getSavedAuthUser();

const buildInitialProfile = (user) => {
  if (!user) return null;

  const role = user.role || 'citizen';
  const isAuthority = role === 'authority';
  const blockNumber = user.blockNumber || (user.unitNumber ? user.unitNumber.split(' - ')[0] : 'Block A') || 'Block A';
  const houseOrFlatNo = user.houseOrFlatNo || (user.unitNumber && user.unitNumber.includes(' - ') ? user.unitNumber.split(' - ')[1] : user.unitNumber) || '101';
  const unitNumber = user.unitNumber || `${blockNumber} - ${houseOrFlatNo}`;

  return {
    id: user.id || `usr-${Date.now()}`,
    name: user.name || (isAuthority ? 'Authority Administrator' : 'Resident Citizen'),
    email: user.email || '',
    phone: user.phone || '+91 90412 00000',
    age: user.age || 28,
    occupation: user.occupation || (isAuthority ? 'Society Administrator' : 'Professional'),
    society: user.society || user.communityName || 'Gandhi Colony',
    societyCode: user.societyCode || 'GC-101',
    communityName: user.communityName || user.society || 'Gandhi Colony',
    communityId: user.communityId || 'colony-gandhi',
    blockNumber,
    houseOrFlatNo,
    unitNumber,
    occupancyType: user.occupancyType || (isAuthority ? 'Committee Head' : 'Flat Owner'),
    role,
    type: user.type || (isAuthority ? 'member' : 'resident'),
    designation: user.designation || (isAuthority ? 'RWA President (Flat Owner)' : 'Resident (Flat Owner)'),
    status: user.status || 'Verified',
    badges: user.badges && user.badges.length > 0 
      ? user.badges 
      : isAuthority 
        ? ['Board President', 'System Administrator', 'Flat Owner'] 
        : ['Verified Resident', 'Flat Owner'],
    joinedDate: user.joinedDate || 'Jan 2024',
    emergencyContact: user.emergencyContact || user.phone || '+91 98765 43210',
    city: user.city || user.communityCity || 'Rajpura',
    communityCity: user.communityCity || user.city || 'Rajpura',
    avatar: user.avatar || '',
    avatarStyle: user.avatarStyle || (isAuthority ? 'shield' : 'classic'),
    bio: user.bio || (isAuthority
      ? `Elected RWA Administrator serving ${user.society || 'Gandhi Colony'} with proactive governance and modern civic management.`
      : `Verified resident of ${user.society || 'Gandhi Colony'}, actively participating in community welfare and building maintenance.`),
  };
};

const initialState = {
  data: buildInitialProfile(savedUser),
  status: 'idle',
  error: null,
  stats: {
    issuesReported: 0,
    issuesResolved: 0,
    communityPoints: 120,
    resolutionRate: 100
  }
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.data = buildInitialProfile(action.payload);
      state.status = 'succeeded';
      state.error = null;
      if (state.data) {
        try {
          localStorage.setItem('sociosphere_auth_user', JSON.stringify(state.data));
        } catch (e) {
          console.error(e);
        }
      }
    },
    updateProfile: (state, action) => {
      if (!state.data) return;

      const updated = {
        ...state.data,
        ...action.payload
      };

      // Recalculate unitNumber if block or flat changed
      if (action.payload.blockNumber || action.payload.houseOrFlatNo) {
        const blk = updated.blockNumber || 'Block A';
        const flat = updated.houseOrFlatNo || '';
        updated.unitNumber = flat ? `${blk} - ${flat}` : blk;
      }

      state.data = updated;
      state.status = 'succeeded';

      // Persist across localStorage databases
      try {
        localStorage.setItem('sociosphere_auth_user', JSON.stringify(updated));

        // Update accounts cache
        const accountsRaw = localStorage.getItem('sociosphere_accounts');
        const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};
        if (updated.email) {
          const emailKey = updated.email.trim().toLowerCase();
          accounts[emailKey] = {
            ...(accounts[emailKey] || {}),
            ...updated
          };
          localStorage.setItem('sociosphere_accounts', JSON.stringify(accounts));
        }

        // Update mockUsers database if available
        if (typeof updateMockUser === 'function') {
          updateMockUser(updated.id, updated);
        }

        // Broadcast storage/custom event
        window.dispatchEvent(new Event('sociosphere_data_updated'));
        window.dispatchEvent(new Event('sociosphere_users_updated'));
      } catch (e) {
        console.error('Failed to sync profile update:', e);
      }
    },
    setAvatarStyle: (state, action) => {
      if (!state.data) return;
      state.data.avatarStyle = action.payload;
      try {
        localStorage.setItem('sociosphere_auth_user', JSON.stringify(state.data));
        window.dispatchEvent(new Event('sociosphere_data_updated'));
      } catch (e) {
        console.error(e);
      }
    },
    updateStats: (state, action) => {
      state.stats = {
        ...state.stats,
        ...action.payload
      };
    },
    clearProfile: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    }
  }
});

export const {
  setProfile,
  updateProfile,
  setAvatarStyle,
  updateStats,
  clearProfile
} = profileSlice.actions;

// Selectors
export const selectProfile = (state) => state.profile.data;
export const selectProfileStats = (state) => state.profile.stats;
export const selectProfileLoading = (state) => state.profile.status === 'loading';
export const selectIsAuthority = (state) => state.profile.data?.role === 'authority';

export default profileSlice.reducer;

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Skeleton,
  Alert,
} from '@mui/material';
import { Person, Lock, LocationOn } from '@mui/icons-material';
import { useGetProfileQuery } from '../api';
import { ProfileEditForm, PasswordChangeForm, AddressManagement } from '../components';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Profile Page Component
 * 
 * Main profile page with tabs for profile info, password change, and address management.
 * Validates: Requirements 3.1
 */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: profile, isLoading, error } = useGetProfileQuery();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="circular" width={80} height={80} sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="30%" />
          </Box>
        </Box>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="rectangular" height={400} />
        </Paper>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load profile. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={profile.avatar}
          alt={profile.name}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Box>
          <Typography variant="h4" gutterBottom>
            {profile.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {profile.email}
          </Typography>
          {profile.phone && (
            <Typography variant="body2" color="text.secondary">
              {profile.phone}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="profile tabs"
          variant="fullWidth"
        >
          <Tab icon={<Person />} label="Profile Info" id="profile-tab-0" />
          <Tab icon={<Lock />} label="Password" id="profile-tab-1" />
          <Tab icon={<LocationOn />} label="Addresses" id="profile-tab-2" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <Paper sx={{ p: 3 }}>
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Edit Profile
          </Typography>
          <ProfileEditForm profile={profile} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <PasswordChangeForm />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <AddressManagement />
        </TabPanel>
      </Paper>
    </Container>
  );
}


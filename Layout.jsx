import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Avatar, Typography, Divider, Tooltip, useMediaQuery, useTheme
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { useAuth } from '../context/AuthContext';

const SIDEBAR_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/dashboard' },
  { label: 'Expenses', icon: <TrendingDownRoundedIcon />, path: '/expenses' },
  { label: 'Income', icon: <TrendingUpRoundedIcon />, path: '/income' },
  { label: 'Categories', icon: <CategoryRoundedIcon />, path: '/categories' },
];

const SidebarContent = ({ onNavigate }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'linear-gradient(180deg, #0D1526 0%, #080D1A 100%)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '12px',
            background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(34,211,238,0.3)',
          }}>
            <AccountBalanceWalletRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800, fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}>
              Expense
            </Typography>
            <Typography variant="h6" sx={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800, fontSize: '1.1rem', color: '#E2E8F0', lineHeight: 1.1,
            }}>
              Manager
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 2 }} />

      {/* Nav Items */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {navItems.map(({ label, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItem
              key={path}
              component={Link}
              to={path}
              onClick={onNavigate}
              sx={{
                borderRadius: 3, mb: 0.5, px: 2, py: 1.2,
                background: active ? 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.1))' : 'transparent',
                border: active ? '1px solid rgba(34,211,238,0.2)' : '1px solid transparent',
                color: active ? '#22D3EE' : '#64748B',
                textDecoration: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(34,211,238,0.08)',
                  color: '#22D3EE',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{icon}</ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.95rem' }}
              />
              {active && (
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#22D3EE', boxShadow: '0 0 8px #22D3EE',
                }} />
              )}
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 2 }} />

      {/* User + Logout */}
      <Box sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          p: 1.5, borderRadius: 3,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          mb: 1.5,
        }}>
          <Avatar sx={{
            width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700,
            background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
          }}>
            {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#E2E8F0', fontSize: '0.85rem', noWrap: true }}>
              {user?.fullname || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
              {user?.email || ''}
            </Typography>
          </Box>
        </Box>
        <ListItem
          component="button"
          onClick={handleLogout}
          sx={{
            borderRadius: 3, px: 2, py: 1.2, width: '100%',
            background: 'transparent', border: '1px solid rgba(248,113,113,0.2)',
            color: '#F87171', cursor: 'pointer', transition: 'all 0.2s',
            '&:hover': { background: 'rgba(248,113,113,0.1)' },
          }}
        >
          <ListItemIcon sx={{ color: '#F87171', minWidth: 36 }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
        </ListItem>
      </Box>
    </Box>
  );
};

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#080D1A' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
          <Box sx={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: SIDEBAR_WIDTH }}>
            <SidebarContent />
          </Box>
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { width: SIDEBAR_WIDTH, background: 'transparent', border: 'none' } }}
        >
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Header */}
        {isMobile && (
          <Box sx={{
            display: 'flex', alignItems: 'center', px: 2, py: 1.5,
            background: '#0D1526', borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'sticky', top: 0, zIndex: 100,
          }}>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#94A3B8', mr: 1 }}>
              <MenuRoundedIcon />
            </IconButton>
            <Typography variant="h6" sx={{
              fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
              background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              ExpenseManager
            </Typography>
          </Box>
        )}

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, maxWidth: 1400, width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  InputAdornment, IconButton
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#080D1A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <Box sx={{ position: 'absolute', top: '10%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '10%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Box sx={{
        width: '100%', maxWidth: 440, mx: 2,
        background: 'rgba(13,21,38,0.9)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 5,
        p: { xs: 3.5, sm: 5 },
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '14px',
            background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(34,211,238,0.35)',
          }}>
            <AccountBalanceWalletRoundedIcon sx={{ color: '#fff', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography sx={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800, fontSize: '1.3rem',
              background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              ExpenseManager
            </Typography>
          </Box>
        </Box>

        <Typography variant="h4" sx={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800, color: '#E2E8F0', mb: 0.5,
        }}>
          Welcome back
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mb: 3.5 }}>
          Sign in to manage your finances
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#FCA5A5' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>
            EMAIL
          </Typography>
          <TextField
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            sx={{ mt: 0.8, mb: 2.5 }}
          />

          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>
            PASSWORD
          </Typography>
          <TextField
            fullWidth
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            sx={{ mt: 0.8, mb: 3.5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} sx={{ color: '#64748B' }} edge="end">
                    {showPass ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ py: 1.5, fontSize: '1rem', mb: 2.5 }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#22D3EE', textDecoration: 'none', fontWeight: 700 }}>
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  InputAdornment, IconButton
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { register } from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{
        minHeight: '100vh', background: '#080D1A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Box sx={{
          textAlign: 'center', p: 5, maxWidth: 400,
          background: 'rgba(13,21,38,0.9)', borderRadius: 5,
          border: '1px solid rgba(74,222,128,0.2)',
        }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 64, color: '#4ADE80', mb: 2 }} />
          <Typography variant="h5" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color: '#E2E8F0', mb: 1 }}>
            Account Created!
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
            Check your email to activate your account, then sign in.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/login')} fullWidth sx={{ py: 1.5 }}>
            Go to Sign In
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh', background: '#080D1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: '5%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '5%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Box sx={{
        width: '100%', maxWidth: 440, mx: 2,
        background: 'rgba(13,21,38,0.9)', backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5,
        p: { xs: 3.5, sm: 5 }, boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '14px',
            background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(34,211,238,0.35)',
          }}>
            <AccountBalanceWalletRoundedIcon sx={{ color: '#fff', fontSize: 26 }} />
          </Box>
          <Typography sx={{
            fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: '1.3rem',
            background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            ExpenseManager
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color: '#E2E8F0', mb: 0.5 }}>
          Create account
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mb: 3.5 }}>
          Start tracking your finances today
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#FCA5A5' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {[
            { label: 'FULL NAME', name: 'fullname', type: 'text', placeholder: 'John Doe' },
            { label: 'EMAIL', name: 'email', type: 'email', placeholder: 'you@example.com' },
          ].map(({ label, name, type, placeholder }) => (
            <Box key={name} sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>
                {label}
              </Typography>
              <TextField
                fullWidth name={name} type={type} value={form[name]}
                onChange={handleChange} placeholder={placeholder} required
                sx={{ mt: 0.8 }}
              />
            </Box>
          ))}

          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>
            PASSWORD
          </Typography>
          <TextField
            fullWidth name="password" type={showPass ? 'text' : 'password'}
            value={form.password} onChange={handleChange}
            placeholder="Min. 8 characters" required sx={{ mt: 0.8, mb: 3.5 }}
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

          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5, fontSize: '1rem', mb: 2.5 }}>
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create Account'}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#22D3EE', textDecoration: 'none', fontWeight: 700 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

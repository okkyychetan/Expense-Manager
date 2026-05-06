import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, TextField, MenuItem,
  IconButton, Avatar, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, Tooltip, Skeleton
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import { getIncomes, addIncome, deleteIncome, getCategories } from '../api/axios';
import Layout from '../components/Layout';

const fmt = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const ICONS = ['💰', '💼', '📈', '🏦', '🎯', '🌟', '💡', '🏆', '🎁', '🤝', '💎', '🔑'];

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '', amount: '', date: new Date().toISOString().slice(0, 10),
    icon: '💰', categoryId: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [incRes, catRes] = await Promise.all([getIncomes(), getCategories()]);
      setIncomes(incRes.data || []);
      const incomeCats = (catRes.data || []).filter(c => c.type === 'INCOME' || !c.type);
      setCategories(incomeCats);
    } catch {
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.name || !form.amount) { setError('Name and amount are required.'); return; }
    setSaving(true); setError('');
    try {
      await addIncome({ ...form, amount: parseFloat(form.amount) });
      setOpen(false);
      setForm({ name: '', amount: '', date: new Date().toISOString().slice(0, 10), icon: '💰', categoryId: '' });
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to add income.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await deleteIncome(id); setIncomes(prev => prev.filter(i => i.id !== id)); }
    catch { } finally { setDeleting(null); }
  };

  const filtered = incomes.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));
  const total = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color: '#E2E8F0' }}>
            Income
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Current month total: <span style={{ color: '#4ADE80', fontWeight: 700 }}>{fmt(total)}</span>
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)}
          sx={{ flexShrink: 0, background: 'linear-gradient(135deg, #4ADE80, #22C55E)', '&:hover': { background: 'linear-gradient(135deg, #86EFAC, #4ADE80)' } }}>
          Add Income
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField fullWidth placeholder="Search income..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchRoundedIcon sx={{ color: '#64748B', mr: 1 }} /> }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <Box sx={{
        background: 'rgba(13,21,38,0.8)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden',
      }}>
        <Box sx={{
          display: 'grid', gridTemplateColumns: '1fr 160px 120px 60px',
          px: 3, py: 1.5,
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {['Transaction', 'Category', 'Amount', ''].map((h) => (
            <Typography key={h} variant="caption" sx={{ color: '#64748B', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', fontSize: '0.7rem' }}>
              {h}
            </Typography>
          ))}
        </Box>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px 60px', px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
                <Box><Skeleton variant="text" width={140} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} /><Skeleton variant="text" width={80} height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} /></Box>
              </Box>
              <Skeleton variant="text" width={90} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
              <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
              <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
            </Box>
          ))
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SavingsRoundedIcon sx={{ fontSize: 56, color: '#1E3A5F', mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              {search ? 'No matching income' : 'No income recorded yet'}
            </Typography>
            {!search && <Typography variant="caption" sx={{ color: '#475569' }}>Click "Add Income" to record your earnings</Typography>}
          </Box>
        ) : (
          filtered.map((income, i) => (
            <Box key={income.id} sx={{
              display: 'grid', gridTemplateColumns: '1fr 160px 120px 60px',
              px: 3, py: 2, alignItems: 'center', gap: 1,
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.15s',
              '&:hover': { background: 'rgba(255,255,255,0.02)' },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                <Avatar sx={{
                  width: 40, height: 40, borderRadius: 2, fontSize: '1.2rem',
                  background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                  flexShrink: 0,
                }}>
                  {income.icon || '💰'}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#E2E8F0' }} noWrap>{income.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {income.date ? new Date(income.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </Typography>
                </Box>
              </Box>
              <Box>
                {income.categoryName
                  ? <Chip label={income.categoryName} size="small" sx={{ background: 'rgba(34,211,238,0.12)', color: '#22D3EE', fontSize: '0.72rem', fontWeight: 700, height: 22 }} />
                  : <Typography variant="caption" sx={{ color: '#475569' }}>—</Typography>}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#4ADE80', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                +{fmt(income.amount)}
              </Typography>
              <Box>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => handleDelete(income.id)} disabled={deleting === income.id}
                    sx={{ color: '#64748B', '&:hover': { color: '#F87171', background: 'rgba(248,113,113,0.1)' } }}>
                    {deleting === income.id ? <CircularProgress size={16} sx={{ color: '#F87171' }} /> : <DeleteRoundedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Add Income Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, pb: 1 }}>
          Add Income
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>ICON</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {ICONS.map(ic => (
                  <Box key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))} sx={{
                    width: 40, height: 40, borderRadius: 2, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                    background: form.icon === ic ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.04)',
                    border: form.icon === ic ? '2px solid #4ADE80' : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}>{ic}</Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>NAME</Typography>
              <TextField fullWidth value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Salary" sx={{ mt: 0.8 }} />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>AMOUNT (₹)</Typography>
              <TextField fullWidth type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" sx={{ mt: 0.8 }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>DATE</Typography>
              <TextField fullWidth type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} sx={{ mt: 0.8 }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>CATEGORY</Typography>
              <TextField fullWidth select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} sx={{ mt: 0.8 }}>
                <MenuItem value="">— Select —</MenuItem>
                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.icon} {c.name}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={saving}
            sx={{ background: 'linear-gradient(135deg, #4ADE80, #22C55E)', '&:hover': { background: 'linear-gradient(135deg, #86EFAC, #4ADE80)' } }}>
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Add Income'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

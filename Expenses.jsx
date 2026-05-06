import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, TextField, MenuItem,
  IconButton, Avatar, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, Tooltip, Skeleton
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { getExpenses, addExpense, deleteExpense, getCategories } from '../api/axios';
import Layout from '../components/Layout';

const fmt = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const ICONS = ['🍔', '🚗', '🏠', '💊', '🎬', '✈️', '📚', '💪', '🛍️', '⚡', '📱', '🎮'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '', amount: '', date: new Date().toISOString().slice(0, 10),
    icon: '🍔', categoryId: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [expRes, catRes] = await Promise.all([getExpenses(), getCategories()]);
      setExpenses(expRes.data || []);
      const expenseCats = (catRes.data || []).filter(c => c.type === 'EXPENSE' || !c.type);
      setCategories(expenseCats);
    } catch {
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.name || !form.amount) { setError('Name and amount are required.'); return; }
    setSaving(true); setError('');
    try {
      await addExpense({ ...form, amount: parseFloat(form.amount) });
      setOpen(false);
      setForm({ name: '', amount: '', date: new Date().toISOString().slice(0, 10), icon: '🍔', categoryId: '' });
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to add expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await deleteExpense(id); setExpenses(prev => prev.filter(e => e.id !== id)); }
    catch { } finally { setDeleting(null); }
  };

  const filtered = expenses.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase())
  );

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color: '#E2E8F0' }}>
            Expenses
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Current month total: <span style={{ color: '#F87171', fontWeight: 700 }}>{fmt(total)}</span>
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)} sx={{ flexShrink: 0 }}>
          Add Expense
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth placeholder="Search expenses..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchRoundedIcon sx={{ color: '#64748B', mr: 1 }} /> }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Expense List */}
      <Box sx={{
        background: 'rgba(13,21,38,0.8)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden',
      }}>
        {/* Table Header */}
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
          Array.from({ length: 6 }).map((_, i) => (
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
            <ReceiptLongRoundedIcon sx={{ fontSize: 56, color: '#1E3A5F', mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              {search ? 'No matching expenses' : 'No expenses yet'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569' }}>
              {!search && 'Click "Add Expense" to record your first expense'}
            </Typography>
          </Box>
        ) : (
          filtered.map((expense, i) => (
            <Box key={expense.id} sx={{
              display: 'grid', gridTemplateColumns: '1fr 160px 120px 60px',
              px: 3, py: 2, alignItems: 'center', gap: 1,
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.15s',
              '&:hover': { background: 'rgba(255,255,255,0.02)' },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                <Avatar sx={{
                  width: 40, height: 40, borderRadius: 2, fontSize: '1.2rem',
                  background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
                  flexShrink: 0,
                }}>
                  {expense.icon || '💸'}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#E2E8F0' }} noWrap>
                    {expense.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {expense.date ? new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </Typography>
                </Box>
              </Box>
              <Box>
                {expense.categoryName ? (
                  <Chip label={expense.categoryName} size="small" sx={{
                    background: 'rgba(167,139,250,0.12)', color: '#A78BFA',
                    fontSize: '0.72rem', fontWeight: 700, height: 22,
                  }} />
                ) : <Typography variant="caption" sx={{ color: '#475569' }}>—</Typography>}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#F87171', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                -{fmt(expense.amount)}
              </Typography>
              <Box>
                <Tooltip title="Delete">
                  <IconButton
                    size="small" onClick={() => handleDelete(expense.id)}
                    disabled={deleting === expense.id}
                    sx={{ color: '#64748B', '&:hover': { color: '#F87171', background: 'rgba(248,113,113,0.1)' } }}
                  >
                    {deleting === expense.id
                      ? <CircularProgress size={16} sx={{ color: '#F87171' }} />
                      : <DeleteRoundedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Add Expense Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, pb: 1 }}>
          Add Expense
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
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                    background: form.icon === ic ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.04)',
                    border: form.icon === ic ? '2px solid #F87171' : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}>{ic}</Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>NAME</Typography>
              <TextField fullWidth value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Lunch" sx={{ mt: 0.8 }} />
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
              <TextField fullWidth select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} sx={{ mt: 0.8 }} SelectProps={{ displayEmpty: true }}>
                <MenuItem value="">— Select —</MenuItem>
                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.icon} {c.name}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={saving}>
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Add Expense'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

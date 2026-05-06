import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, TextField, MenuItem,
  IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, Tooltip, Tabs, Tab
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { getCategories, saveCategory, updateCategory } from '../api/axios';
import Layout from '../components/Layout';

const ICONS = ['🍔', '🚗', '🏠', '💊', '🎬', '✈️', '📚', '💪', '🛍️', '⚡', '📱', '🎮', '💰', '💼', '📈', '🏦', '🎯', '🌟', '💡', '🏆', '🎁', '🤝', '💎', '🔑', '🍕', '☕', '🎵', '🐾', '🌿', '💄'];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', icon: '🍔', type: 'EXPENSE' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch { setCategories([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', icon: '🍔', type: tab === 0 ? 'EXPENSE' : 'INCOME' });
    setError('');
    setOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, icon: cat.icon || '🍔', type: cat.type || 'EXPENSE' });
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Category name is required.'); return; }
    setSaving(true); setError('');
    try {
      if (editing) {
        await updateCategory(editing.id, form);
      } else {
        await saveCategory(form);
      }
      setOpen(false);
      load();
    } catch (e) {
      setError(e.response?.data?.message || (editing ? 'Failed to update.' : 'Failed to create.'));
    } finally {
      setSaving(false);
    }
  };

  const expenseCats = categories.filter(c => c.type === 'EXPENSE' || c.type === 'expense');
  const incomeCats = categories.filter(c => c.type === 'INCOME' || c.type === 'income');
  const displayed = tab === 0 ? expenseCats : incomeCats;

  const typeColors = {
    EXPENSE: { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', chip: '#F87171', chipBg: 'rgba(248,113,113,0.12)' },
    INCOME: { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)', chip: '#4ADE80', chipBg: 'rgba(74,222,128,0.12)' },
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color: '#E2E8F0' }}>
            Categories
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            {categories.length} categories configured
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAdd}>
          Add Category
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
        mb: 3,
        '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #22D3EE, #A78BFA)', height: 3, borderRadius: 2 },
        '& .MuiTab-root': { color: '#64748B', fontWeight: 700, fontFamily: "'Nunito', sans-serif", textTransform: 'none', fontSize: '0.95rem' },
        '& .Mui-selected': { color: '#E2E8F0' },
      }}>
        <Tab label={`Expenses (${expenseCats.length})`} />
        <Tab label={`Income (${incomeCats.length})`} />
      </Tabs>

      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Box sx={{ background: 'rgba(13,21,38,0.8)', borderRadius: 3, p: 2.5, border: '1px solid rgba(255,255,255,0.06)', height: 100 }} />
            </Grid>
          ))}
        </Grid>
      ) : displayed.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <CategoryRoundedIcon sx={{ fontSize: 64, color: '#1E3A5F', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748B', fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}>
            No {tab === 0 ? 'expense' : 'income'} categories yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', mt: 0.5, mb: 3 }}>
            Create categories to organize your transactions
          </Typography>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAdd}>
            Add Category
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {displayed.map((cat) => {
            const colors = typeColors[cat.type?.toUpperCase()] || typeColors.EXPENSE;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                <Box sx={{
                  background: 'rgba(13,21,38,0.8)', backdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 3, p: 2.5,
                  display: 'flex', alignItems: 'center', gap: 2,
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 12px 30px rgba(0,0,0,0.3)` },
                  position: 'relative',
                }}>
                  <Box sx={{
                    width: 52, height: 52, borderRadius: 2.5, flexShrink: 0,
                    background: colors.bg, border: `1px solid ${colors.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem',
                  }}>
                    {cat.icon || '📂'}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#E2E8F0', fontFamily: "'Bricolage Grotesque', sans-serif" }} noWrap>
                      {cat.name}
                    </Typography>
                    <Chip label={cat.type} size="small" sx={{
                      mt: 0.5, height: 20, fontSize: '0.65rem', fontWeight: 700,
                      background: colors.chipBg, color: colors.chip, border: 'none',
                    }} />
                  </Box>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(cat)} sx={{
                      color: '#64748B',
                      '&:hover': { color: '#22D3EE', background: 'rgba(34,211,238,0.1)' },
                    }}>
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, pb: 1 }}>
          {editing ? 'Edit Category' : 'New Category'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>ICON</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {ICONS.map(ic => (
                  <Box key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))} sx={{
                    width: 40, height: 40, borderRadius: 2, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                    background: form.icon === ic ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.04)',
                    border: form.icon === ic ? '2px solid #22D3EE' : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}>{ic}</Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>NAME</Typography>
              <TextField fullWidth value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Groceries" sx={{ mt: 0.8 }} />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 0.5 }}>TYPE</Typography>
              <TextField fullWidth select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} sx={{ mt: 0.8 }}>
                <MenuItem value="EXPENSE">Expense</MenuItem>
                <MenuItem value="INCOME">Income</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748B' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : editing ? 'Save Changes' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

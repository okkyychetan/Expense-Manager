import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Skeleton, Chip, Avatar
} from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { getDashboard } from '../api/axios';
import StatCard from '../components/StatCard';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const fmt = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <Box sx={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 1.5 }}>
        <Typography variant="caption" sx={{ color: '#64748B' }}>{label}</Typography>
        {payload.map((p) => (
          <Typography key={p.name} variant="body2" sx={{ color: p.color, fontWeight: 700 }}>
            {p.name}: {fmt(p.value)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const MOCK_CHART = [
  { month: 'Jan', income: 45000, expense: 32000 },
  { month: 'Feb', income: 52000, expense: 38000 },
  { month: 'Mar', income: 48000, expense: 29000 },
  { month: 'Apr', income: 61000, expense: 44000 },
  { month: 'May', income: 55000, expense: 36000 },
  { month: 'Jun', income: 67000, expense: 48000 },
];

const PIE_COLORS = ['#22D3EE', '#A78BFA', '#4ADE80', '#FBBF24', '#F87171', '#FB923C'];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const recentTx = data?.recentTransaction || [];
  const categoryBreakdown = data?.categoryBreakdown || [];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800, color: '#E2E8F0',
        }}>
          {getGreeting()}, {user?.fullname?.split(' ')[0] || 'there'} 👋
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
          Here's your financial overview
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Balance"
            value={loading ? '—' : fmt(data?.totalBalance)}
            icon={<AccountBalanceWalletRoundedIcon />}
            color="#22D3EE"
            loading={loading}
            subtitle="Net income - expenses"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Income"
            value={loading ? '—' : fmt(data?.totalIncome)}
            icon={<TrendingUpRoundedIcon />}
            color="#4ADE80"
            loading={loading}
            subtitle="All time"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Expenses"
            value={loading ? '—' : fmt(data?.totalExpense)}
            icon={<TrendingDownRoundedIcon />}
            color="#F87171"
            loading={loading}
            subtitle="All time"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {/* Area Chart */}
        <Grid item xs={12} lg={8}>
          <Box sx={{
            background: 'rgba(13,21,38,0.8)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: 3,
          }}>
            <Typography variant="h6" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: '#E2E8F0', mb: 0.5 }}>
              Income vs Expenses
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>6-month trend</Typography>
            <Box sx={{ mt: 3, height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F87171" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#4ADE80" strokeWidth={2.5} fill="url(#incomeGrad)" dot={{ fill: '#4ADE80', r: 4 }} activeDot={{ r: 6 }} />
                  <Area type="monotone" dataKey="expense" name="Expense" stroke="#F87171" strokeWidth={2.5} fill="url(#expenseGrad)" dot={{ fill: '#F87171', r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Box sx={{
            background: 'rgba(13,21,38,0.8)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: 3, height: '100%',
          }}>
            <Typography variant="h6" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: '#E2E8F0', mb: 0.5 }}>
              Spending by Category
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>This month</Typography>
            <Box sx={{ mt: 2, height: 260 }}>
              {categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                      paddingAngle={4} dataKey="value">
                      {categoryBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend formatter={(v) => <span style={{ color: '#94A3B8', fontSize: 12 }}>{v}</span>} />
                    <Tooltip formatter={(v) => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2
                }}>
                  {/* Placeholder donut */}
                  <Box sx={{
                    width: 120, height: 120, borderRadius: '50%',
                    border: '12px solid rgba(34,211,238,0.15)',
                    borderTop: '12px solid #22D3EE',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Typography variant="caption" sx={{ color: '#64748B', textAlign: 'center', fontSize: '0.7rem' }}>
                      No data yet
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Add expenses to see breakdown
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Box sx={{
        background: 'rgba(13,21,38,0.8)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: 3,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: '#E2E8F0' }}>
              Recent Transactions
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>Latest 10 activity</Typography>
          </Box>
        </Box>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
              <Skeleton variant="circular" width={44} height={44} sx={{ bgcolor: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Skeleton variant="text" width="25%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
              </Box>
              <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
            </Box>
          ))
        ) : recentTx.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontSize: 48, mb: 1 }}>📊</Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>No transactions yet</Typography>
            <Typography variant="caption" sx={{ color: '#475569' }}>Add income or expenses to get started</Typography>
          </Box>
        ) : (
          recentTx.map((tx, i) => {
            const isIncome = tx.type === 'income';
            return (
              <Box key={tx.id || i} sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                py: 1.5, px: 1, borderRadius: 3,
                transition: 'background 0.15s',
                '&:hover': { background: 'rgba(255,255,255,0.03)' },
                borderBottom: i < recentTx.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <Avatar sx={{
                  width: 44, height: 44, borderRadius: 2.5, fontSize: '1.3rem',
                  background: isIncome ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                  border: `1px solid ${isIncome ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
                }}>
                  {tx.icon || (isIncome ? '💰' : '💸')}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#E2E8F0', noWrap: true }}>
                    {tx.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {tx.date ? new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{
                    fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif",
                    color: isIncome ? '#4ADE80' : '#F87171',
                  }}>
                    {isIncome ? '+' : '-'}{fmt(tx.amount)}
                  </Typography>
                  <Chip
                    label={tx.type}
                    size="small"
                    sx={{
                      height: 18, fontSize: '0.65rem', fontWeight: 700,
                      background: isIncome ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                      color: isIncome ? '#4ADE80' : '#F87171',
                      border: 'none',
                    }}
                  />
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Layout>
  );
}

import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';

const StatCard = ({ title, value, icon, color, loading, subtitle }) => (
  <Box sx={{
    background: 'rgba(13,21,38,0.8)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${color}22`,
    borderRadius: 4,
    p: 3,
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 20px 40px ${color}18`,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 3,
      background: `linear-gradient(90deg, ${color}, ${color}44)`,
      borderRadius: '4px 4px 0 0',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: -30, right: -30,
      width: 120, height: 120,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}18, transparent 70%)`,
      pointerEvents: 'none',
    },
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.72rem' }}>
          {title}
        </Typography>
        {loading ? (
          <Skeleton variant="text" width={120} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        ) : (
          <Typography variant="h4" sx={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800, color: '#E2E8F0', mt: 0.5, lineHeight: 1.2,
          }}>
            {value}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#64748B', mt: 0.5, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{
        width: 52, height: 52, borderRadius: 3,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color, fontSize: 26,
        flexShrink: 0,
      }}>
        {icon}
      </Box>
    </Box>
  </Box>
);

export default StatCard;

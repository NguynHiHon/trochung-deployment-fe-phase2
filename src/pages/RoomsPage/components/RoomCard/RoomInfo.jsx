import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';

const RoomInfo = ({ room, handleViewDetails }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        height: '100%',
        alignSelf: 'stretch',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ flex: 1, pl: { xs: 0, sm: 1 }, minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.4, fontSize: { md: 16, lg: 16 } }}>
          {room.title}
        </Typography>
        <Stack direction="row" spacing={1.4} sx={{ mb: 0.5, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
            {room.price} {room.unit}
          </Typography>
          <Typography variant="body2">{room.area} m²</Typography>
          <Typography variant="body2">{room.beds || 0}pn</Typography>
          <Typography variant="body2">{room.baths || 0}wc</Typography>
        </Stack>
        <Stack direction="row" spacing={0.8} sx={{ mb: 0.5, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            {room.district}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ,
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {room.city}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: { xs: 1, sm: 'auto' }, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleViewDetails(room.id)}
            sx={{
              ml: { xs: 0, sm: 'auto' },
              textTransform: 'none',
              fontSize: '12px',
              minWidth: 'auto',
              px: 2,
              width: { xs: '100%', sm: 'auto' },
              display: { xs: 'block', sm: 'inline-block' }
            }}
          >
            Xem chi tiết
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {/* Người đăng */}
          <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                bgcolor: '#ff6f00',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}
            >
              {room.author?.charAt(0) || 'N'}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {room.author}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ minWidth: 130, textAlign: 'right' }}>{/* Reserved space */}</Box>
    </Box>
  );
};

export default RoomInfo;

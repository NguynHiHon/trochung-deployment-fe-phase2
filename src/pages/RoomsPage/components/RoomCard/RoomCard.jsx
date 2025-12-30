import React from 'react';
import { Paper, Grid } from '@mui/material';
import RoomImage from './RoomImage';
import RoomInfo from './RoomInfo';

const RoomCard = ({ room, favorites, toggleFavorite, handleViewDetails }) => {
  return (
    <Paper key={room.id} variant="outlined" sx={{ p: 1.6, borderRadius: 2, minHeight: 160 }}>
      <Grid
        container
        spacing={0.8}
        alignItems="flex-start"
        sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}
      >
        <Grid item xs={12} sm={4} sx={{ display: 'flex', flex: '0 0 auto' }}>
          <RoomImage room={room} favorites={favorites} toggleFavorite={toggleFavorite} />
        </Grid>
        <Grid item xs={12} sm={8} sx={{ display: 'flex', minWidth: 0 }}>
          <RoomInfo room={room} handleViewDetails={handleViewDetails} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RoomCard;

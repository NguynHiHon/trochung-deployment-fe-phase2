import React from 'react';
import { Typography, Grid, Button } from '@mui/material';
import { FEATURE_OPTIONS } from '../../constants/filterOptions';

const FeatureFilter = ({ selectedFeatures, setSelectedFeatures }) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Đặc điểm nổi bật</Typography>
      <Grid container spacing={1}>
        {FEATURE_OPTIONS.map((f) => (
          <Grid item key={f}>
            <Button
              size="small"
              variant={selectedFeatures.includes(f) ? 'contained' : 'outlined'}
              onClick={() =>
                setSelectedFeatures((prev) =>
                  prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
                )
              }
              sx={{ borderRadius: 3 }}
            >
              {f}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default FeatureFilter;

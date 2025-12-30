import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CategoryFilter from './CategoryFilter';
import LocationFilter from './LocationFilter';
import PriceRangeFilter from './PriceRangeFilter';
import FeatureFilter from './FeatureFilter';

const FilterDialog = ({
  openFilter,
  closeFilterOverlay,
  selectedCategory,
  setSelectedCategory,
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
  selectedWard,
  setSelectedWard,
  provinceEl,
  setProvinceEl,
  districtEl,
  setDistrictEl,
  wardEl,
  setWardEl,
  provinceOptions,
  districtOptions,
  wardOptions,
  selectedPriceKey,
  setSelectedPriceKey,
  draftPrice,
  setDraftPrice,
  selectedFeatures,
  setSelectedFeatures,
  clearAllFilters,
  applyFilters,
  setSearchParams
}) => {
  const handleClearAll = () => {
    clearAllFilters();
    setSearchParams(new URLSearchParams({ page: '1' }));
  };

  return (
    <Dialog open={openFilter} onClose={closeFilterOverlay} fullWidth maxWidth="md">
      <DialogTitle>Bộ lọc</DialogTitle>
      <DialogContent dividers>
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <LocationFilter
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedWard={selectedWard}
          setSelectedWard={setSelectedWard}
          provinceEl={provinceEl}
          setProvinceEl={setProvinceEl}
          districtEl={districtEl}
          setDistrictEl={setDistrictEl}
          wardEl={wardEl}
          setWardEl={setWardEl}
          provinceOptions={provinceOptions}
          districtOptions={districtOptions}
          wardOptions={wardOptions}
        />
        <PriceRangeFilter
          selectedPriceKey={selectedPriceKey}
          setSelectedPriceKey={setSelectedPriceKey}
          draftPrice={draftPrice}
          setDraftPrice={setDraftPrice}
        />
        <FeatureFilter
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClearAll}>
          Xóa tất cả bộ lọc
        </Button>
        <Button onClick={closeFilterOverlay}>Đóng</Button>
        <Button variant="contained" onClick={applyFilters}>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;

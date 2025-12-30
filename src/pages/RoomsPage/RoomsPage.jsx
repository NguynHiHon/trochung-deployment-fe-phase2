import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, Menu, MenuItem, Stack, Chip, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '../../Components/ToastProvider';
import { useRooms } from './hooks/useRooms';
import { useFavorites } from './hooks/useFavorites';
import { useFilters } from './hooks/useFilters';
import FilterSidebar from './components/FilterSidebar/FilterSidebar';
import FilterDialog from './components/FilterDialog/FilterDialog';
import RoomList from './components/RoomList/RoomList';
import { DEFAULT_PAGE_SIZE } from './constants/filterOptions';
import Grid from '@mui/material/GridLegacy';
const RoomsPage = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((s) => s?.auth?.login?.accessToken);
  const { showToast } = useToast();
  
  // ==================== STATE MANAGEMENT ====================
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);

  // Custom hooks
  const { rooms, total, page, setPage, searchParams, setSearchParams } = useRooms(sort);
  const { favorites, toggleFavorite } = useFavorites(showToast);
  const {
    filters,
    setFilters,
    draftPrice,
    setDraftPrice,
    draftArea,
    setDraftArea,
    draftTypes,
    setDraftTypes,
    draftTrusts,
    setDraftTrusts,
    applyPrice,
    applyArea,
    applyTypes,
    applyTrusts,
    toggleType,
    clearAllFilters
  } = useFilters();

  // Filter Dialog State
  const [selectedCategory, setSelectedCategory] = useState('Phòng trọ');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedWardCode, setSelectedWardCode] = useState('');
  const [provinceEl, setProvinceEl] = useState(null);
  const [districtEl, setDistrictEl] = useState(null);
  const [wardEl, setWardEl] = useState(null);
  const [selectedPriceKey, setSelectedPriceKey] = useState('all');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  
  // API Data State
  const [provinces] = useState([
    { code: 1, name: 'Hà Nội' },
    { code: 79, name: 'TP. Hồ Chí Minh' }
  ]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // ==================== LOCATION OPTIONS ====================
  // Load districts when province is selected
  useEffect(() => {
    if (!selectedProvinceCode) {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict('');
      setSelectedDistrictCode('');
      setSelectedWard('');
      setSelectedWardCode('');
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoadingDistricts(true);
        const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvinceCode}?depth=2`);
        if (response.ok) {
          const data = await response.json();
          setDistricts(data.districts || []);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
        showToast('Không thể tải danh sách quận/huyện', 'error');
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [selectedProvinceCode, showToast]);

  // Load wards when district is selected
  useEffect(() => {
    if (!selectedDistrictCode) {
      setWards([]);
      setSelectedWard('');
      setSelectedWardCode('');
      return;
    }

    const fetchWards = async () => {
      try {
        setLoadingWards(true);
        const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`);
        if (response.ok) {
          const data = await response.json();
          setWards(data.wards || []);
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
        showToast('Không thể tải danh sách phường/xã', 'error');
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [selectedDistrictCode, showToast]);

  // ==================== PAGINATION ====================
  const totalPages = Math.max(1, Math.ceil((total || 0) / DEFAULT_PAGE_SIZE));
  const currentItems = rooms;

  const handlePageChange = (_e, value) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('page', String(value));
    setSearchParams(next);
  };

  // ==================== HANDLERS ====================
  const handleSortChange = (_e, value) => {
    if (value) setSort(value);
  };

  const openPriceMenu = (e) => setAnchorEl(e.currentTarget);
  const closePriceMenu = () => setAnchorEl(null);
  const openLocationMenu = (e) => setLocationAnchorEl(e.currentTarget);
  const closeLocationMenu = () => setLocationAnchorEl(null);
  const openFilterOverlay = () => setOpenFilter(true);
  const closeFilterOverlay = () => setOpenFilter(false);

  const handleProvinceSelect = (provinceCode, provinceName, isFromDialog = false) => {
    setSelectedProvinceCode(provinceCode);
    setSelectedProvince(provinceName);
    setSelectedDistrict('');
    setSelectedDistrictCode('');
    setSelectedWard('');
    setSelectedWardCode('');
    
    // Auto-apply filter if not from dialog
    if (!isFromDialog) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('page', '1');
      if (provinceName) sp.set('city', provinceName);
      else sp.delete('city');
      sp.delete('district');
      sp.delete('ward');
      setSearchParams(sp);
      setPage(1);
    }
  };

  const handleDistrictSelect = (districtCode, districtName, isFromDialog = false) => {
    setSelectedDistrictCode(districtCode);
    setSelectedDistrict(districtName);
    setSelectedWard('');
    setSelectedWardCode('');
    
    // Auto-apply filter if not from dialog
    if (!isFromDialog) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('page', '1');
      if (districtName) sp.set('district', districtName);
      else sp.delete('district');
      sp.delete('ward');
      setSearchParams(sp);
      setPage(1);
    }
  };

  const handleWardSelect = (wardCode, wardName, isFromDialog = false) => {
    setSelectedWardCode(wardCode);
    setSelectedWard(wardName);
    
    // Auto-apply filter if not from dialog
    if (!isFromDialog) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set('page', '1');
      if (wardName) sp.set('ward', wardName);
      else sp.delete('ward');
      setSearchParams(sp);
      setPage(1);
    }
  };

  const clearLocation = (isFromDialog = false) => {
    setSelectedProvince('');
    setSelectedProvinceCode('');
    setSelectedDistrict('');
    setSelectedDistrictCode('');
    setSelectedWard('');
    setSelectedWardCode('');
    setDistricts([]);
    setWards([]);
    
    // Auto-apply filter if not from dialog
    if (!isFromDialog) {
      const sp = new URLSearchParams(searchParams.toString());
      sp.delete('city');
      sp.delete('district');
      sp.delete('ward');
      setSearchParams(sp);
      setPage(1);
    }
  };

  const handleViewDetails = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const applyFilters = () => {
    setFilters((f) => ({
      ...f,
      price: draftPrice,
      area: draftArea,
      types: draftTypes,
      trusts: draftTrusts
    }));
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', '1');
    if (search) sp.set('search', search);
    else sp.delete('search');
    if (draftPrice && draftPrice.length === 2) {
      sp.set('minPrice', String(draftPrice[0]));
      sp.set('maxPrice', String(draftPrice[1]));
    }
    if (draftArea && draftArea.length === 2) {
      sp.set('minArea', String(draftArea[0]));
      sp.set('maxArea', String(draftArea[1]));
    }
    if (draftTypes && draftTypes.length) sp.set('types', draftTypes.join(','));
    else sp.delete('types');
    if (selectedProvince) sp.set('city', selectedProvince);
    else sp.delete('city');
    if (selectedDistrict) sp.set('district', selectedDistrict);
    else sp.delete('district');
    if (selectedWard) sp.set('ward', selectedWard);
    else sp.delete('ward');
    setSearchParams(sp);
    setPage(1);
    closeFilterOverlay();
  };

  const clearAllFiltersAndReset = () => {
    clearAllFilters();
    setSelectedCategory('Phòng trọ');
    setSelectedPriceKey('all');
    setSelectedFeatures([]);
    clearLocation();
    setPage(1);
  };

  // ==================== RENDER BLOCKS ====================
  
  // Block 1: FilterFeature Component (Sidebar Desktop)
  const renderFilterFeature = () => (
    <Grid
      item
      xs={12}
      lg={2.5}

      sx={{
        display: { xs: 'none', lg: 'block' },
        '@media (max-width:1112px)': { display: 'none' },
      }}
    >
      <FilterSidebar
        draftPrice={draftPrice}
        setDraftPrice={setDraftPrice}
        draftArea={draftArea}
        setDraftArea={setDraftArea}
        draftTypes={draftTypes}
        draftTrusts={draftTrusts}
        setDraftTrusts={setDraftTrusts}
        applyPrice={applyPrice}
        applyArea={applyArea}
        toggleType={toggleType}
        applyTypes={applyTypes}
        applyTrusts={applyTrusts}
      />
    </Grid>
  );

  // Block 2: DialogFilter Component (Mobile/Tablet)
  const renderDialogFilter = () => (
    <FilterDialog
      openFilter={openFilter}
      closeFilterOverlay={closeFilterOverlay}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      selectedProvince={selectedProvince}
      selectedProvinceCode={selectedProvinceCode}
      setSelectedProvince={setSelectedProvince}
      setSelectedProvinceCode={setSelectedProvinceCode}
      selectedDistrict={selectedDistrict}
      selectedDistrictCode={selectedDistrictCode}
      setSelectedDistrict={setSelectedDistrict}
      setSelectedDistrictCode={setSelectedDistrictCode}
      selectedWard={selectedWard}
      selectedWardCode={selectedWardCode}
      setSelectedWard={setSelectedWard}
      setSelectedWardCode={setSelectedWardCode}
      provinceEl={provinceEl}
      setProvinceEl={setProvinceEl}
      districtEl={districtEl}
      setDistrictEl={setDistrictEl}
      wardEl={wardEl}
      setWardEl={setWardEl}
      provinces={provinces}
      districts={districts}
      wards={wards}
      loadingDistricts={loadingDistricts}
      loadingWards={loadingWards}
      handleProvinceSelect={handleProvinceSelect}
      handleDistrictSelect={handleDistrictSelect}
      handleWardSelect={handleWardSelect}
      selectedPriceKey={selectedPriceKey}
      setSelectedPriceKey={setSelectedPriceKey}
      draftPrice={draftPrice}
      setDraftPrice={setDraftPrice}
      selectedFeatures={selectedFeatures}
      setSelectedFeatures={setSelectedFeatures}
      clearAllFilters={clearAllFiltersAndReset}
      applyFilters={applyFilters}
      setSearchParams={setSearchParams}
    />
  );

  // Block 3: ListRoomPage Component (Main Content)
  const renderListRoomPage = () => (
    <Grid
      item
      xs={12}
      lg={7}
      sx={{
        mx:{ xs: 0, md:2 , lg:2},
        '@media (max-width:1112px)': { px: 2 }
      }}
    >
      <Box sx={{ width: '100%', py: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: 'text.primary'
            }}
          >
            Tìm phòng trọ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tìm kiếm trong {total} phòng trọ
          </Typography>
        </Box>

        {/* Search & Sort Toolbar */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 2, 
          mb: 3, 
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* First Row: Filter, Search, Sort */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            flexWrap: 'wrap'
          }}>
            {/* Filter Button (All Screens) */}
            <ToggleButton
              value="filter"
              selected={openFilter}
              onClick={openFilterOverlay}
              sx={{ 
                borderRadius: 2, 
                px: 2
              }}
            >
              <FilterAltOutlinedIcon sx={{ mr: 0.5 }} />
              Lọc
            </ToggleButton>

            {/* Search Bar */}
            <TextField
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              size="small"
              placeholder="Tìm kiếm phòng trọ..."
              sx={{
                flexGrow: 1, // Chiếm lấy khoảng trống giữa Filter và Sort
                flex: { xs: '1 1 100%', sm: '1 1 auto' },
                minWidth: { xs: '100%', sm: 240 },
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                )
              }}
            />

            {/* Sort Buttons */}
            <ToggleButtonGroup
            value={sort}
            exclusive
            onChange={handleSortChange}
            size="small"
            sx={{ 
              ml: { sm: 'auto' },
              '& .MuiToggleButton-root': {
                px: 2,
                textTransform: 'none'
              }
            }}
          >
            <ToggleButton value="popular">Phổ biến</ToggleButton>
            <ToggleButton value="newest">Mới nhất</ToggleButton>
            <ToggleButton value="price" onClick={openPriceMenu}>
              Giá <ExpandMoreIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closePriceMenu}>
            <MenuItem onClick={() => { setSort('priceAsc'); closePriceMenu(); }}>
              Giá tăng dần
            </MenuItem>
            <MenuItem onClick={() => { setSort('priceDesc'); closePriceMenu(); }}>
              Giá giảm dần
            </MenuItem>
          </Menu>
          </Box>

          {/* Second Row: Location Filter */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            flexWrap: 'wrap'
          }}>
            {/* Province Selection */}
            <Button
              variant="outlined"
              size="small"
              onClick={openLocationMenu}
              endIcon={<ExpandMoreIcon />}
              startIcon={<LocationOnIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 2,
                whiteSpace: 'nowrap'
              }}
            >
              {selectedProvince || 'Chọn tỉnh/thành'}
            </Button>

            <Menu 
              anchorEl={locationAnchorEl} 
              open={Boolean(locationAnchorEl)} 
              onClose={closeLocationMenu}
              PaperProps={{
                sx: { maxHeight: 400 }
              }}
            >
              <MenuItem 
                onClick={() => { 
                  clearLocation(false);
                  closeLocationMenu(); 
                }}
                selected={!selectedProvince}
              >
                Tất cả
              </MenuItem>
              {provinces.map((province) => (
                <MenuItem 
                  key={province.code}
                  onClick={() => { 
                    handleProvinceSelect(province.code, province.name, false);
                    closeLocationMenu(); 
                  }}
                  selected={selectedProvinceCode === province.code}
                >
                  {province.name}
                </MenuItem>
              ))}
            </Menu>

            {/* District Selection */}
            {selectedProvince && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => setDistrictEl(e.currentTarget)}
                  endIcon={<ExpandMoreIcon />}
                  disabled={loadingDistricts || districts.length === 0}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 2,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {loadingDistricts ? 'Đang tải...' : (selectedDistrict || 'Chọn quận/huyện')}
                </Button>

                <Menu 
                  anchorEl={districtEl} 
                  open={Boolean(districtEl)} 
                  onClose={() => setDistrictEl(null)}
                  PaperProps={{
                    sx: { maxHeight: 400 }
                  }}
                >
                  <MenuItem 
                    onClick={() => { 
                      setSelectedDistrict('');
                      setSelectedDistrictCode('');
                      setSelectedWard('');
                      setSelectedWardCode('');
                      setDistrictEl(null);
                      // Apply filter
                      const sp = new URLSearchParams(searchParams.toString());
                      sp.delete('district');
                      sp.delete('ward');
                      setSearchParams(sp);
                    }}
                    selected={!selectedDistrict}
                  >
                    Tất cả
                  </MenuItem>
                  {districts.map((district) => (
                    <MenuItem 
                      key={district.code}
                      onClick={() => { 
                        handleDistrictSelect(district.code, district.name, false);
                        setDistrictEl(null);
                      }}
                      selected={selectedDistrictCode === district.code}
                    >
                      {district.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            {/* Ward Selection */}
            {selectedDistrict && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => setWardEl(e.currentTarget)}
                  endIcon={<ExpandMoreIcon />}
                  disabled={loadingWards || wards.length === 0}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 2,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {loadingWards ? 'Đang tải...' : (selectedWard || 'Chọn phường/xã')}
                </Button>

                <Menu 
                  anchorEl={wardEl} 
                  open={Boolean(wardEl)} 
                  onClose={() => setWardEl(null)}
                  PaperProps={{
                    sx: { maxHeight: 400 }
                  }}
                >
                  <MenuItem 
                    onClick={() => { 
                      setSelectedWard('');
                      setSelectedWardCode('');
                      setWardEl(null);
                      // Apply filter
                      const sp = new URLSearchParams(searchParams.toString());
                      sp.delete('ward');
                      setSearchParams(sp);
                    }}
                    selected={!selectedWard}
                  >
                    Tất cả
                  </MenuItem>
                  {wards.map((ward) => (
                    <MenuItem 
                      key={ward.code}
                      onClick={() => { 
                        handleWardSelect(ward.code, ward.name, false);
                        setWardEl(null);
                      }}
                      selected={selectedWardCode === ward.code}
                    >
                      {ward.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Box>

        {/* Active Filters - Always show */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {/* Location Filter Chips */}
          {selectedProvince && (
            <Chip 
              label={selectedProvince}
              size="small"
              color="secondary" 
              variant="outlined"
              onDelete={() => clearLocation()}
            />
          )}
          {selectedDistrict && (
            <Chip 
              label={selectedDistrict}
              size="small"
              color="secondary" 
              variant="outlined"
              onDelete={() => {
                setSelectedDistrict('');
                setSelectedDistrictCode('');
                setSelectedWard('');
                setSelectedWardCode('');
              }}
            />
          )}
          {selectedWard && (
            <Chip 
              label={selectedWard}
              size="small"
              color="secondary" 
              variant="outlined"
              onDelete={() => {
                setSelectedWard('');
                setSelectedWardCode('');
              }}
            />
          )}
          
          {/* Type Filters */}
          {filters.types.map((t) => (
            <Chip 
              key={t} 
              label={t} 
              size="small"
              color="primary" 
              variant="outlined"
            />
          ))}
          
          {/* Price Filter - Always show */}
          <Chip 
            label={filters.price[1] >= 20 ? 'Tất cả mức giá' : `Giá ≤ ${filters.price[1]}tr`}
            size="small"
            color={filters.price[1] < 20 ? 'success' : 'default'}
            variant="outlined"
          />
          
          {/* Area Filter - Always show */}
          <Chip 
            label={filters.area[1] >= 150 ? 'Tất cả diện tích' : `DT ≤ ${filters.area[1]}m²`}
            size="small"
            color={filters.area[1] < 150 ? 'info' : 'default'}
            variant="outlined"
          />
          
          {/* Trust Level Filters */}
          {filters.trusts.vip && (
            <Chip label="VIP" size="small" color="warning" variant="outlined" />
          )}
          {filters.trusts.verified && (
            <Chip label="Đã xác minh" size="small" color="success" variant="outlined" />
          )}
        </Stack>

        {/* Room List */}
        <RoomList
          currentItems={currentItems}
          filters={filters}
          total={total}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          handleViewDetails={handleViewDetails}
          totalPages={totalPages}
          page={page}
          handlePageChange={handlePageChange}
        />
        
      </Box>
    </Grid>
  );

  return (
    <Box sx={{ 
      bgcolor: '#fafafa', 
      minHeight: 'calc(100vh - 70px)', 
      width: '100%', 
      m: 0, 
      p: 0 
    }}>
      <Grid container spacing={3} sx={{ width: '100%', px: { xs: 2, lg: 0 } }}>
        {/* BLOCK 1: FilterFeature - Sidebar (Desktop Only) */}
        {renderFilterFeature()}

        {/* BLOCK 3: ListRoomPage - Main Content */}
        {renderListRoomPage()}
      </Grid>

      {/* BLOCK 2: DialogFilter - Mobile Filter Dialog */}
      {renderDialogFilter()}
    </Box>
  );
};

export default RoomsPage;

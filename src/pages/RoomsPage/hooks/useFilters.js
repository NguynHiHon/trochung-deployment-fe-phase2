import { useState } from 'react';
import { DEFAULT_FILTERS } from '../constants/filterOptions';

export const useFilters = () => {
    // Bộ lọc chính đang áp dụng
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    // State tạm cho UI (chỉ áp dụng khi bấm "Áp dụng")
    const [draftPrice, setDraftPrice] = useState([0, 20]);
    const [draftArea, setDraftArea] = useState([0, 150]);
    const [draftTypes, setDraftTypes] = useState([]);
    const [draftTrusts, setDraftTrusts] = useState({ vip: false, verified: false, normal: true });

    const applyPrice = () => setFilters((f) => ({ ...f, price: draftPrice }));
    const applyArea = () => setFilters((f) => ({ ...f, area: draftArea }));
    const applyTypes = () => setFilters((f) => ({ ...f, types: draftTypes }));
    const applyTrusts = () => setFilters((f) => ({ ...f, trusts: draftTrusts }));

    const toggleType = (type) => {
        setDraftTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
    };

    const clearAllFilters = () => {
        setDraftPrice([0, 20]);
        setDraftArea([0, 150]);
        setDraftTypes([]);
        setDraftTrusts({ vip: false, verified: false, normal: true });
        setFilters(DEFAULT_FILTERS);
    };

    return {
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
    };
};

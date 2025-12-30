import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchRooms } from '../../../services/api/postApi';
import { DEFAULT_PAGE_SIZE } from '../constants/filterOptions';

export const useRooms = (sort) => {
    const [rooms, setRooms] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const loadPage = async () => {
            try {
                const pageParam = parseInt(searchParams.get('page')) || 1;
                const limitParam = parseInt(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;
                const searchQ = searchParams.get('search') || '';
                const searchType = searchParams.get('searchType') || 'title';
                const minPrice = searchParams.get('minPrice');
                const maxPrice = searchParams.get('maxPrice');
                const minArea = searchParams.get('minArea');
                const maxArea = searchParams.get('maxArea');
                const city = searchParams.get('city');
                const district = searchParams.get('district');
                const ward = searchParams.get('ward');
                const types = searchParams.get('types');
                const sortQ = searchParams.get('sort') || sort;

                const res = await fetchRooms({
                    page: pageParam,
                    limit: limitParam,
                    search: searchQ,
                    searchType,
                    minPrice,
                    maxPrice,
                    minArea,
                    maxArea,
                    city,
                    district,
                    ward,
                    types,
                    sort: sortQ
                });

                if (res && res.success) {
                    setRooms(Array.isArray(res.rooms) ? res.rooms : []);
                    setTotal(Number(res.total) || 0);
                    setPage(pageParam);
                } else {
                    setRooms([]);
                    setTotal(0);
                }
            } catch (err) {
                console.error('Error loading paged rooms', err);
                setRooms([]);
                setTotal(0);
            }
        };
        loadPage();
    }, [searchParams, sort]);

    return {
        rooms,
        total,
        page,
        setPage,
        searchParams,
        setSearchParams
    };
};

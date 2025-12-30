import { useState, useEffect } from 'react';
import { FavoriteApi } from '../../../services/api';
import { MAX_FAVORITES } from '../constants/filterOptions';

export const useFavorites = (showToast) => {
    const [favorites, setFavorites] = useState(new Set());

    // Load favorites từ backend khi component mount
    useEffect(() => {
        (async () => {
            try {
                const res = await FavoriteApi.getMyFavorites();
                const ids = (res?.favorites || []).map(f => String(f.room?._id || f.clientRoomId || f.room));
                setFavorites(new Set(ids));
                localStorage.setItem('favoriteRoomIds', JSON.stringify(ids));
            } catch (err) {
                console.error('Error loading favorites:', err);
            }
        })();
    }, []);

    const saveFavorites = (setObj) => {
        const arr = Array.from(setObj);
        localStorage.setItem('favoriteRoomIds', JSON.stringify(arr));
    };

    const toggleFavorite = (id) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                FavoriteApi.removeFavorite(id).catch(() => { });
            } else {
                if (next.size >= MAX_FAVORITES) {
                    showToast(`Bạn chỉ có thể lưu tối đa ${MAX_FAVORITES} phòng yêu thích.`, 'warning');
                    return prev;
                }
                next.add(id);
                FavoriteApi.addFavorite(id).catch(() => { });
            }
            saveFavorites(next);
            try {
                window.dispatchEvent(new Event('favoritesUpdated'));
            } catch (err) {
                console.error('Error dispatching favoritesUpdated event:', err);
            }
            return next;
        });
    };

    return { favorites, toggleFavorite };
};

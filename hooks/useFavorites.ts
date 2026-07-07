// hooks/useFavorites.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@omnishop:favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) {
          const parsed: number[] = JSON.parse(value);
          setFavoriteIds(new Set(parsed));
        }
      })
      .catch((e) => console.error('[useFavorites] load error', e));
  }, []);

  const persist = useCallback(async (ids: Set<number>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    } catch (e) {
      console.error('[useFavorites] persist error', e);
    }
  }, []);

  const toggleFavorite = useCallback(
    (id: number) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isFavorite = useCallback((id: number) => favoriteIds.has(id), [favoriteIds]);

  return { favoriteIds, isFavorite, toggleFavorite };
}

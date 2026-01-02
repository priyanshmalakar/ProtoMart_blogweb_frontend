import { create } from 'zustand';

const usePhotoStore = create((set) => ({
  selectedPhoto: null,
  filterStatus: 'all',
  viewMode: 'grid', // 'grid' or 'list'

  setSelectedPhoto: (photo) => set({ selectedPhoto: photo }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setViewMode: (mode) => set({ viewMode: mode }),
  clearSelectedPhoto: () => set({ selectedPhoto: null })
}));

export default usePhotoStore;
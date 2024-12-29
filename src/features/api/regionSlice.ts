import { apiSlice } from "./apiSlice";

interface AddWineRegionData {
  region: string;
  subRegions: string[];
}

interface UpdateWineRegionData {
  id: string;
  region: string;
  subRegions: string[];
}

interface DeleteWineRegionData {
  id: string;
}

export const regionSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWineRegion: builder.mutation<void, AddWineRegionData>({
      query: ({ region, subRegions }) => ({
        url: `/wineRegions/add`,
        method: "POST",
        body: { region, subRegions },
      }),
    }),

    updateWineRegion: builder.mutation<void, UpdateWineRegionData>({
      query: ({ id, region, subRegions }) => ({
        url: `/wineRegions/update/${id}`,
        method: "PUT",
        body: { region, subRegions },
      }),
    }),

    deleteWineRegion: builder.mutation<void, DeleteWineRegionData>({
      query: ({ id }) => ({
        url: `/wineRegions/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddWineRegionMutation,
  useUpdateWineRegionMutation,
  useDeleteWineRegionMutation,
} = regionSlice;

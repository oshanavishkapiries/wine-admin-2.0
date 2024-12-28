import { apiSlice } from "./apiSlice";

interface UpdateMarginData {
  id: string;
  margin: number;
}

interface AddSubCategoryData {
  id: string;
  subCategoryName: string;
}

interface UpdateSubCategoryNameData {
  id: string;
  name: string;
}

interface DeleteSubCategoryData {
  id: string;
}

export const categorySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateCategoryMargin: builder.mutation<void, UpdateMarginData>({
      query: ({ id, margin }) => ({
        url: `/wine-categories/${id}/margin`,
        method: "PUT",
        body: { margin },
      }),
     
    }),

    addSubCategory: builder.mutation<void, AddSubCategoryData>({
      query: ({ id, subCategoryName }) => ({
        url: `/wine-categories/${id}/addSubcategories`,
        method: "POST",
        body: { subCategoryName },
      }),
     
    }),

    updateSubCategoryName: builder.mutation<void, UpdateSubCategoryNameData>({
      query: ({ id, name }) => ({
        url: `/wine-categories/${id}/subCategoryName`,
        method: "PUT",
        body: { name },
      }),
     
    }),

    deleteSubCategory: builder.mutation<void, DeleteSubCategoryData>({
      query: ({ id }) => ({
        url: `/wine-categories/${id}`,
        method: "DELETE",
      }),
     
    }),
  }),
});

export const {
  useUpdateCategoryMarginMutation,
  useAddSubCategoryMutation,
  useUpdateSubCategoryNameMutation,
  useDeleteSubCategoryMutation,
} = categorySlice;

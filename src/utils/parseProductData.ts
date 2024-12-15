interface Category {
    name: string;
  }
  
  interface NamedEntity {
    name: string;
  }
  
  interface DataObject {
    name?: string;
    description?: string;
    unitPrice?: number;
    rating?: number;
    categories?: Category[];
    subCategories?: Category[];
    vintage?: NamedEntity;
    dryness?: NamedEntity;
    sizeTypes?: NamedEntity[];
    collectables?: NamedEntity[];
    regions?: NamedEntity[];
    subRegions?: NamedEntity[];
    image?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  interface ParsedData {
    name: string;
    description: string;
    unitPrice: number;
    rating: number;
    categories: string[];
    subCategories: string[];
    vintage: string;
    dryness: string;
    sizeTypes: string[];
    collectables: string[];
    regions: string[];
    subRegions: string[];
    image: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export function parseProductData(dataObject: DataObject): ParsedData {
    return {
      name: dataObject?.name || '',
      description: dataObject?.description || '',
      unitPrice: dataObject?.unitPrice || 0,
      rating: dataObject?.rating || 0,
      categories: dataObject?.categories?.map(cat => cat.name) || [],
      subCategories: dataObject?.subCategories?.map(subCat => subCat.name) || [],
      vintage: dataObject?.vintage?.name || '',
      dryness: dataObject?.dryness?.name || '',
      sizeTypes: dataObject?.sizeTypes?.map(size => size.name) || [],
      collectables: dataObject?.collectables?.map(col => col.name) || [],
      regions: dataObject?.regions?.map(region => region.name) || [],
      subRegions: dataObject?.subRegions?.map(subRegion => subRegion.name) || [],
      image: dataObject?.image || '',
      createdAt: dataObject?.createdAt || '',
      updatedAt: dataObject?.updatedAt || ''
    };
  }
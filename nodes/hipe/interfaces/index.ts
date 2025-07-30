// Common interfaces for HIPE API integration

export interface IHIPEApiCredentials {
  apiUrl: string;
  apiToken: string;
}

export interface IHIPEApiRequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  qs?: Record<string, string | number | boolean>;
  body?: Record<string, any>;
  url: string;
}

export interface IHIPEApiResponse {
  [key: string]: any;
}

export interface IHIPEPaginationOptions {
  page?: number;
  itemsPerPage?: number;
  order?: Record<string, 'asc' | 'desc'>;
  filters?: Record<string, any>;
  [key: string]: any;
}

// Resource specific interfaces

// Corrugated Materials
export interface ICorrugatedMaterial {
  id?: string;
  name: string;
  description?: string;
  [key: string]: any;
}

// Corrugated Material Compositions
export interface ICorrugatedMaterialComposition {
  id?: string;
  corrugatedMaterial?: string;
  flute?: string;
  liners?: string[];
  [key: string]: any;
}

// Corrugated Material Composition Prices
export interface ICorrugatedMaterialCompositionPrice {
  id?: string;
  corrugatedMaterialComposition: string;
  price: number;
  currency: string;
  validFrom?: string;
  validTo?: string;
  [key: string]: any;
}

// Corrugated Formats
export interface ICorrugatedFormat {
  id?: string;
  width: number;
  length: number;
  [key: string]: any;
}

// Corrugated Suppliers
export interface ICorrugatedSupplier {
  id?: string;
  name: string;
  contactInfo?: string;
  [key: string]: any;
}

// Corrugated Flutes
export interface ICorrugatedFlute {
  id?: string;
  name: string;
  height?: number;
  [key: string]: any;
}

// Corrugated Liners
export interface ICorrugatedLiner {
  id?: string;
  name: string;
  weight?: number;
  [key: string]: any;
}

// Projects
export interface IProject {
  id?: string;
  name: string;
  description?: string;
  status?: string;
  companyId?: string;
  managerId?: string;
  externalId?: string;
  estimatedValues?: number;
  dueDate?: string;
  opportunityPipelineId?: string;
  opportunityStepId?: string;
  customFields?: object;
  [key: string]: any;
}

export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  externalId: string;
  phoneNumber: string;
  mobilePhone: string;
  job: string;
  customFields: object;
  [key: string]: any;
}

export interface ICompany {
  id?: string;
  name: string;
  customFields?: object
  managedById?: string
  collaboraterIds?: string[]
  parentId?: string
  email?: string
  website?: string
  phone?: string
  vat?: string
  externalId?: string
  [key: string]: any;
}
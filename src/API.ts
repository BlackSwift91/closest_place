export const GOOGLE_PLACE_API = 'https://maps.googleapis.com/maps/api/place';
export const AUTOCOMPLETE = '/autocomplete/json?';
export const TOKEN = 'API_KEY';

export interface IPlace {
  index: number;
  item: {
    description: string;
    distance_meters: number;
    matched_substrings: any[];
    place_id: string;
    reference: string;
    structured_formatting: {
      main_text: string;
      main_text_matched_substrings: any[];
      secondary_text: string;
    };
    terms: any[];
    types: string[];
  };
  separators: {};
}

export type IPlaceInfo = {
  address_components: any[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  name: string;
  photos: any[];
  place_id: string;
};

export type IPlaceInfoResponse = {
  html_attributions: any[];
  result: IPlaceInfo;
  status: string;
};

export type PredictionType = {
  description: string;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  tructured_formatting: Object;
  terms: Object[];
  types: string[];
};

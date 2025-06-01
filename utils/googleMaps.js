import HttpClient from "./axios";

export default class googleMapsApi {
  constructor() {
    this.url = process.env.GOOGLE_MAPS_URL;
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.httpClient = new HttpClient(this.url);
  }

  async geocodeLocation(locationText) {
    const path = "/geocode/json";
    const params = {
      address: locationText,
      key: this.apiKey,
    };

    const res = await this.httpClient.request({ method: "GET", path, params });
    const firstResult = res.data.results[0];

    return {
      lat: firstResult.geometry.location.lat,
      lng: firstResult.geometry.location.lng,
      formatted: firstResult.formatted_address,
    };
  }

  async searchNearbyPlaces({ lat, lng, type = "restaurant", radius = 10000 }) {
    const path = "/nearbysearch/json";
    const params = {
      location: `${lat},${lng}`,
      radius,
      type,
      key: this.apiKey,
    };

    const res = await this.httpClient.request({ method: "GET", path, params });
    return res.data.results;
  }
}

import HttpClient from "../../../../utils/axios.js";

export default class ChatRepository {
  constructor() {
    this.googleUrl = process.env.GOOGLE_MAPS_URL;
    this.googleApiKey = process.env.GOOGLE_API_KEY;
    this.googleHttpClient = new HttpClient(this.googleUrl);

    this.ollamaUrl = process.env.OLLAMA_BASE_URL;
    this.ollamaHttpClient = new HttpClient(this.ollamaUrl);
  }

  async askLLama(message) {
    // ask LLM to return a json with location and intent
    const response = await this.ollamaHttpClient.request({
      method: "POST",
      url: "/api/chat",
      data: {
        model: "llama3",
        messages: [
          {
            role: "system",
            content:
              'You are an assistant that extracts structured data from user prompts. Return JSON with "type" and "location". for the type, map it into one of these following place type: restaurant, cafe, bar, bakery, meal_takeaway, meal_delivery, supermarket, convenience_store, pharmacy, hospital, doctor, dentist, school, university, library, book_store, gym, spa, hair_care, beauty_salon, lodging, hotel, museum, art_gallery, park, zoo, aquarium, tourist_attraction, shopping_mall, clothing_store, shoe_store, electronics_store, home_goods_store, furniture_store, hardware_store, car_repair, car_rental, car_wash, gas_station, bank, atm, post_office, church, mosque, hindu_temple, synagogue, and night_club. Send me only the json, no extra copywriting.',
          },
          { role: "user", content: message },
        ],
        stream: false,
      },
    });
    // parse JSON from model output
    try {
      const text = response.message.content.trim();
      return JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON from LLM:", err);
      return err;
    }
  }

  async geocodeLocation(locationText) {
    const path = "/geocode/json";
    const params = {
      address: locationText,
      key: this.googleApiKey,
    };

    const res = await this.googleHttpClient.request({
      method: "GET",
      url: path,
      params,
    });
    const firstResult = res.results[0];

    return {
      lat: firstResult.geometry.location.lat,
      lng: firstResult.geometry.location.lng,
      formatted: firstResult.formatted_address,
    };
  }

  async searchNearbyPlaces({ lat, lng, type = "restaurant", radius = 10000 }) {
    const path = "/place/nearbysearch/json";
    const params = {
      location: `${lat},${lng}`,
      radius,
      type,
      key: this.googleApiKey,
    };

    const res = await this.googleHttpClient.request({
      method: "GET",
      url: path,
      params,
    });
    return res.results;
  }
}

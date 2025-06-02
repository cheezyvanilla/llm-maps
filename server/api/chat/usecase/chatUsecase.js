import ChatRepository from "../repository/chatRepository.js";
export default class ChatUsecase {
  constructor() {
    this.repo = new ChatRepository();
  }

  async processMessage(message) {
    try {
      // send msg to ollama
      const llmRes = await this.repo.askLLama(message);
      if (!llmRes) return "No places found nearby.";
      const location = await this.repo.geocodeLocation(llmRes.location);
      let query = {
        lat: location.lat,
        lng: location.lng,
        type: llmRes.type,
      };
      const places = await this.repo.searchNearbyPlaces(query);

      // format places response
      const placesResponse = this.#formatPlacesResponse(places);
      return placesResponse;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  #formatPlacesResponse(places) {
    if (!places.length) return "No places found nearby.";

    // limit only to 10 places
    if (places.length > 10) places = places.slice(0, 10);
    const lines = ["Here are some places you might like:<br>"];

    places.forEach((place) => {
      const name = place.name;
      const rating = place.rating || "N/A";
      const total = place.user_ratings_total || 0;
      const address = place.vicinity || "";
      const closed = place.permanently_closed || false;
      const emoji = place.types?.includes("restaurant") ? "🍽️" : "🏨";
      const placeId = place.place_id;

      let line = `${emoji} <b>${name}</b><br>⭐ ${rating} · ${total.toLocaleString()} ratings<br>📍 ${address}<br>📌 <a href="https://www.google.com/maps/place/?q=place_id:${placeId}" target="_blank">View on Google Maps</a>`;
      if (closed) {
        line = `⚠️ <b>${name}</b> (Temporarily Closed)<br>⭐ ${rating} · ${total.toLocaleString()} ratings<br>📍 ${address}`;
      }

      lines.push(line + "<br>");
    });

    return lines.join("<br>");
  }
}

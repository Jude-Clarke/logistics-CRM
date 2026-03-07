const Carrier = require("../models/Carrier");

class CarrierService {
  async getAllCarriers() {
    return Carrier.query().orderBy("name", "asc");
  }
  async createCarrier(data) {
    return Carrier.query().insert(data);
  }
  async getCarrierById(id) {
    return Carrier.query().findById(id).throwIfNotFound();
  }
  async updateCarrier(id, data) {
    return Carrier.query().patchAndFetchById(id, data).throwIfNotFound();
  }
  async softDeleteCarrier(id) {
    const carrier = await this.getCarrierById(id);
    return carrier.$softDelete();
  }
}

module.exports = new CarrierService();

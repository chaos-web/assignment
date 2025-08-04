import { IHarvesterData } from "src/harvester/harvester.service";
import { CreateOfferDto } from "./offer.dto";
import { Offer } from "../entities/offer.entity";

export class OfferMapper {
    getOffers(offers: Offer[] ,total: number){
        const data = offers.map(offer => ({
            id: offer._id,
            name: offer.name,
            description: offer.description,
            min_salary: offer.salary.min,
            max_salary: offer.salary.max,
            location: offer.location,
            issuedAt: offer.issuedAt,
        }));

        return {
            data,
            total,
        };
    }
}
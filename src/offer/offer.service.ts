import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto, FindOfferDto, UpdateOfferDto } from './dto/offer.dto';
import { OfferRepository } from './entities/offer.entity';

@Injectable()
export class OfferService {
  @Inject() private readonly offerRepo: OfferRepository;

  create(createOfferDto: CreateOfferDto[]) {
    const offerEntities = createOfferDto.map((offer) => ({
      name: offer.name,
      description: offer.description,
      company: offer.company,
      location: offer.location,
      salary: {
        min: offer.minSalary,
        max: offer.maxSalary,
      },
      issuedAt: offer.issuedAt,
    }));
    return this.offerRepo.OfferModel.insertMany(offerEntities);
  }

  async findAll(dto: FindOfferDto) {
    const query: any = {};
    
    if (dto.search) {
      query['$text'] = { $search: dto.search, $caseSensitive: false };
    }

    if (dto.location) {
      query.location = dto.location;
    }

    if (dto.minSalary || dto.maxSalary) {
      query.salary = {};
      if (dto.minSalary) {
        query.salary.max = { $gte: dto.minSalary };
      }
      if (dto.maxSalary) {
        query.salary.min = { $lte: dto.maxSalary };
      }
    }

    if (dto.issuedFrom) {
      query.issuedAt = { $gte: dto.issuedFrom };
    }
    
    const offers = await this.offerRepo.getAll(dto.page, query, undefined, { issuedAt: -1 });
    const total = dto.page ===1 ? await this.offerRepo.count(query) : -1;
    return {
      offers,
      total,
    };
  }
}

import { HttpService } from '@nestjs/axios';
import { IHarvesterData, IHarvesterStrategy } from '../harvester.service';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';

interface JobResponse {
  metadata: {
    requestId: string;
    timestamp: string; // ISO date string
  };
  jobs: Job[];
}

interface Job {
  jobId: string;
  title: string;
  details: {
    location: string;
    type: string;
    salaryRange: string;
  };
  company: {
    name: string;
    industry: string;
  };
  skills: string[];
  postedDate: string; // ISO date string
}

@Injectable()
export class StructureAStrategy implements IHarvesterStrategy {
  name = 'structureA';
  private readonly logger = new Logger(StructureAStrategy.name);
  private readonly axios = axios.create({
    baseURL: 'https://assignment.devotel.io/api/',
  });

  constructor() {
    axiosRetry(this.axios, { retries: 3 });
    this.logger.verbose('structureA strategy initialized');
  }

  async execute(): Promise<IHarvesterData[]> {
    const data = await this.fetchData();
    return this.transform(data.jobs);
  }

  async fetchData(): Promise<JobResponse> {
    const response = await this.axios.get('provider1/jobs');
    return response.data;
  }

  async transform(data: Job[]): Promise<IHarvesterData[]> {
    const extractSalery = (salaryRange: string) => {
        const match = salaryRange.match(/([\$\€\£])?([\d.,]+)([kKmM]?)\s*-\s*([\$\€\£])?([\d.,]+)([kKmM]?)/);

        if (!match) return null;
      
        const currency1 = match[1];
        const minStr = match[2];
        const multiplier1 = match[3];
      
        const currency2 = match[4];
        const maxStr = match[5];
        const multiplier2 = match[6];
      
        if ((currency1 && currency2) && currency1 !== currency2) {
            this.logger.warn(`Inconsistent currency: ${currency1} and ${currency2}`);
        } 
      
        const factor = (m: string): number => {
          switch (m.toLowerCase()) {
            case 'k': return 1_000;
            case 'm': return 1_000_000;
            default: return 1;
          }
        };
      
        const min = parseFloat(minStr.replace(/,/g, '')) * factor(multiplier1);
        const max = parseFloat(maxStr.replace(/,/g, '')) * factor(multiplier2);
      
        return {
          min,
          max,
          currency: currency1 || currency2 || ''
        };
    };
    const harvesterData: IHarvesterData[] = [];
    data.forEach((job) => {
      const { min, max, currency } = extractSalery(job.details.salaryRange);
      harvesterData.push({
        id: job.jobId.split('-')[1],
        name: job.title,
        description: job.title,
        location: job.details.location,
        company: job.company.name,
        salary: {
          min,
          max,
          currency: 'USD',
        },
        skills: job.skills,
        createdAt: new Date(job.postedDate),
      });
    });
    return harvesterData;
  }
}

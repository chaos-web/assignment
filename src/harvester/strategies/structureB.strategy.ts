import { IHarvesterData, IHarvesterStrategy } from '../harvester.service';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';

 interface JobResponse {
  status: string; 
  data: {
    jobsList: Record<string, JobItem>;
  };
}

 interface JobItem {
  position: string;
  location: {
    city: string;
    state: string;
    remote: boolean;
  };
  compensation: {
    min: number;
    max: number;
    currency: string;
  };
  employer: {
    companyName: string;
    website: string;
  };
  requirements: {
    experience: number;
    technologies: string[];
  };
  datePosted: string; 
}

@Injectable()
export class StructureBStrategy implements IHarvesterStrategy {
  name = 'structureB';
  private readonly logger = new Logger(StructureBStrategy.name);
  private readonly axios = axios.create({
    baseURL: 'https://assignment.devotel.io/api/',
  });

  constructor() {
    axiosRetry(this.axios, { retries: 3 });
    this.logger.verbose('structureB strategy initialized');
  }


  async execute() : Promise<IHarvesterData[]> {
    const data = await this.fetchData();
    return this.transform(data.data.jobsList);
  }

  async fetchData() : Promise<JobResponse> {
    const response = await this.axios.get('provider2/jobs');
    return response.data;
  }

  async transform(jobs: Record<string, JobItem>): Promise<IHarvesterData[]> {
    const harvesterData: IHarvesterData[] = [];
    const keys = Object.keys(jobs);
    keys.forEach((key) => {
      const job = jobs[key];
      harvesterData.push({
        id: key.split('-')[1],
        name: job.position,
        description: job.employer.companyName, 
        location: job.location.city,
        company: job.employer.companyName,
        salary: {
          min: job.compensation.min,
          max: job.compensation.max,
          currency: job.compensation.currency,
        },
        skills: job.requirements.technologies,
        createdAt: new Date(job.datePosted),
      });
    });
    return harvesterData;
  }
}

import {Injectable} from '@angular/core';
import {Leader} from '../shared/leader';
import {LEADERS} from '../shared/leaders';


@Injectable()
export class LeaderService {

  constructor() {}

  getFeaturedLeader(): Promise<Leader> {
    return Promise.resolve(LEADERS.filter((leader) => (leader.featured))[0]);
  }

  getLeaders(): Promise<Leader[]> {
    return Promise.resolve(LEADERS);
  }
}
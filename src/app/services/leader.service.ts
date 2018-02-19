import {Injectable} from '@angular/core';
import {Leader} from '../shared/leader';
import {LEADERS} from '../shared/leaders';


@Injectable()
export class LeaderService {

  constructor() {}

  getFeaturedLeader(): Leader {
    return LEADERS.filter((leader) => (leader.featured))[0];
  }

  getLeaders(): Leader[] {
    return LEADERS;
  }
}
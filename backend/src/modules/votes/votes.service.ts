import { CreateVotesDto, SuggestVotesDto } from './dto/_index';
import { EventsDbDto } from '../events/dto/events-db.dto';
import { EventsEntity } from '../../database/entities/events.entity';
import { EventsRepository } from '../../database/repositories/events.repo';
import { GroupsEntity } from '../../database/entities/groups.entity';
import { GroupsRepository } from '../../database/repositories/groups.repo';
import { HttpService } from '@/modules/http/http.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { UsersRepository } from '../../database/repositories/users.repo';
import { VoteRecordsEntity } from '../../database/entities/voteRecords.entity';
import { VoteRecordsRepository } from '../../database/repositories/voteRecords.repository';
import { VotesEntity } from '@entity/votes.entity';
import { VotesRepository } from '@repo/votes.repository';

@Injectable()
export class VotesService {
  constructor(
    private readonly i18n: I18nRequestScopeService,
    private readonly votesRepo: VotesRepository,
    private readonly groupsRepo: GroupsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly eventsRepo: EventsRepository,
    private readonly voteRecordsRepo: VoteRecordsRepository,
    private readonly httpService: HttpService
  ) {}

  async voteEvent(userId: number, groupId: number, data: CreateVotesDto) {
    const voter = await this.usersRepo.findOne(userId);
    const vote = await this.votesRepo.save({
      name: data.name,
      group: { id: groupId },
      typeId: 1,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
    });

    return this.voteRecordsRepo.save({
      vote,
      voter,
      isAccept: true,
    });
  }

  async voteLocation(userId: number, groupId: number, location: string) {
    const voter = await this.usersRepo.findOne(userId);
    const vote = await this.votesRepo.save({
      name: location,
      group: { id: groupId },
      typeId: 2,
      location,
    });

    return this.voteRecordsRepo.save({
      vote,
      voter,
      isAccept: true,
    });
  }

  async findAll(userId: number, groupId: number): Promise<VotesEntity[]> {
    const result = await this.votesRepo.find({
      relations: ['group', 'voteRecords', 'voteRecords.voter'],
      where: {
        group: { id: groupId },
      },
    });
    return result.filter(
      (e) => e.voteRecords.find((r) => r.voter.id === userId) == null
    );
  }

  async findOne(voteId: number): Promise<VotesEntity> {
    return this.votesRepo.findOneOrFail(voteId);
  }

  async vote(
    userId: number,
    voteId: number,
    isAccept: boolean
  ): Promise<boolean> {
    await this.voteRecordsRepo.save({
      voter: { id: userId },
      vote: { id: voteId },
      isAccept,
    });

    const vote = await this.votesRepo.findOne({
      relations: ['group', 'group.users', 'voteRecords', 'voteRecords.voter'],
      where: { id: voteId },
    });

    const { group, voteRecords } = vote;
    const agreeUserList = voteRecords.filter((r) => {
      return r.isAccept === true;
    });

    if (
      voteRecords.length === group.users.length &&
      (agreeUserList.length / group.users.length) * 100 >= group.voteAcceptRate
    ) {
      if (vote.typeId === 1) {
        await this.eventVoteEnd(vote, group, agreeUserList);
      } else {
        // location
        await this.eventVoteEnd(vote, group, agreeUserList);
      }
    }

    return true;
  }

  async eventVoteEnd(
    vote: VotesEntity,
    group: GroupsEntity,
    agreeUserList: VoteRecordsEntity[]
  ) {
    const event = new EventsDbDto();
    event.name = vote.name;
    event.dateStart = vote.dateStart;
    event.dateEnd = vote.dateEnd;
    event.GUID = `${group.id.toString()}_${vote.name.toString()}@${vote.dateStart.toString()}`;

    const earlyEventList = new Array<EventsEntity>();

    const earlyEventDateTime = new Date(vote.dateStart).setHours(
      vote.dateStart.getHours() - 1
    );
    // agreeUserList.forEach(async (u) => {
    //   const earlyEvent = await this.eventsRepo.findOne({
    //     user: { id: u.voter.id },
    //     dateStart: LessThanOrEqual(earlyEventDateTime),
    //     dateEnd: MoreThanOrEqual(earlyEventDateTime),
    //   });
    //   earlyEventList.push(earlyEvent);
    // });

    for (let index = 0; index < agreeUserList.length; index += 1) {
      const vr = agreeUserList[index];
      // eslint-disable-next-line no-await-in-loop
      const earlyEvent = await this.eventsRepo.findOne({
        user: { id: vr.voter.id },
        dateStart: LessThanOrEqual(earlyEventDateTime),
        dateEnd: MoreThanOrEqual(earlyEventDateTime),
      });
      if (!earlyEvent) {
        const tempEvent = new EventsEntity();
        tempEvent.location = vr.voter.address;
        earlyEventList.push(tempEvent);
      } else {
        earlyEventList.push(earlyEvent);
      }
    }

    const locationList = earlyEventList
      .filter((e) => {
        return e.location != null;
      })
      .map((e) => {
        return e.location;
      });

    const centerLocation = await this.getCenterLocation(locationList);

    event.location = centerLocation;

    agreeUserList.forEach(async (u) => {
      await this.eventsRepo.save({
        ...event,
        user: { id: u.voter.id },
      });
    });

    return { center: centerLocation };
  }

  async getCenterLocation(location: string[]) {
    const latList = new Array<number>();
    const lngList = new Array<number>();

    // location.forEach(async (loc) => {
    //   const result = await this.httpService.get(
    //     `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${process.env.GOOGLEAPIKEY}`
    //   );
    //   latList.push(result.results[0].geometry.location.lat);
    //   lngList.push(result.results[0].geometry.location.lng);
    // });

    for (let index = 0; index < location.length; index += 1) {
      const loc = location[index];
      // eslint-disable-next-line no-await-in-loop
      const result = await this.httpService.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${process.env.GOOGLEAPIKEY}`
      );
      latList.push(result.results[0].geometry.location.lat);
      lngList.push(result.results[0].geometry.location.lng);
    }

    latList.sort((a, b) => a - b);
    lngList.sort((a, b) => a - b);

    const centerLat = (latList[0] + latList[latList.length - 1]) / 2;
    const centerLng = (lngList[0] + lngList[lngList.length - 1]) / 2;

    const centerLocationData = await this.httpService.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${centerLat},${centerLng}&key=${process.env.GOOGLEAPIKEY}`
    );

    let centerLocation: string;
    if (centerLocationData != null && centerLocationData.results != null) {
      const component = centerLocationData.results[0].address_components;
      component.forEach((e) => {
        if (e.types[0] === 'neighborhood') {
          centerLocation = e.long_name;
        }
      });
    }

    return centerLocation || 'Mong Kok';
  }

  async remove(voteId: number): Promise<boolean> {
    return (await this.votesRepo.delete(voteId)).affected > 0;
  }

  async acceptSuggest(
    userId: number,
    voteId: number,
    suggest: SuggestVotesDto
  ) {
    // first update the switch event
    const event = await this.eventsRepo.findOne(suggest.eventId);
    event.dateStart = suggest.dateStart;
    event.dateEnd = suggest.dateEnd;
    await this.eventsRepo.update(suggest.eventId, {
      ...event,
    });

    return this.vote(userId, voteId, true);
  }
}

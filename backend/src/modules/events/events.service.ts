import * as moment from 'moment';
import {
  CalEventsDto,
  EventsDbDto,
  EventsDto,
  ReturnEventsDto,
  UpdateEventsDto,
} from './dto/_index';
import { EventsRepository } from '../../database/repositories/events.repo';
import { GroupsRepository } from '@/database/repositories/groups.repo';
import { HttpService } from '@/modules/http/http.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import {
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { VotesRepository } from '@repo/votes.repository';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    readonly i18n: I18nRequestScopeService,
    readonly httpService: HttpService,
    readonly eventsRepo: EventsRepository,
    readonly groupsRepo: GroupsRepository,
    readonly votesRepo: VotesRepository
  ) {}

  async create(userId: number, param: EventsDto) {
    // if (param.isRegular) {
    //   const guid = `${Date.now()}_${param.name}`;
    //   const eventList = new Array<EventsDbDto>();
    //   switch (param.regularType) {
    //     case RegularType.DAY:
    //       // eslint-disable-next-line no-plusplus
    //       for (let index = 0; index < 100; index++) {
    //         const eventsdb = new EventsDbDto();
    //         eventsdb.name = param.name;
    //         eventsdb.location = param.location;
    //         eventsdb.dateStart = this.addDays(param.dateStart, index);
    //         eventsdb.dateEnd = this.addDays(param.dateEnd, index);
    //         eventsdb.groupUID = guid;
    //         // eslint-disable-next-line no-await-in-loop
    //         eventList.push(eventsdb);
    //       }
    //       // eslint-disable-next-line no-case-declarations
    //       const newEventList = await this.eventsRepo.save({ ...eventList });
    //       return newEventList;
    //       break;

    //     case RegularType.WEEK:
    //       break;

    //     case RegularType.MONTH:
    //       break;

    //     case RegularType.YEAR:
    //       break;

    //     default:
    //       throw NormalException.UNEXPECTED();
    //   }
    // } else {

    // todo: notification
    const eventsdb = new EventsDbDto();
    eventsdb.name = param.name;
    eventsdb.location = param.location ? param.location : null;
    eventsdb.dateStart = param.dateStart;
    eventsdb.dateEnd = param.dateEnd;

    const newEvent = await this.eventsRepo.save({
      ...eventsdb,
      user: { id: userId },
    });

    return newEvent;
    // }
  }

  async update(eventId: number, data: UpdateEventsDto) {
    // todo: notification
    const eventsdb = new EventsDbDto();
    eventsdb.name = data.name;
    eventsdb.location = data.location;
    eventsdb.dateStart = data.dateStart;
    eventsdb.dateEnd = data.dateEnd;

    console.log(`dateStart: ${data.dateStart}, dateEnd: ${data.dateEnd}`);

    if (data.isGroupEvent) {
      const event = await this.eventsRepo.findOne(eventId);
      const { GUID } = event;

      const alterEventList = await this.eventsRepo.find({ GUID });
      alterEventList.forEach(async (e) => {
        await this.eventsRepo.update(e.id, {
          ...eventsdb,
        });
      });
      return this.eventsRepo.findOne(eventId);
    }

    return this.eventsRepo.update(eventId, {
      ...eventsdb,
    });
  }

  async findOne(eventsId: number) {
    return (await this.eventsRepo.findOne(eventsId)) || null;
  }

  async findAll(userId: number) {
    return (
      (await this.eventsRepo.find({
        relations: ['user'],
        where: {
          user: {
            id: userId,
          },
        },
      })) || null
    );
  }

  async delete(eventsId: number) {
    return (await this.eventsRepo.delete(eventsId)) || null;
  }

  async findFreeDays(groupId: number, criteria: CalEventsDto) {
    const group = await this.groupsRepo.findOne({
      relations: ['users', 'users.events'],
      where: { id: groupId },
    });

    const userList = group.users.map((u) => {
      return u.id;
    });

    return this.calculate(userList, group.users.length, 3, criteria);
  }

  async calculate(
    userList: number[],
    userNo: number,
    top: number,
    criteria: CalEventsDto
  ) {
    const resultList = new Array<ReturnEventsDto>();

    const filterEventsList = await this.eventsRepo.find({
      relations: ['user'],
      where: [
        {
          user: { id: In(userList) },
          dateStart: MoreThanOrEqual(criteria.dateFrom),
          dateEnd: LessThanOrEqual(criteria.dateTo),
        },
        {
          user: { id: In(userList) },
          dateStart: LessThanOrEqual(criteria.dateFrom),
          dateEnd: LessThanOrEqual(criteria.dateTo),
        },
        {
          user: { id: In(userList) },
          dateStart: MoreThanOrEqual(criteria.dateFrom),
          dateEnd: MoreThanOrEqual(criteria.dateTo),
        },
        {
          user: { id: In(userList) },
          dateStart: LessThanOrEqual(criteria.dateFrom),
          dateEnd: LessThanOrEqual(criteria.dateTo),
        },
      ],
    });

    const diffInDays = moment(criteria.dateTo).diff(
      moment(criteria.dateFrom),
      'days'
    );

    for (let i = 0; i <= diffInDays; i += 1) {
      const date = this.addDays(criteria.dateFrom, i);
      const dateStart = new Date(
        date.setHours(criteria.hourFrom, criteria.minFrom)
      );
      let dateEnd: Date;
      if (criteria.hourFrom > criteria.hourTo) {
        const nextDate = this.addDays(date, 1);
        dateEnd = new Date(nextDate.setHours(criteria.hourTo, criteria.minTo));
      } else {
        dateEnd = new Date(date.setHours(criteria.hourTo, criteria.minTo));
      }

      const eventsInDayList = filterEventsList.filter((e) => {
        return (
          (dateStart >= e.dateStart && dateStart < e.dateEnd) ||
          (dateEnd > e.dateStart && dateEnd <= e.dateEnd) ||
          (dateStart <= e.dateStart && dateEnd >= e.dateEnd) ||
          (dateStart > e.dateStart && dateEnd < e.dateEnd)
        );
      });

      const userUnavailableList = new Array<number>();
      // distinct the user
      eventsInDayList.forEach((e) => {
        if (userUnavailableList.indexOf(e.user.id) === -1) {
          userUnavailableList.push(e.user.id);
        }
      });

      const newReturnEvent = new ReturnEventsDto();
      newReturnEvent.dateStart = dateStart;
      newReturnEvent.dateEnd = dateEnd;
      newReturnEvent.free = userNo - userUnavailableList.length;

      resultList.push(newReturnEvent);
    }

    // sorting and take top 3
    const sortedReturnList = resultList.sort((a, b) => {
      if (a.free === b.free) {
        return a.dateStart.getTime() - b.dateStart.getTime();
      }
      return b.free - a.free;
    });

    if (resultList.length > top) {
      sortedReturnList.splice(top, resultList.length - top);
    }
    while (sortedReturnList[sortedReturnList.length - 1].free === 0) {
      sortedReturnList.pop();
    }
    return sortedReturnList;
  }

  padNum = (num) => String(num).padStart(2, '0');

  getLocaleStringFromDB(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${year}-${this.padNum(month)}-${this.padNum(day)} ${this.padNum(
      hour
    )}:${this.padNum(minute)}:${this.padNum(second)}`;
  }

  async checkDup(userId: number, voteId: number) {
    const vote = await this.votesRepo.findOne(voteId);
    const voteDateStart = this.getLocaleStringFromDB(vote.dateStart);
    const voteDateEnd = this.getLocaleStringFromDB(vote.dateEnd);
    const result = await this.eventsRepo.find({
      relations: ['user'],
      where: [
        {
          user: { id: userId },
          dateStart: LessThanOrEqual(voteDateStart),
          dateEnd: MoreThan(voteDateStart),
        },
        {
          user: { id: userId },
          dateStart: LessThan(voteDateEnd),
          dateEnd: MoreThanOrEqual(voteDateEnd),
        },
        {
          user: { id: userId },
          dateStart: MoreThanOrEqual(voteDateStart),
          dateEnd: LessThanOrEqual(voteDateEnd),
        },
        {
          user: { id: userId },
          dateStart: LessThan(voteDateStart),
          dateEnd: MoreThan(voteDateEnd),
        },
      ],
    });

    return result;
    // if (dupEvents == null || dupEvents.length === 0) {
    //   return false;
    // }
    // return true;
  }

  async suggest(userId: number, eventId: number) {
    const event = await this.eventsRepo.findOne(eventId);
    const calCriteria = new CalEventsDto();
    const now = new Date();
    if (moment(this.addDays(event.dateStart, -1)).diff(now, 'days') === 0) {
      calCriteria.dateFrom = this.addDays(event.dateStart, 1);
      calCriteria.dateTo = this.addDays(event.dateStart, 11);
    } else if (
      moment(this.addDays(event.dateStart, -1)).diff(now, 'days') < 0
    ) {
      const dayDiff = moment(this.addDays(event.dateStart, -1)).diff(
        now,
        'days'
      );
      calCriteria.dateFrom = this.addDays(event.dateStart, 1);
      calCriteria.dateTo = this.addDays(event.dateStart, 5 - dayDiff);
    } else {
      calCriteria.dateFrom = this.addDays(event.dateStart, -5);
      calCriteria.dateTo = this.addDays(event.dateStart, 5);
    }

    calCriteria.hourFrom = event.dateStart.getHours();
    calCriteria.minFrom = event.dateStart.getMinutes();
    calCriteria.hourTo = event.dateEnd.getHours();
    calCriteria.minTo = event.dateEnd.getMinutes();

    const userList = new Array<number>();
    userList.push(userId);

    const result = await this.calculate(userList, 1, 5, calCriteria);

    if (result.length < 5) {
      calCriteria.hourFrom -= 1;
      calCriteria.hourTo -= 1;
      result.concat(await this.calculate(userList, 1, 5, calCriteria));

      if (result.length < 5) {
        calCriteria.hourFrom += 2;
        calCriteria.hourTo += 2;
        result.concat(await this.calculate(userList, 1, 5, calCriteria));
      }
    }

    const sortedReturnList = result.sort((a, b) => {
      if (a.free === b.free) {
        return a.dateStart.getTime() - b.dateStart.getTime();
      }
      return b.free - a.free;
    });

    return sortedReturnList;
  }

  addDays = (date: Date, days: number): Date => {
    const newDate = moment(date).add(days, 'days');

    return newDate.toDate();
  };
}

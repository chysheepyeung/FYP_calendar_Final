import { USER_DATA } from 'shared/constant';
import { getLocalDateStr } from '../../shared/helper';
import { parseJwt } from 'shared/helper';
import { renderToString } from 'react-dom/server';
import { useAPI } from 'hooks/useApi';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import Admin from 'layouts/Admin.js';
import FullCalendar from '@fullcalendar/react';
import React from 'react';
import Swal from 'sweetalert2';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
export default function GroupDetail() {
  const router = useRouter();
  const { id } = router.query;
  const {
    getGroupDetails,
    invitePeople,
    leaveGroup,
    findFreeDays,
    creatVoteEvent,
    getVoteEvent,
    voteEvent,
    checkIsDuplicate,
    getSuggestChange,
    acceptSuggest,
  } = useAPI();
  const [allUserEvent, setAllUserEvent] = useState([]);

  const [userId, setUserId] = React.useState();

  const detailsQuery = useQuery(['getGroupDetails', id], () =>
    getGroupDetails(id)
  );

  const voteEventsQuery = useQuery(['getVoteEvent', id], () =>
    getVoteEvent(id)
  );

  const now = getLocalDateStr(new Date());
  useEffect(() => {
    if (localStorage.getItem(USER_DATA))
      setUserId(parseJwt(localStorage.getItem(USER_DATA))?.id);
  }, []);

  const openAddEventModal = async () => {
    const alertData = await Swal.fire({
      title: 'Add Event',
      html: renderToString(
        <>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              id="name"
              placeholder="Enter your event name"
              type="text"
            />
          </div>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              Search Date Range <span className="text-red-500">*</span>
            </label>
            <div
              className="relative w-full mb-3 flex p-4"
              style={{
                display: 'inline-flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <input
                className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                defaultValue={getLocalDateStr(now).slice(0, 10)}
                id="dateFrom"
                min={now}
                style={{ width: '40%' }}
                type="date"
              />
              <div className="">To</div>
              <input
                className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                defaultValue={getLocalDateStr(now, 5).slice(0, 10)}
                id="dateTo"
                min={now}
                style={{ width: '40%' }}
                type="date"
              />
            </div>
          </div>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              Expected Event Time <span className="text-red-500">*</span>
            </label>
            <div
              className="relative w-full mb-3 flex p-4"
              style={{
                display: 'inline-flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <input
                className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                // defaultValue={getLocalDateStr(now, 5).slice(11, 16)}
                id="timeFrom"
                style={{ width: '40%' }}
                type="time"
              />
              <div className="">To</div>
              <input
                className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                id="timeTo"
                style={{ width: '40%' }}
                type="time"
              />
            </div>
          </div>
        </>
      ),
      confirmButtonText: 'Submit',
      showCloseButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const getValue = (name) =>
          Swal.getPopup().querySelector(`#${name}`).value;

        const name = getValue('name');
        const dateFrom = getValue('dateFrom');
        const dateTo = getValue('dateTo');
        const timeFrom = getValue('timeFrom');
        const timeTo = getValue('timeTo');
        if (!name || !dateFrom || !dateTo || !timeFrom || !timeTo) {
          Swal.showValidationMessage(`Please enter all the required fields`);
        }
        return { name, dateFrom, dateTo, timeFrom, timeTo };
      },
    });

    const { value } = alertData;
    if (alertData.isConfirmed && value) {
      const timeFrom = new String(value.timeFrom);
      const timeTo = new String(value.timeTo);
      const timeFromSplit = timeFrom.split(':');
      const timeToSplit = timeTo.split(':');
      const findFreeDayRes = await findFreeDays(id, {
        dateFrom: value.dateFrom,
        dateTo: value.dateTo,
        hourFrom: parseInt(timeFromSplit[0]),
        hourTo: parseInt(timeToSplit[0]),
        minFrom: parseInt(timeFromSplit[1]),
        minTo: parseInt(timeToSplit[1]),
      });

      if (findFreeDayRes) {
        const chooseData = await Swal.fire({
          title: 'Choose Suggestion',
          html: renderToString(
            findFreeDayRes.map((item, index) => (
              <div
                key={index}
                className="relative w-full mb-3 flex p-4 items-center mx-auto"
              >
                <input
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 mr-4"
                  id={index}
                  name="finalChoice"
                  type="radio"
                />
                <p
                  className="text-blueGray-600 text-md font-bold w-1/5 text-left"
                  htmlFor="grid-password"
                >
                  {`From ${new Date(item.dateStart).toLocaleString()}`}
                  <br />
                  {`To ${new Date(item.dateEnd).toLocaleString()}`}
                  <br />
                  <small>{`Free Person: ${item.free}`}</small>
                </p>
              </div>
            ))
          ),
          confirmButtonText: 'Submit',
          showCloseButton: true,
          focusConfirm: false,
          preConfirm: () => {
            const finalChoice = Swal.getPopup().querySelector(
              'input[name="finalChoice"]:checked'
            );
            if (!finalChoice) {
              Swal.showValidationMessage(`Please choose your preferred date`);
            }
            return { finalChoice: Number(finalChoice.id) };
          },
        });

        if (!chooseData.isDismissed) {
          const { finalChoice } = chooseData.value;
          if (chooseData.isConfirmed && finalChoice != null) {
            const createVoteRes = await creatVoteEvent(id, {
              name: value.name,
              dateStart: findFreeDayRes[finalChoice].dateStart,
              dateEnd: findFreeDayRes[finalChoice].dateEnd,
            });
            if (createVoteRes) {
              Swal.fire({
                title: 'Success',
                text: 'Vote Event created successfully',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error creating vote event',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500,
              });
            }
          }
        }
      }
    }
  };

  const openInviteModal = async () => {
    const alertData = await Swal.fire({
      title: 'Invitation',
      html: renderToString(
        <>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              id="email"
              placeholder="Enter the email"
              type="email"
            />
          </div>
        </>
      ),
      confirmButtonText: 'Submit',
      showCloseButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const getValue = (name) =>
          Swal.getPopup().querySelector(`#${name}`).value;

        const email = getValue('email');
        if (!email) {
          Swal.showValidationMessage('Please enter all the required fields');
        }
        if (email.match(/^\S+@\S+\.\S+$/) == null) {
          Swal.showValidationMessage('Please enter a valid email');
        }
        return { email };
      },
    });

    if (alertData.isConfirmed && alertData?.value) {
      const result = await invitePeople({
        ...alertData.value,
        groupId: Number(id),
      });
      if (result?.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Invitation has been sent',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: 'Failed',
          text: 'User not found or already invited',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const handleLeaveGroup = async () => {
    const leaveConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#ee6666',
      confirmButtonText: 'Yes!',
      showCloseButton: true,
    });

    if (leaveConfirm.isConfirmed) {
      const result = leaveGroup(id);
      if (result) {
        Swal.fire({
          title: 'Success',
          text: 'You leave the group',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        router.push('/user/group');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Cannot leave the group',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const openSuggestModal = async (event, voteId) => {
    const suggestions = await getSuggestChange(event.id);
    const chooseData = await Swal.fire({
      title: 'Choose Suggestion',
      html: renderToString(
        suggestions.map((item, index) => (
          <>
            <h1>Event Name: {event.name}</h1>
            <div
              key={index}
              className="relative w-full mb-3 flex p-4 items-center mx-auto"
            >
              <input
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 mr-4"
                id={index}
                name="finalChoice"
                type="radio"
              />
              <p
                className="text-blueGray-600 text-md font-bold w-1/5 text-left"
                htmlFor="grid-password"
              >
                {`From ${new Date(item.dateStart).toLocaleString()}`}
                <br />
                {`To ${new Date(item.dateEnd).toLocaleString()}`}
              </p>
            </div>
          </>
        ))
      ),
      confirmButtonText: 'Submit',
      showCloseButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const finalChoice = Swal.getPopup().querySelector(
          'input[name="finalChoice"]:checked'
        );
        if (!finalChoice) {
          Swal.showValidationMessage(`Please choose your preferred date`);
        }
        return { finalChoice: Number(finalChoice.id) };
      },
    });

    if (!chooseData.isDismissed) {
      const { finalChoice } = chooseData.value;
      if (chooseData.isConfirmed && finalChoice != null) {
        const acceptRes = await acceptSuggest(voteId, {
          eventId: event.id,
          dateStart: suggestions[finalChoice].dateStart,
          dateEnd: suggestions[finalChoice].dateEnd,
        });
        if (acceptRes) {
          Swal.fire({
            title: 'Success',
            text: 'Modify Event successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          await voteEventsQuery.refetch();
          await detailsQuery.refetch();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error modifying event',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    }
  };

  const openShowEventModal = async (info) => {
    const { event } = info;
    await Swal.fire({
      title: 'Event Details',
      html: renderToString(
        <>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              Event Name
            </label>
            <input
              disabled
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              defaultValue={event.title}
              placeholder="Enter your event name"
              type="text"
            />
          </div>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              Start Date
            </label>
            <input
              disabled
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              defaultValue={getLocalDateStr(event.start)}
              type="datetime-local"
            />
          </div>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              End Date
            </label>
            <input
              disabled
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              defaultValue={getLocalDateStr(event.end)}
              type="datetime-local"
            />
          </div>
        </>
      ),
      showDenyButton: false,
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false,
    });
  };

  const vote = async (id, status) => {
    const result = await voteEvent(id, status);
    if (result) {
      Swal.fire({
        title: 'Success',
        text: 'Voting has been done',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      await voteEventsQuery.refetch();
      await detailsQuery.refetch();
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Cannot vote for this event',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const voteModal = async (voteId) => {
    const duplicateList = await checkIsDuplicate(voteId);
    const isDuplicate = duplicateList?.length > 0;

    if (isDuplicate) {
      const suggestConfirm = await Swal.fire({
        title: 'Voting',
        text: `You have ${duplicateList?.length} personal event overlapped this group event, you should modify the event(s) date time first in order to join this event`,
        icon: 'info',
        showDenyButton: true,
        denyButtonColor: '#ee6666',
        denyButtonText: 'Next Time',
        confirmButtonText: 'Suggest Modification',
        confirmButtonColor: '#8b4518',
        showCloseButton: true,
      });

      if (!suggestConfirm.isDismissed) {
        if (suggestConfirm.isDenied) {
          await vote(voteId, voteConfirm.isConfirmed);
          return;
        }
        for (let i = 0; i < duplicateList.length; i += 1) {
          await openSuggestModal(duplicateList[i], voteId);
        }
      }
      return;
    }

    const voteConfirm = await Swal.fire({
      title: 'Voting',
      text: 'Do you free to go this event?',
      icon: 'info',
      showDenyButton: true,
      denyButtonColor: '#ee6666',
      denyButtonText: 'Not Free',
      confirmButtonText: 'Free to Go',
      showCloseButton: true,
    });

    if (!voteConfirm.isDismissed) {
      await vote(voteId, voteConfirm.isConfirmed);
    }
  };

  useEffect(() => {
    if (detailsQuery.data) {
      const result = [];
      const users = detailsQuery?.data?.users;
      for (let i = 0; i < users?.length; i += 1) {
        if (users[i].events?.length > 0) {
          for (let x = 0; x < users[i].events.length; x += 1) {
            const event = users[i].events[x];
            if (
              event.GUID == null ||
              result.find((item) => item.GUID === event.GUID) == null
            ) {
              result.push(event);
            }
          }
        }
      }
      setAllUserEvent(result);
    }
  }, [detailsQuery.data]);

  return (
    <div className="mx-auto px-4 h-full">
      <h1 className="text-4xl">{detailsQuery.data?.name}</h1>
      <div className="flex justify-end h-full">
        <button
          className="bg-indigo-500 text-white active:bg-indigo-600 text-md font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
          onClick={openInviteModal}
        >
          Invite People
        </button>
        <button
          className="bg-indigo-500 text-white active:bg-indigo-600 text-md font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150 ml-3"
          type="button"
          onClick={openAddEventModal}
        >
          Create Event
        </button>
        <button
          className="bg-red-500 text-white text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150 inline cursor-pointer ml-3"
          type="button"
          onClick={handleLeaveGroup}
        >
          Leave Group
        </button>
      </div>
      {voteEventsQuery.data?.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  }
                >
                  Event Name
                </th>
                <th
                  className={
                    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  }
                >
                  Start Date
                </th>
                <th
                  className={
                    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  }
                >
                  End Date
                </th>
                <th
                  className={
                    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  }
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {voteEventsQuery.data?.map((item, index) => (
                <tr key={index}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                    <span className={'font-bold text-blueGray-600'}>
                      {item.name}
                    </span>
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {new Date(item.dateStart).toLocaleString()}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {new Date(item.dateEnd).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-2 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => voteModal(item.id)}
                    >
                      Vote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-5">
        <FullCalendar
          editable
          selectable
          eventClick={openShowEventModal}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
          events={allUserEvent?.map((item) => {
            return {
              title: item.name,
              start: getLocalDateStr(item.dateStart),
              end: getLocalDateStr(item.dateEnd),
              extendedProps: {
                id: item.id,
                location: item.location,
              },
              display: item?.GUID || item?.user.id === userId ? 'block' : '',
              backgroundColor: item?.GUID
                ? '#e18530'
                : item?.user.id === userId
                ? '#3788d8'
                : 'red',
              borderColor: item?.GUID
                ? '#e18530'
                : item?.user.id === userId
                ? '#3788d8'
                : 'red',
            };
          })}
          height="80vh"
          longPressDelay={200}
          plugins={[dayGridPlugin, interactionPlugin]}
        />
      </div>
    </div>
  );
}

GroupDetail.layout = Admin;

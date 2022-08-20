import { getLocalDateStr } from '../../shared/helper';
import { renderToString } from 'react-dom/server';
import { useAPI } from 'hooks/useApi';
import { useQuery } from 'react-query';
import FullCalendar from '@fullcalendar/react';
import Swal from 'sweetalert2';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

Calendar.propTypes = {};

function Calendar() {
  /* Define state / hook */
  const { getEvent, createEvent, updateEvent, deleteEvent } = useAPI();
  const { data, refetch } = useQuery([getEvent.name], () => getEvent());

  const now = getLocalDateStr(new Date());

  /* Custom Data Object for render or other usages */
  const openAddEventModal = async (selectedData) => {
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
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              defaultValue={getLocalDateStr(selectedData.start)}
              id="dateStart"
              min={now}
              type="datetime-local"
            />
          </div>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              defaultValue={
                // if same day, plus 2 hours
                getLocalDateStr(selectedData.start) ===
                getLocalDateStr(selectedData.end, -1)
                  ? getLocalDateStr(selectedData.end, -1, +2)
                  : getLocalDateStr(selectedData.end, -1)
              }
              id="dateEnd"
              min={now}
              type="datetime-local"
            />
          </div>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              Location
            </label>
            <input
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              id="location"
              placeholder="Location"
              type="text"
            />
          </div>
        </>
      ),
      showCloseButton: true,
      confirmButtonText: 'Submit',
      focusConfirm: false,
      preConfirm: () => {
        const getValue = (name) =>
          Swal.getPopup().querySelector(`#${name}`).value;

        const name = getValue('name');
        const dateStart = getValue('dateStart');
        const dateEnd = getValue('dateEnd');
        const location = getValue('location');

        if (!name || !dateEnd || !dateStart) {
          Swal.showValidationMessage(`Please enter all the required fields`);
        }
        return { name, dateStart, dateEnd, location };
      },
    });

    if (alertData.isConfirmed && alertData?.value) {
      const result = await createEvent(alertData.value);
      if (result?.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Event has been created',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Event has not been created',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const openShowEventModal = async (info) => {
    const { event } = info;
    const alertData = await Swal.fire({
      title: 'Update Event',
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
              defaultValue={event.title}
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
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              defaultValue={getLocalDateStr(event.start)}
              id="dateStart"
              min={now}
              type="datetime-local"
            />
          </div>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              defaultValue={getLocalDateStr(event.end)}
              id="dateEnd"
              min={now}
              type="datetime-local"
            />
          </div>
          <div className="relative w-full mb-3 flex p-4 flex-col">
            <label
              className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
              htmlFor="grid-password"
            >
              Location
            </label>
            <input
              className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              defaultValue={event.extendedProps.location || ''}
              id="location"
              placeholder="Location"
              type="text"
            />
          </div>
        </>
      ),
      confirmButtonText: 'Update',
      showDenyButton: true,
      denyButtonText: 'Delete',
      denyButtonColor: '#ee6666',
      showCloseButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const getValue = (name) =>
          Swal.getPopup().querySelector(`#${name}`).value;

        const name = getValue('name');
        const dateStart = getValue('dateStart');
        const dateEnd = getValue('dateEnd');
        const location = getValue('location');

        if (!name || !dateEnd || !dateStart) {
          Swal.showValidationMessage(`Please enter all the required fields`);
        }
        return { name, dateStart, dateEnd, location };
      },
    });

    if (alertData.isConfirmed && alertData?.value) {
      const result = await updateEvent(event.extendedProps.id, alertData.value);
      if (result?.status === 200) {
        Swal.fire({
          title: 'Success',
          text: 'Event has been updated',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Event has not been updated',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }

    if (alertData.isDenied) {
      const deleteConfirm = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#ee6666',
        confirmButtonText: 'Yes, delete it!',
        showCloseButton: true,
      });
      if (deleteConfirm.isConfirmed) {
        const result = await deleteEvent(event.extendedProps.id);
        if (result?.status === 200) {
          Swal.fire({
            title: 'Deleted',
            text: 'Event has been deleted',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Event has not been deleted',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    }
  };

  /* Render control function / logic */

  /* Data Change Listeners - useEffect/useMemo/useCallback */

  /* Styling */

  /* Render */
  return (
    <>
      <FullCalendar
        editable
        selectable
        eventClick={openShowEventModal}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        events={data?.map((item) => {
          return {
            title: item.name,
            start: getLocalDateStr(item.dateStart),
            end: getLocalDateStr(item.dateEnd),
            color: item.GUID ? 'orange' : '',
            editable: item.GUID ? 'false' : 'true',
            display: 'block',
            extendedProps: {
              id: item.id,
              location: item.location,
            },
          };
        })}
        height="80vh"
        longPressDelay={200}
        plugins={[dayGridPlugin, interactionPlugin]}
        select={openAddEventModal}
      />
    </>
  );
}

export default Calendar;

import { USER_DATA } from 'shared/constant';
import { parseJwt } from 'shared/helper';
import { renderToString } from 'react-dom/server';
import { useAPI } from 'hooks/useApi';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import Admin from 'layouts/Admin.js';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function Tables() {
  const { getGroup, createGroup, deleteGroup, getInvite, handleInvite } =
    useAPI();
  const groupQuery = useQuery(['groups'], () => getGroup());
  const inviteQuery = useQuery(['invite'], () => getInvite());

  const handleDeleteGroup = async (id) => {
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
      const result = deleteGroup(id);
      if (result?.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Group has been deleted',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        groupQuery.refetch();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Group has not been deleted',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const openAddGroupModal = async () => {
    const defaultRate = 80;
    const dom = (
      <>
        <div className="relative w-full mb-3 flex p-4 flex-col">
          <label
            className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
            htmlFor="grid-password"
          >
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            id="name"
            placeholder="Enter your group name"
            type="text"
          />
        </div>
        <div className="relative w-full mb-3 p-4 flex flex-row align-items-center">
          <p
            className="text-blueGray-600 text-md font-bold w-1/5 mr-3 self-center"
            htmlFor="grid-password"
          >
            Hidden Event
          </p>
          <input
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
            id="isEventHidden"
            type="checkbox"
          />
        </div>
        <div className="relative w-full mb-3 flex p-4 flex-col">
          <label
            className=" text-blueGray-600 text-md font-bold w-1/5 text-left"
            htmlFor="grid-password"
          >
            Vote Acceptence Rate
          </label>
          <input
            className="mt-4 border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            defaultValue={defaultRate}
            id="voteAcceptRate"
            type="range"
          />
          <p id="voteAcceptRateText">{`${defaultRate}%`}</p>
        </div>
      </>
    );
    const alertData = await Swal.fire({
      title: 'Create Group',
      html: renderToString(dom),
      confirmButtonText: 'Submit',
      focusConfirm: false,
      showCloseButton: true,
      didRender: () => {
        const isEventHidden = document.getElementById('isEventHidden');
        const rate = document.getElementById('voteAcceptRate');
        const rateText = document.getElementById('voteAcceptRateText');
        rate.addEventListener('change', (info) => {
          const { value } = info.target;
          if (value) rateText.innerText = `${value}%`;
        });
        isEventHidden.addEventListener('change', (info) => {
          const oldValue = info.target.value === 'true';
          info.target.value = !oldValue;
        });
      },
      preConfirm: () => {
        const getValue = (name) =>
          Swal.getPopup().querySelector(`#${name}`).value;
        const name = getValue('name');
        const isEventHidden = getValue('isEventHidden');
        const voteAcceptRate = getValue('voteAcceptRate');

        if (!name || !isEventHidden || !voteAcceptRate) {
          Swal.showValidationMessage(`Please enter all the required fields`);
        }
        return { name, isEventHidden, voteAcceptRate };
      },
    });

    if (alertData.isConfirmed && alertData?.value) {
      const { value } = alertData;
      const result = await createGroup({
        name: value.name,
        isEventHidden: value.isEventHidden === 'true',
        voteAcceptRate: Number(value.voteAcceptRate),
      });
      if (result?.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Group has been created',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        groupQuery.refetch();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Group has not been created',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const openJoinModal = async (data) => {
    const joinConfirm = await Swal.fire({
      title: 'Invitation',
      text: `Group "${data.group.name}" has invited you to join`,
      icon: 'info',
      showCancelButton: true,
      cancelButtonColor: '#ee6666',
      confirmButtonText: 'Yes, join it!',
      cancelButtonText: 'No',
      showCloseButton: true,
      allowOutsideClick: false,
    });
    await handleInvite(data.id, joinConfirm.isConfirmed);
    groupQuery.refetch();
  };

  useEffect(() => {
    const { data } = inviteQuery;
    if (data?.length > 0) openJoinModal(data[0]);
  }, [inviteQuery.data]);

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className="flex justify-end mb-4">
            <button
              className="bg-indigo-500 text-white active:bg-indigo-600 text-md font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={openAddGroupModal}
            >
              Create Group
            </button>
          </div>
          <div
            className={
              'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white'
            }
          >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className={'font-semibold text-lg text-blueGray-700'}>
                    Group List
                  </h3>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto min-h-screen-75">
              <table className="items-center w-full bg-transparent border-collapse overflow-x-scroll">
                <thead>
                  <tr>
                    <th
                      className={
                        'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                      }
                    >
                      Name
                    </th>
                    <th
                      className={
                        'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                      }
                    >
                      No. of People
                    </th>
                    <th
                      className={
                        'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                      }
                    >
                      Hidden Event
                    </th>
                    <th
                      className={
                        'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                      }
                    >
                      Accept Rate
                    </th>
                    <th
                      className={
                        'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                      }
                    >
                      Group Owner
                    </th>
                    <th
                      className={
                        'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                      }
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {groupQuery.data?.map((item) => (
                    <tr key={item.id}>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                        <span className={'font-bold text-blueGray-600'}>
                          {item.name}
                        </span>
                        {item.isUnvoted && (
                          <div className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2 py-0.5 rounded">
                            New Event
                          </div>
                        )}
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {item.users.length}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {item.isEventHidden ? 'Yes' : 'No'}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {`${item.voteAcceptRate}%`}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {`${item.groupOwner.firstName} ${item.groupOwner.lastName}`}
                      </td>
                      <td className="flex">
                        <Link href={`/group/${item.id}`}>
                          <div className="bg-indigo-500 text-white text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150 inline cursor-pointer">
                            Show
                          </div>
                        </Link>
                        {item.groupOwner.id ===
                          parseJwt(localStorage.getItem(USER_DATA))?.id && (
                          <button
                            className="bg-red-500 text-white text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150 inline cursor-pointer ml-3"
                            type="button"
                            onClick={() => {
                              handleDeleteGroup(item.id);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Tables.layout = Admin;

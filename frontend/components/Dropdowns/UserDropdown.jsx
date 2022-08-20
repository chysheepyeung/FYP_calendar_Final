import { USER_DATA } from 'shared/constant';
import { createPopper } from '@popperjs/core';
import { parseJwt } from 'shared/helper';
import { useAPI } from 'hooks/useApi';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';

const UserDropdown = () => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const router = useRouter();
  const { getUser } = useAPI();
  const [id, setId] = React.useState();
  const { data } = useQuery(['getUser', id], () => getUser(id), {
    enabled: id != null,
  });

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'bottom-start',
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const logout = () => {
    localStorage.removeItem(USER_DATA);
    router.push('/auth/login');
  };

  useEffect(() => {
    if (localStorage.getItem(USER_DATA))
      setId(parseJwt(localStorage.getItem(USER_DATA))?.id);
  }, []);

  return (
    <>
      <a
        ref={btnDropdownRef}
        className="text-blueGray-500 block"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full relative">
            <img
              alt="..."
              className="w-full rounded-full align-middle border-none shadow-lg"
              src={`https://avatars.dicebear.com/api/micah/${id}.svg`}
            />
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          'bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48'
        }
      >
        <div
          className={
            'text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
        >
          {`${data?.firstName} ${data?.lastName}`}
        </div>
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <Link href="/profile">
          <a
            className={
              'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
            }
            href="#"
          >
            Profile
          </a>
        </Link>
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <button
          className={
            'text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default UserDropdown;

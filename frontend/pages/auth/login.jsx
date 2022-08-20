import { USER_DATA } from '../../shared/constant';
import { toast } from 'react-toastify';
import { useAPI } from 'hooks/useApi';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Auth from 'layouts/Auth.js';
import ErrorMsg from 'components/Form/ErrorMsg';
import Link from 'next/link';

export default function Login() {
  const {
    register: addField,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { login } = useAPI();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result?.status === 201) {
      localStorage.setItem(USER_DATA, JSON.stringify(result.data));
      router.push('/user/calendar');
      return;
    }
    toast.error(result.data.message);
  };

  useEffect(() => {
    if (localStorage.getItem(USER_DATA) != undefined) {
      router.push('/user/calendar');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h1 className="text-blueGray-500 text-xl font-bold">Sign In</h1>
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Email
                  </label>
                  <input
                    {...addField('username', {
                      required: {
                        value: true,
                        message: 'Email is required',
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email format is invalid',
                      },
                    })}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Email"
                    type="email"
                  />
                  <ErrorMsg errors={errors} name="username" />
                </div>

                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Password
                  </label>
                  <input
                    {...addField('password', {
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                    type="password"
                  />
                  <ErrorMsg errors={errors} name="password" />
                </div>
                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      id="customCheckLogin"
                      type="checkbox"
                    />
                    <span className="ml-2 text-sm font-semibold text-blueGray-600">
                      Remember me
                    </span>
                  </label>
                </div>

                <div className="text-center mt-6">
                  <button
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-wrap mt-6 relative">
            <div className="w-1/2">
              <Link href="/auth/register">
                <a className="text-blueGray-200" href="#">
                  <small>Create new account</small>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.layout = Auth;

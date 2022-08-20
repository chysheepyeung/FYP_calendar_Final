export default function FooterAdmin() {
  return (
    <>
      <footer className="block py-4">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-blueGray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left">
                Copyright © {new Date().getFullYear()}{' '}
                <a
                  className="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1"
                  href="https://www.creative-tim.com?ref=nnjs-footer-admin"
                >
                  Philotes
                </a>
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li>
                  <a
                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                    href="https://www.creative-tim.com?ref=nnjs-footer-admin"
                  >
                    Philotes
                  </a>
                </li>
                <li>
                  <a
                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                    href="https://www.creative-tim.com/presentation?ref=nnjs-footer-admin"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                    href="http://blog.creative-tim.com?ref=nnjs-footer-admin"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                    href="https://github.com/creativetimofficial/notus-nextjs/blob/main/LICENSE.md?ref=nnjs-footer-admin"
                  >
                    MIT License
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

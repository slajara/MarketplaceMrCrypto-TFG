import Link from "next/link";

import MainLayout from "../components/layouts/MainLayout";

//style=background-image: 'url("/mrc-unrevealed.jpg")'
const FourZeroFour = () => {
  return (
    <MainLayout>
      <section
        style={{
          backgroundImage: 'url("/mrc-unrevealed.jpg")',
          backgroundSize: "65%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "black",
        }}
      >
        {" "}
        <div className="-mb-16 -mt-20 flex h-screen w-full items-center justify-center">
          <div className="mt-36 flex w-3/4 items-center justify-center">
            <div className="text-center">
              <h3 className="m-5 text-9xl font-bold text-primary">404</h3>
              <h2 className="m-5 text-center text-4xl">
                -<span className="font-bold"> Page Not Found</span> -
              </h2>
              <Link href="/" passHref>
                <p className="m-5 rounded-full border bg-gradient-to-tr from-dark via-primary to-dark p-2 text-2xl text-dark hover:scale-105">
                  {" "}
                  Go to homepage
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default FourZeroFour;

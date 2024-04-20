import CardEvent from "./CardEvent";

const Events: React.FC = () => {
  return (
    <>
      {/** <section style={{ backgroundColor: 'blue' }}> */}
      <section
        style={{
          backgroundImage: 'url("/beach-background.jpg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="mt-20">
          <h2
            className="mb-10 pt-10 text-center text-5xl font-bold text-dark"
            id="events"
          >
            {" "}
            Community Events{" "}
          </h2>
        </div>

        <section>
          <div className="flex">
            <div className=" w-1/2 px-10">
              <img src="/luf1.png" alt="Amarillo" className="h-auto w-full " />
            </div>
            <div className="w-1/2 p-5">
              <div className="grid grid-cols-3 gap-4">
                <CardEvent />
                <CardEvent />
                <CardEvent />
                <CardEvent />
                <CardEvent />
                <CardEvent />
                <CardEvent />
                <CardEvent />
                <CardEvent />
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Events;

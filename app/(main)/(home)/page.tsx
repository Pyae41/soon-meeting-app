'use client';

import MeetingTypeList from "@/components/MeetingTypeList";
import { useEffect, useState } from "react";

const Home = () => {

  const [now, setNow] = useState(new Date);

  useEffect(() => {
    setInterval(() => {
      setNow(new Date);
    }, 1000);
  }, []);

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: "2-digit" });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: "full" })).format(now);


  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col max-md:justify-center max-md:items-center md:p-24">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">
              {time.split(' ')[0]}
              <span className="font-normal text-2xl ms-2">{time.split(' ')[1]}</span>
            </h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  )
}

export default Home
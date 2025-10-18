"use client";

import { Tab } from "@headlessui/react";
import clsx from "clsx";

interface TabItem {
  title: string;
  content: React.ReactNode;
}

interface HeadlessTabsProps {
  tabs: TabItem[];
  defaultIndex?: number;
}

export function HeadlessTabs({ tabs, defaultIndex = 0 }: HeadlessTabsProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <Tab.Group
        defaultIndex={defaultIndex}
        as="div"
        className="flex flex-col h-full"
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1 shrink-0">
          {tabs.map((tab) => (
            <Tab
              key={tab.title}
              className={({ selected }) =>
                clsx(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary ring-white ring-opacity-60",
                  selected
                    ? "bg-white text-primary shadow"
                    : "text-gray-600 hover:bg-white/[0.6]"
                )
              }
            >
              {tab.title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 flex-grow overflow-hidden">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={clsx(
                "rounded-xl bg-white h-full overflow-y-auto",
                "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary ring-white ring-opacity-60"
              )}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

import type { ReactElement } from "react";

export function convertDate(date: string): string {
  if (!date) {
    return "";
  }

  const splitDate = date.split("-");
  const formatedDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;

  return formatedDate;
}

export function convertTime(runtime: number): string | ReactElement {
  if (!runtime) {
    return "";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return (
    <span>
      {hours}h {minutes}min
    </span>
  );
}

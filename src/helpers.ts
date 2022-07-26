import m from "mithril";

const uuid = () =>
  "xxxxxxxx".replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const Y = (g: Function) =>
  ((x: Function) => g((n: any) => x(x)(n)))((x: Function) =>
    g((n: any) => x(x)(n))
  );

const debounce = (fn: Function) => Y(fn);

const range = (size: number) => [...Array(size).keys()];

const log = (m: string) =>
  (v: any) => {
    console.log(m, v);
    return v;
  };

window.log = log;

const currentPresentationId = () => m.route.get().split("=")[1];
const threeSeconds = 3 * 1000;

export { currentPresentationId, debounce, log, range, threeSeconds, uuid };

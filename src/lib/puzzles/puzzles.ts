import { loadFromFEN, Board } from "./fenLoader";

export const getPuzzles = (): Board[] => [
  // board setup with just 1 black king and 1 white bishop
  loadFromFEN("7k/8/7B/8/8/8/8/8"),

  loadFromFEN("7k/8/5p1B/8/2r5/8/5r2/8"),
  loadFromFEN("2b5/8/1n5n/8/2k2r2/8/8/7B"),
  loadFromFEN("8/8/5n2/1k6/8/4r3/8/1B6"),
  loadFromFEN("2B5/8/2pn4/8/5n2/8/8/1k6"),
];

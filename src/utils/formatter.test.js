import { formatBytes } from "./formatter";

describe("formatBytes", () => {
  it.each([
    [1, "1 Bytes"],
    [12, "12 Bytes"],
    [64, "64 Bytes"],
    [130, "130 Bytes"],
  ])("formats number in Bytes", (number, expected) => {
    expect(formatBytes(number)).toEqual(expected);
  });

  it.each([
    [1050, "1.03 KB"],
    [12548, "12.25 KB"],
    [152548, "148.97 KB"],
  ])('formats number in KB"', (number, expected) => {
    expect(formatBytes(number)).toEqual(expected);
  });

  it.each([
    [1752548, "1.67 MB"],
    [218752548, "208.62 MB"],
  ])("formats number in MB", (number, expected) => {
    expect(formatBytes(number)).toEqual(expected);
  });

  it.each([
    [486218752548, "452.83 GB"],
    [3486218752548, "3.17 TB"],
  ])("formats number in GB", (number, expected) => {
    expect(formatBytes(number)).toEqual(expected);
  });

  it.each([[3486218752548, "3.17 TB"]])(
    "formats number in TB",
    (number, expected) => {
      expect(formatBytes(number)).toEqual(expected);
    }
  );
});

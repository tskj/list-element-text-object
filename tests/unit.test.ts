import { calculate_text_object } from "..";

/**
 * expects |b|ars to wrap a letter, which represents
 * the position of the cursor,
 * and ____ underscores to represent the selection
 */
const verify = (line: string, selection: string) => {
  const split = line.split("|");
  expect(split.length).toBe(3);
  expect(split[1].length).toBe(1);

  line = split.join("");

  const [a, b] = calculate_text_object(line, split[0].length);

  const sel = selection.substring(a, b);
  sel.split("").every(s => expect(s).toBe("_"));

  const removed = selection.split("");
  const del = removed.splice(a, b-a);
  del.every(s => expect(s).toBe("_"));

  const exploded_selection = selection.split("");
  const fixed_selection = exploded_selection.filter(s => s !== "_").join("");
  const removed_line = line.split("");
  removed_line.splice(a, b-a);
  expect(removed_line.join("")).toBe(fixed_selection);

  expect(removed.join("").length).toBe(line.length - (b - a));
  expect(del.length).toBe(b - a);
  expect(removed.findIndex(s => s === "_")).toBe(-1);
};

test("examples", () => {
  verify("|a|aa, bbb, ccc", "_____bbb, ccc");
  verify("a|a|a, bbb, ccc", "_____bbb, ccc");
  verify("aa|a|, bbb, ccc", "_____bbb, ccc");
  verify("aaa|,| bbb, ccc", "_____bbb, ccc");
  verify("aaa,| |bbb, ccc", "aaa, _____ccc");
  verify("aaa, |b|bb, ccc", "aaa, _____ccc");
  verify("aaa, b|b|b, ccc", "aaa, _____ccc");
  verify("aaa, bb|b|, ccc", "aaa, _____ccc");
  verify("aaa, bbb|,| ccc", "aaa, _____ccc");
  verify("aaa, bbb,| |ccc", "aaa, bbb_____");
  verify("aaa, bbb, |c|cc", "aaa, bbb_____");
  verify("aaa, bbb, c|c|c", "aaa, bbb_____");
  verify("aaa, bbb, cc|c|", "aaa, bbb_____");

  // verify("(|a|aa, bbb, ccc)", "(_____bbb, ccc)");
  // verify("(a|a|a, bbb, ccc)", "(_____bbb, ccc)");
  // verify("(aa|a|, bbb, ccc)", "(_____bbb, ccc)");
  // verify("(aaa|,| bbb, ccc)", "(_____bbb, ccc)");
  // verify("(aaa,| |bbb, ccc)", "(aaa, _____ccc)");
  // verify("(aaa, |b|bb, ccc)", "(aaa, _____ccc)");
  // verify("(aaa, b|b|b, ccc)", "(aaa, _____ccc)");
  // verify("(aaa, bbb,| |ccc)", "(aaa, bbb,____)");

  // verify("(aaa, bbb,| |ccc, d)", "(aaa, bbb, _____d)");
  // verify("(aaa, bbb, |c|cc, d)", "(aaa, bbb, _____d)");
  // verify("(aaa, bbb, ccc, |d|)", "(aaa, bbb, ccc,__)");

  // verify("(aaa|,|  bbb, ccc)", "(______bbb, ccc)");
  // verify("(aaa,| | bbb, ccc)", "(aaa,  _____ccc)");
  // verify("(aaa, | |bbb, ccc)", "(aaa,  _____ccc)");
  // verify("(aaa,  bbb|,| ccc)", "(aaa,  _____ccc)");
  // verify("(aaa,  bbb,| |ccc)", "(aaa,  bbb,____)");

  // verify("(aaa, bbb,| |ccc, )", "(aaa, bbb, _____)");
});

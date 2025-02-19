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

  let a, b;
  try {
    [a, b] = calculate_text_object(line, split[0].length);
  } catch {
    expect(selection.split("").findIndex(s => s === "_")).toBe(-1);
    return;
  }

  const exploded_selection = selection.split("");
  const fixed_selection = exploded_selection.filter(s => s !== "_").join("");
  const removed_line = line.split("");
  removed_line.splice(a, b-a);
  expect(removed_line.join("")).toBe(fixed_selection);

  const sel = selection.substring(a, b);
  sel.split("").every(s => expect(s).toBe("_"));

  const removed = selection.split("");
  const del = removed.splice(a, b-a);
  del.every(s => expect(s).toBe("_"));

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

  verify("|a|aa, bbb(x, y, z), ccc", "_____bbb(x, y, z), ccc");
  verify("aaa|,| bbb(x, y, z), ccc", "_____bbb(x, y, z), ccc");
  verify("aaa,| |bbb(x, y, z), ccc", "aaa, ______________ccc");
  verify("aaa, |b|bb(x, y, z), ccc", "aaa, ______________ccc");
  verify("aaa, b|b|b(x, y, z), ccc", "aaa, ______________ccc");
  verify("aaa, bb|b|(x, y, z), ccc", "aaa, ______________ccc");
  verify("aaa, bbb|(|x, y, z), ccc", "aaa, ______________ccc");
  verify("aaa, bbb(|x|, y, z), ccc", "aaa, bbb(___y, z), ccc");
  verify("aaa, bbb(x|,| y, z), ccc", "aaa, bbb(___y, z), ccc");
  verify("aaa, bbb(x,| |y, z), ccc", "aaa, bbb(x, ___z), ccc");
  verify("aaa, bbb(x, |y|, z), ccc", "aaa, bbb(x, ___z), ccc");
  verify("aaa, bbb(x, y|,| z), ccc", "aaa, bbb(x, ___z), ccc");
  verify("aaa, bbb(x, y,| |z), ccc", "aaa, bbb(x, y___), ccc");
  verify("aaa, bbb(x, y, |z|), ccc", "aaa, bbb(x, y___), ccc");
  verify("aaa, bbb(x, y, z|)|, ccc", "aaa, ______________ccc");
  verify("aaa, bbb(x, y, z)|,| ccc", "aaa, ______________ccc");
  verify("aaa, bbb(x, y, z),| |ccc", "aaa, bbb(x, y, z)_____");
  verify("aaa, bbb(x, y, z), |c|cc", "aaa, bbb(x, y, z)_____");
  verify("aaa, bbb(x, y, z), cc|c|", "aaa, bbb(x, y, z)_____");

  verify("|(|aaa, bbb(x, y, z), ccc),", "_________________________");

  verify("(|a|aa, bbb(x, y, z), ccc)", "(_____bbb(x, y, z), ccc)");
  verify("(aaa|,| bbb(x, y, z), ccc)", "(_____bbb(x, y, z), ccc)");
  verify("(aaa,| |bbb(x, y, z), ccc)", "(aaa, ______________ccc)");
  verify("(aaa, |b|bb(x, y, z), ccc)", "(aaa, ______________ccc)");
  verify("(aaa, b|b|b(x, y, z), ccc)", "(aaa, ______________ccc)");
  verify("(aaa, bb|b|(x, y, z), ccc)", "(aaa, ______________ccc)");
  verify("(aaa, bbb|(|x, y, z), ccc)", "(aaa, ______________ccc)");
  verify("(aaa, bbb(|x|, y, z), ccc)", "(aaa, bbb(___y, z), ccc)");
  verify("(aaa, bbb(x|,| y, z), ccc)", "(aaa, bbb(___y, z), ccc)");
  verify("(aaa, bbb(x,| |y, z), ccc)", "(aaa, bbb(x, ___z), ccc)");
  verify("(aaa, bbb(x, |y|, z), ccc)", "(aaa, bbb(x, ___z), ccc)");
  verify("(aaa, bbb(x, y|,| z), ccc)", "(aaa, bbb(x, ___z), ccc)");
  verify("(aaa, bbb(x, y,| |z), ccc)", "(aaa, bbb(x, y___), ccc)");
  verify("(aaa, bbb(x, y, |z|), ccc)", "(aaa, bbb(x, y___), ccc)");
  verify("(aaa, bbb(x, y, z|)|, ccc)", "(aaa, ______________ccc)");
  verify("(aaa, bbb(x, y, z)|,| ccc)", "(aaa, ______________ccc)");
  verify("(aaa, bbb(x, y, z),| |ccc)", "(aaa, bbb(x, y, z)_____)");
  verify("(aaa, bbb(x, y, z), |c|cc)", "(aaa, bbb(x, y, z)_____)");
  verify("(aaa, bbb(x, y, z), cc|c|)", "(aaa, bbb(x, y, z)_____)");

  verify("(|a|aa, bbb, ccc)", "(_____bbb, ccc)");
  verify("(a|a|a, bbb, ccc)", "(_____bbb, ccc)");
  verify("(aa|a|, bbb, ccc)", "(_____bbb, ccc)");
  verify("(aaa|,| bbb, ccc)", "(_____bbb, ccc)");
  verify("(aaa,| |bbb, ccc)", "(aaa, _____ccc)");
  verify("(aaa, |b|bb, ccc)", "(aaa, _____ccc)");
  verify("(aaa, b|b|b, ccc)", "(aaa, _____ccc)");
  verify("(aaa, bbb,| |ccc)", "(aaa, bbb_____)");
  verify("(aaa, bbb, |c|cc)", "(aaa, bbb_____)");

  verify("(| |aaa, bbb, ccc )", "( _____bbb, ccc )");
  verify("( |a|aa, bbb, ccc )", "( _____bbb, ccc )");
  verify("( aaa|,| bbb, ccc )", "( _____bbb, ccc )");
  verify("( aaa,| |bbb, ccc )", "( aaa, _____ccc )");
  verify("( aaa, |b|bb, ccc )", "( aaa, _____ccc )");
  verify("( aaa, bbb|,| ccc )", "( aaa, _____ccc )");
  verify("( aaa, bbb,| |ccc )", "( aaa, bbb______)");

  verify("(|a|aa, bbb, ccc,)", "(_____bbb, ccc,)");
  verify("(aaa|,| bbb, ccc,)", "(_____bbb, ccc,)");
  verify("(aaa,| |bbb, ccc,)", "(aaa, _____ccc,)");
  verify("(aaa, |b|bb, ccc,)", "(aaa, _____ccc,)");
  verify("(aaa, bbb|,| ccc,)", "(aaa, _____ccc,)");
  verify("(aaa, bbb,| |ccc,)", "(aaa, bbb,_____)");

  verify("(| |aaa, bbb, ccc, )", "( _____bbb, ccc, )");
  verify("( |a|aa, bbb, ccc, )", "( _____bbb, ccc, )");
  verify("( aaa|,| bbb, ccc, )", "( _____bbb, ccc, )");
  verify("( aaa,| |bbb, ccc, )", "( aaa, _____ccc, )");
  verify("( aaa, |b|bb, ccc, )", "( aaa, _____ccc, )");
  verify("( aaa, bbb|,| ccc, )", "( aaa, _____ccc, )");
  verify("( aaa, bbb,| |ccc, )", "( aaa, bbb, _____)");
  verify("( aaa, bbb, |c|cc, )", "( aaa, bbb, _____)");
  verify("( aaa, bbb, c|c|c, )", "( aaa, bbb, _____)");
  verify("( aaa, bbb, cc|c|, )", "( aaa, bbb, _____)");
  verify("( aaa, bbb, ccc|,| )", "( aaa, bbb, _____)");
  verify("( aaa, bbb, ccc,| |)", "( aaa, bbb, ccc__)");

  verify("(|a|aa , bbb , ccc ,)", "(______bbb , ccc ,)");
  verify("(aaa |,| bbb , ccc ,)", "(______bbb , ccc ,)");
  verify("(aaa ,| |bbb , ccc ,)", "(aaa , ______ccc ,)");
  verify("(aaa , | |bbb , ccc ,)", "(aaa ,  ______ccc ,)");
  verify("(aaa ,  bbb ,| |ccc ,)", "(aaa ,  bbb ,______)");

  verify("( aaa, bbb |,| ccc )", "( aaa, ______ccc )");
  verify("( aaa, bbb ,| |ccc )", "( aaa, bbb ______)");

  verify("(aaa, bbb,| |ccc, d)", "(aaa, bbb, _____d)");
  verify("(aaa, bbb, |c|cc, d)", "(aaa, bbb, _____d)");
  verify("(aaa, bbb, ccc,| |d)", "(aaa, bbb, ccc___)");
  verify("(aaa, bbb, ccc, |d|)", "(aaa, bbb, ccc___)");

  verify("(aaa|,|  bbb, ccc)", "(______bbb, ccc)");
  verify("(aaa,| | bbb, ccc)", "(aaa,  _____ccc)");
  verify("(aaa, | |bbb, ccc)", "(aaa,  _____ccc)");
  verify("(aaa,  bbb|,| ccc)", "(aaa,  _____ccc)");
  verify("(aaa,  bbb,| |ccc)", "(aaa,  bbb_____)");

  verify("(aaa, bbb,| |ccc, )", "(aaa, bbb, _____)");
  verify("(aaa, bbb, |c|cc, )", "(aaa, bbb, _____)");
  verify("(aaa, bbb, ccc|,| )", "(aaa, bbb, _____)");
  verify("(aaa, bbb, ccc,| |)", "(aaa, bbb, ccc__)");

  verify("(aaa, bbb ,  ccc|,|  )", "(aaa, bbb ,  ______)");
  verify("(aaa, bbb, ccc|,|  )", "(aaa, bbb, ______)");
  verify("(aaa, bbb, ccc,| | )", "(aaa, bbb, ccc___)");
  verify("(aaa, bbb, ccc, | |)", "(aaa, bbb, ccc___)");

  verify("(aaa|,| bbb,ccc)", "(_____bbb,ccc)");
  verify("(aaa,| |bbb,ccc)", "(aaa,_____ccc)");
  verify("(aaa, |b|bb,ccc)", "(aaa,_____ccc)");
  verify("(aaa, bb|b|,ccc)", "(aaa,_____ccc)");
  verify("(aaa, bbb|,|ccc)", "(aaa,_____ccc)");
  verify("(aaa, bbb,|c|cc)", "(aaa, bbb____)");
  verify("(aaa, bbb,c|c|c)", "(aaa, bbb____)");
  verify("(aaa, bbb,cc|c|)", "(aaa, bbb____)");
  //
  verify("|a|aa(), bbb(x, y, z), ccc", "_______bbb(x, y, z), ccc");
  verify("aaa(1, 2, [43]), bbb(|x|, y(a, b), z), ccc", "aaa(1, 2, [43]), bbb(___y(a, b), z), ccc");
  verify("aaa(1, 2, [43]), bbb(x,| |y(a, b), z), ccc", "aaa(1, 2, [43]), bbb(x, _________z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y|(|a, b), z), ccc", "aaa(1, 2, [43]), bbb(x, _________z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(a, b|)|, z), ccc", "aaa(1, 2, [43]), bbb(x, _________z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(a, b)|,| z), ccc", "aaa(1, 2, [43]), bbb(x, _________z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(a, b),| |z), ccc", "aaa(1, 2, [43]), bbb(x, y(a, b)___), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(a, |b|), z), ccc", "aaa(1, 2, [43]), bbb(x, y(a___), z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(a|,| b), z), ccc", "aaa(1, 2, [43]), bbb(x, y(___b), z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y( |a|, b), z), ccc", "aaa(1, 2, [43]), bbb(x, y( ___b), z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(  |a|, b), z), ccc", "aaa(1, 2, [43]), bbb(x, y(  ___b), z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(  a,| |b), z), ccc", "aaa(1, 2, [43]), bbb(x, y(  a___), z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(  a,| |b ), z), ccc", "aaa(1, 2, [43]), bbb(x, y(  a____), z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(  a, |b| ), z), ccc", "aaa(1, 2, [43]), bbb(x, y(  a____), z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(  a, b| |), z), ccc", "aaa(1, 2, [43]), bbb(x, y(  a____), z), ccc");
  verify("aaa(1, 2, [43]), bbb(x, y(  a, b,| |), z), ccc", "aaa(1, 2, [43]), bbb(x, y(  a, b__), z), ccc");

  verify('(aaa|,| "bbb", ccc)', '(_____"bbb", ccc)');
  verify('(aaa,| |"bbb", ccc)', '(aaa, _______ccc)');
  verify('(aaa, |"|bbb", ccc)', '(aaa, _______ccc)');
  verify('(aaa, "|b|bb", ccc)', '(aaa, _______ccc)');
  verify('(aaa, "bbb"|,| ccc)', '(aaa, _______ccc)');
  verify('(aaa, "bbb",| |ccc)', '(aaa, "bbb"_____)');

  verify('(aaa, "b[bb",| |ccc)', '(aaa, "b[bb"_____)');
  verify('(aaa, "b[b]b",| |ccc)', '(aaa, "b[b]b"_____)');
  verify('(aaa, "b[,b]b",| |ccc)', '(aaa, "b[,b]b"_____)');
  verify('(aaa, "b[,b](a,|c|,y)b", ccc)', '(aaa, _________________ccc)');
  verify('(aaa, "b[\',b](a,|c|,y)b", ccc)', '(aaa, __________________ccc)');
  verify('(aaa, "b[\\",b](a,|c|,y)b", ccc)', '(aaa, ___________________ccc)');

  verify('(aaa|,| f(a, "f(x, y)", b), ccc)', '(_____f(a, "f(x, y)", b), ccc)');
  verify('(aaa,| |f(a, "f(x, y)", b), ccc)', '(aaa, ____________________ccc)');
  verify('(aaa, f|(|a, "f(x, y)", b), ccc)', '(aaa, ____________________ccc)');
  verify('(aaa, f(a, "f(x, y)", b|)|, ccc)', '(aaa, ____________________ccc)');
  verify('(aaa, f(a, "f(x, y)", b)|,| ccc)', '(aaa, ____________________ccc)');
  verify('(aaa, f(a, "f(x, y)", b),| |ccc)', '(aaa, f(a, "f(x, y)", b)_____)');
  verify('(aaa, f(a, "f(x, y)", |b|), ccc)', '(aaa, f(a, "f(x, y)"___), ccc)');
  verify('(aaa, f(a, "f(x, y)"|,| b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a, "f(x, y)|"|, b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a, "f(x, y|)|", b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a, "f(x, |y|)", b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a, "f(x,| |y)", b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a, "f(x|,| y)", b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a, "f(|x|, y)", b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a, "f|(|x, y)", b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a, "|f|(x, y)", b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a, |"|f(x, y)", b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a,| |"f(x, y)", b), ccc)', '(aaa, f(a, ___________b), ccc)');
  verify('(aaa, f(a|,| "f(x, y)", b), ccc)', '(aaa, f(___"f(x, y)", b), ccc)');
  verify('(aaa, f(|a|, "f(x, y)", b), ccc)', '(aaa, f(___"f(x, y)", b), ccc)');

  verify('(aaa, f(a, "f(x, y//)", b|)|, ccc)', '(aaa, ______________________ccc)');
  verify('(aaa, f(a, "fx, y//)", b|)|, ccc)', '(aaa, _____________________ccc)');
  verify('(aaa, f(a, "fx((((, y//)", b|)|, ccc)', '(aaa, _________________________ccc)');
  verify('(aaa, f(a, "fx((|(|(, y//)", b), ccc)', '(aaa, f(a, ________________b), ccc)');

  verify('|a|bc, def, //', '_____def, //');
  verify('|a|bc, def, // 34, 34', '_____def, // 34, 34');
  verify('|a|bc, "def", // 34, 34', '_____"def", // 34, 34');

  // TODO: questionable behavior
  verify('abc, "de|f|" // 34, 34', 'abc________// 34, 34');
  verify('abc, "de|f|", // 34, 34', 'abc, _______// 34, 34'); // this is correct tho

  // here:
  verify('abc, "d|,|ef" // 34, 34', 'abc_________// 34, 34');
  verify('abc, "d,e|f|", // 34, 34', 'abc, ________// 34, 34');

  verify('abc, "de|f|", // 34, 34', 'abc, _______// 34, 34');
  verify('abc, def, // |3|4, 34', 'abc, def, // 34, 34');
  verify('abc,| |def, //', 'abc, _____//');
  verify('abc,| |def, // xyz', 'abc, _____// xyz');
});

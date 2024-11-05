
/**
 * precondition: cursor_index is within string
 */
export const calculate_text_object = (s: string, cursor_index: number): [number, number] => {
  if (cursor_index < 0) throw 'cursor_index not in string';
  if (cursor_index >= s.length) throw 'cursor_index not in string';

  let state = 'regular';
  let nesting_level = 0;
  let have_found_cursor = false;
  let relevant_list_separator_index = null;

  let cursor_is_in_state = null;
  let cursor_nesting_level = nesting_level;
  let end_index = null;
  let has_trailing_space;

  for (let i = 0; i <= s.length; i++) {
    if (end_index !== null) {
      break;
    }

    if (!have_found_cursor) {
      if (i === cursor_index) {
        have_found_cursor = true;
        cursor_is_in_state = state;
        cursor_nesting_level = nesting_level;
      }
    }

    switch (state) {

      case 'regular': {
        if (i === s.length) {
          if (!have_found_cursor) throw 'precondition broken';
          end_index = i;
          has_trailing_space = s[i-1] === " ";
        }

        if (s[i] === "'") {
          state = 'single-quote-string';
        }
        if (s[i] === '"') {
          state = 'double-quote-string'
        }

        const is_c_style_line_comment = s.substring(i, i+2) === "//";
        const is_lua_style_line_comment = s.substring(i, i+2) === "--";
        const is_python_style_line_comment = s[i] === "#";
        if (is_c_style_line_comment || is_lua_style_line_comment || is_python_style_line_comment) {
          if (have_found_cursor) {
            end_index = i;
            has_trailing_space = s[i-1] === " ";
          } else {
            throw 'cursor is in line comment';
          }
        }

        const is_closing_paren = s[i] === ")" || s[i] === "]";
        if (is_closing_paren) {
          if (nesting_level === cursor_nesting_level) {
            const have_passed_cursor = have_found_cursor && i !== cursor_index;
            if (have_passed_cursor) {
              end_index = i;
              has_trailing_space = s[i-1] === " ";
            }
          } else {
            nesting_level--;
          }
        }

        if (s[i] === "(" || s[i] === "[") {
          nesting_level++;
        }

        if (s[i] === "," && have_found_cursor && nesting_level === cursor_nesting_level) {
          relevant_list_separator_index = i;
          if (s[i+1] === " ") {
            has_trailing_space = true;
            i++;
            while (s[i] === " ") {
              i++;
            }
            end_index = i;
          } else {
            has_trailing_space = false;
            end_index = i + 1;
          }
        }
        break;
      }

      case 'single-quote-string': {
        if (i === s.length) {
          throw 'no support for multiline single-quote strings';
        }

        if (s.substring(i, i+2) === "\\'") {
          i++; // except
        }
        else if (s[i] === "'") {
          state = 'regular';
        }
        break;
      }

      case 'double-quote-string': {
        if (i === s.length) {
          throw 'no support for multiline double-quote strings';
        }

        if (s.substring(i, i+2) === '\\"') {
          i++; // except
        }
        else if (s[i] === '"') {
          state = 'regular';
        }
        break;
      }
    }
  }

  if (end_index === null) throw 'expected to have found end_index';

  nesting_level = cursor_nesting_level;

  let start_index = null;
  for (let i = relevant_list_separator_index ?? cursor_index; i >= 0; i--) {
    if (start_index !== null) break;

    switch (state) {

      case 'regular': {
        if (s[i] === ")" || s[i] === "]") {
          nesting_level++;
        }

        const is_opening_paren = s[i] === "(" || s[i] === "[";
        if (is_opening_paren) {
          if (nesting_level === cursor_nesting_level) {
            if (has_trailing_space) {
              while (s[i+1] === " ") {
                i++;
              }
            }
            start_index = i + 1;
          } else {
            nesting_level--;
          }
        }

        if (s[i] === "," && i !== relevant_list_separator_index) {
          if (nesting_level === cursor_nesting_level) {
            if (relevant_list_separator_index === null) {
              // there is no trailing list separator and
              // we're deleting the last element in the list
              start_index = i;
            } else {
              if (has_trailing_space) {
                while (s[i+1] === " ") {
                  i++;
                }
              }
              start_index = i + 1;
          }
          }
        }

        break;
      }

      case 'single-quote-string': {
        if (s.substring(i-1, i+1) === "\\'") {
          i--; // except
        }
        else if (s[i] === "'") {
          state = 'regular';
        }
        break;
      }

      case 'double-quote-string': {
        if (s.substring(i-1, i+1) === '\\"') {
          i--; // except
        }
        else if (s[i] === '"') {
          state = 'regular';
        }
        break;
      }
    }
  }

  if (start_index === null) start_index = 0;

  return [start_index, end_index];
};

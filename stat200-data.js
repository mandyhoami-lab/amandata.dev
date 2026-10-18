// hand-written, not compiled from .ts
/* STAT 200 practice-hub content: flashcards, typing drills, quizzes, etymology.
   window.STAT200 = { units: [...] } — plain, simple language throughout. */
window.STAT200 = {
units: [
{
id: "r-basics",
title: "R basics",
flashcards: [
{tag: "vectors", term: "c()", def: "Combine values into a vector. c(2, 4, 6) makes one vector from three numbers."},
{tag: "vectors", term: "vector", def: "A one-dimensional container. Every value inside must be the same type."},
{tag: "vectors", term: "length()", def: "How many elements are in a vector. length(c(2, 4, 6)) is 3."},
{tag: "vectors", term: "recycling", def: "When R reuses a shorter vector to match a longer one in math, with a warning if lengths do not divide evenly."},
{tag: "basics", term: "<-", def: "The assignment operator. x <- 5 stores 5 in x."},
{tag: "data frames", term: "data.frame()", def: "Builds a table: a list of equal-length vectors shown as rows and columns."},
{tag: "data frames", term: "$", def: "Pulls one column out of a data frame by name. df$age gives the age column."},
{tag: "subsetting", term: "[ ]", def: "Square brackets pick elements by position or condition. v[3] is the third element; df[df$age > 30, ] keeps matching rows."},
{tag: "inspection", term: "str()", def: "Shows the structure of an object: types, lengths, and the first few values."},
{tag: "inspection", term: "class()", def: "Tells you what kind of object something is, like \"data.frame\" or \"numeric\"."},
{tag: "types", term: "numeric / character / logical", def: "The three basic atomic types: numbers, text, and TRUE/FALSE."},
{tag: "types", term: "TRUE and FALSE", def: "Logical values. In math, TRUE counts as 1 and FALSE counts as 0."},
{tag: "missing data", term: "NA", def: "Marks a missing value. Most summary functions return NA unless you add na.rm = TRUE."},
{tag: "summary", term: "mean() / median() / sd()", def: "Average, middle value, and standard deviation of a vector."},
{tag: "plotting", term: "plot()", def: "Base R quick plot. plot(x, y) draws a scatterplot of y against x."}
],
typing: [
{prompt: "Make a vector with the numbers 1 to 5 and store it as x", answer: "x <- 1:5", hint: "the colon builds a sequence"},
{prompt: "Find the average of the values in x", answer: "mean(x)", hint: "starts with m"},
{prompt: "Pull the 'age' column out of the data frame df", answer: "df$age", hint: "dollar sign, then the column name"},
{prompt: "Get the third element of vector v", answer: "v[3]", hint: "square brackets, position inside"},
{prompt: "Check what kind of object df is", answer: "class(df)", hint: "what class is it?"},
{prompt: "Count how many values are in x", answer: "length(x)", hint: "how long is it?"},
{prompt: "Make a scatterplot of y against x", answer: "plot(x, y)", hint: "base R plot, x first then y"},
{prompt: "Keep only the rows of df where age is over 30", answer: "df[df$age > 30, ]", hint: "condition in brackets, comma keeps all columns"},
{prompt: "Combine 2, 4, 6 into one vector", answer: "c(2, 4, 6)", hint: "c is for combine"},
{prompt: "Find the biggest value in x", answer: "max(x)", hint: "opposite of min"}
],
quiz: [
{q: "What does x <- 1:5 create?", choices: ["A vector holding just 1 and 5", "A vector of the numbers 1 through 5", "The single number 15", "A data frame with 5 rows"], correct: 1, explain: "The colon operator builds a sequence from 1 to 5."},
{q: "What is the result of c(1, 2) + c(10, 20, 30)?", choices: ["An error — the lengths differ", "c(11, 22)", "c(11, 22, 31), plus a warning", "c(11, 22, 31) with no warning"], correct: 2, explain: "R recycles the shorter vector; 2 does not divide 3 evenly, so you get a warning."},
{q: "Which of these pulls the column named 'score' out of data frame d?", choices: ["score$d", "d -> score", "d$score", "d(score)"], correct: 2, explain: "$ extracts a named column from a data frame or list."},
{q: "df[df$age > 30, ] returns…", choices: ["Rows where age is over 30, keeping all columns", "A single number", "Rows where age is under 30", "Only the age column"], correct: 0, explain: "The condition picks the rows; the empty spot after the comma keeps every column."},
{q: "What does str(mtcars) do?", choices: ["Draws a scatterplot", "Shows the structure: column types and sample values", "Converts it to a matrix", "Sorts the data frame"], correct: 1, explain: "str() prints a compact summary of an object’s structure."},
{q: "Which value means “missing” in R?", choices: ["0", "NULL", "NaN", "NA"], correct: 3, explain: "NA = not available. NaN is bad math like 0/0; NULL is an empty object."},
{q: "x <- c(TRUE, FALSE, TRUE); what is sum(x)?", choices: ["3", "It throws an error", "2", "TRUE"], correct: 2, explain: "TRUE counts as 1 and FALSE as 0 in math."},
{q: "Why does mean(c(1, 2, NA)) return NA?", choices: ["The vector is too short", "NA is treated as zero", "mean() cannot take a vector", "NA poisons the result unless you add na.rm = TRUE"], correct: 3, explain: "Most summary functions return NA if any input is NA; na.rm = TRUE drops them first."}
],
etymology: [
{term: "R", origin: "Named after creators Ross Ihaka and Robert Gentleman — and as a play on S, the language R grew out of.", note: "The single-letter name keeps the family joke going."},
{term: "vector", origin: "From Latin “vehere”, to carry.", note: "In R a vector carries values, all of one type."},
{term: "data frame", origin: "Inherited from the S language, R’s predecessor.", note: "A list of equal-length vectors, framed as a table."},
{term: "NA", origin: "Short for “Not Available”.", note: "R’s dedicated marker for missing data — different from NULL (empty) and NaN (bad math)."},
{term: "factor", origin: "Statistics term for a categorical variable — experimental factors have levels.", note: "R stores factors as integer codes with text labels."},
{term: "c()", origin: "Short for “combine” (also described as “concatenate”).", note: "Glues values together into one vector."},
{term: "plot()", origin: "Plain English — it draws the default plot for whatever you hand it.", note: "Base R’s quick-look graphics function."}
]
},
{
id: "programming",
title: "Programming",
flashcards: [
{tag: "conditionals", term: "if", def: "Runs code only when a condition is TRUE. if (x > 10) { ... }."},
{tag: "conditionals", term: "else", def: "Runs when the if condition is FALSE. Tack it on: } else { ... }."},
{tag: "functions", term: "function", def: "Bundles reusable code. f <- function(n) { n + 1 } makes a function named f."},
{tag: "functions", term: "return()", def: "Sends a value back from a function. R also returns the last value automatically."},
{tag: "loops", term: "for", def: "Loops a set number of times. for (i in 1:10) runs ten times."},
{tag: "loops", term: "while", def: "Loops until a condition turns FALSE. while (x < 5) keeps going while x is small."},
{tag: "loops", term: "break", def: "Exits a loop immediately."},
{tag: "loops", term: "next", def: "Skips the rest of this round and jumps to the next iteration."},
{tag: "apply", term: "lapply()", def: "Applies a function to each element of a list. Always returns a list."},
{tag: "apply", term: "sapply()", def: "Like lapply, but simplifies the result to a vector or matrix when it can."},
{tag: "operators", term: "== vs <-", def: "== tests whether two things are equal; <- stores a value in a name. Do not mix them up."},
{tag: "logic", term: "& and |", def: "AND / OR done element by element on whole vectors."},
{tag: "logic", term: "&& and ||", def: "AND / OR for single TRUE/FALSE values. They short-circuit: stop at the first decisive answer."},
{tag: "errors", term: "stop()", def: "Throws an error with your message and halts the code."}
],
typing: [
{prompt: "Write a function called add_one that adds 1 to its input n", answer: "add_one <- function(n) { n + 1 }", hint: "function(n), then the body in braces"},
{prompt: "Loop i from 1 to 10, printing each value", answer: "for (i in 1:10) { print(i) }", hint: "for (i in ...)"},
{prompt: "Apply mean to each column of df with lapply", answer: "lapply(df, mean)", hint: "l-apply: list in, list out"},
{prompt: "Same thing, but simplified to a vector", answer: "sapply(df, mean)", hint: "s is for simplify"},
{prompt: "If x is over 100, print the word big", answer: "if (x > 100) { print(\"big\") }", hint: "if (condition) { action } — use single quotes inside if needed"},
{prompt: "Add an else branch that prints small", answer: "if (x > 100) { print(\"big\") } else { print(\"small\") }", hint: "tack else { } onto the end"},
{prompt: "Keep adding 1 to x while x is less than 5", answer: "while (x < 5) { x <- x + 1 }", hint: "while (condition)"},
{prompt: "Exit the loop as soon as i equals 3", answer: "if (i == 3) { break }", hint: "break exits the loop"},
{prompt: "Test whether x equals 5 (do not assign)", answer: "x == 5", hint: "double equals tests equality"},
{prompt: "Apply sqrt to every element of v with sapply", answer: "sapply(v, sqrt)", hint: "sapply(vector, function)"}
],
quiz: [
{q: "What does this print? x <- 5; if (x > 10) { print(\"a\") } else { print(\"b\") }", choices: ["Nothing", "An error", "\"b\"", "\"a\""], correct: 2, explain: "5 is not greater than 10, so the else branch runs."},
{q: "How many times does for (i in 1:3) { print(i) } print?", choices: ["4", "0", "1", "3"], correct: 3, explain: "i takes the values 1, 2, 3 — one print each."},
{q: "lapply(list(1:3, 4:6), sum) returns…", choices: ["A list: list(6, 15)", "21", "An error", "The vector c(6, 15)"], correct: 0, explain: "lapply always returns a list; sapply would simplify it to a vector."},
{q: "If a function has no return() call, what does R give back?", choices: ["Nothing at all", "An error", "The value of the last expression", "NULL"], correct: 2, explain: "R automatically returns the last evaluated value."},
{q: "Which assignment style do R style guides recommend?", choices: ["Neither one works", "x = 3 (equals sign)", "x <- 3 (arrow)", "Both are equally recommended"], correct: 2, explain: "= also assigns, but <- is the convention and avoids confusion with function arguments."},
{q: "What is the danger of while (TRUE) { }?", choices: ["It runs exactly once", "It always throws an error", "An infinite loop", "Nothing — it is harmless"], correct: 2, explain: "The condition never turns FALSE, so it loops forever unless break stops it."},
{q: "c(TRUE, FALSE) & c(TRUE, TRUE) gives…", choices: ["An error", "TRUE", "c(TRUE, TRUE)", "c(TRUE, FALSE)"], correct: 3, explain: "& works element by element; && only looks at the first element."},
{q: "f <- function(a, b = 2) { a + b }; what is f(5)?", choices: ["An error", "2", "5", "7"], correct: 3, explain: "b defaults to 2, so f(5) computes 5 + 2."}
],
etymology: [
{term: "lapply / sapply", origin: "“Apply” a function over elements: l = list (returns a list), s = simplify (simplifies the result).", note: "The original apply() works over the rows/columns (margins) of a matrix."},
{term: "break / next", origin: "Borrowed from C. R uses “next” where C says “continue”.", note: "break exits the loop; next skips to the next round."},
{term: "for / while", origin: "Loop keywords inherited from C, via the S language.", note: "Same words, same jobs as in C."},
{term: "function", origin: "From Latin “functio”, a performance or execution.", note: "In R, functions are first-class: you can pass them around like data."},
{term: "NULL", origin: "From Latin “nullus”, none.", note: "An empty object — different from NA, which means a value is missing."},
{term: "stop() / warning() / message()", origin: "Plain English words, chosen on purpose.", note: "R’s condition system avoids cryptic codes: stop halts, warning warns, message informs."},
{term: "T / F shorthand", origin: "Short for TRUE and FALSE — but they are ordinary variables you can overwrite by accident.", note: "Style guides say to always write TRUE and FALSE out in full."}
]
},
{
id: "wrangling",
title: "Wrangling",
flashcards: [
{tag: "dplyr", term: "filter()", def: "Keeps rows that match a condition. filter(df, age > 30) keeps the over-30 rows."},
{tag: "dplyr", term: "select()", def: "Keeps or drops columns by name. select(df, name, age) keeps two columns."},
{tag: "dplyr", term: "mutate()", def: "Adds new columns or changes old ones. mutate(df, z = x + y)."},
{tag: "dplyr", term: "arrange()", def: "Sorts rows. arrange(df, age) sorts youngest first; arrange(df, desc(age)) oldest first."},
{tag: "dplyr", term: "summarise()", def: "Collapses rows into summary values. Often paired with group_by()."},
{tag: "dplyr", term: "group_by()", def: "Groups rows so the next verbs act separately on each group."},
{tag: "pipes", term: "%>%", def: "The pipe. Sends the result on the left into the function on the right: df %>% filter(age > 30)."},
{tag: "tidyr", term: "pivot_longer()", def: "Reshapes wide data into long data: many columns become key/value pairs."},
{tag: "tidyr", term: "pivot_wider()", def: "Reshapes long data into wide data: key/value pairs become columns."},
{tag: "tidyr", term: "separate() / unite()", def: "separate() splits one column into many; unite() pastes many columns into one."},
{tag: "joins", term: "left_join()", def: "Merges two tables, keeping every row from the left (first) table."},
{tag: "readr", term: "read_csv()", def: "Reads a CSV file quickly into a tibble. read_csv(\"data.csv\")."},
{tag: "stringr", term: "str_detect()", def: "TRUE/FALSE: does the string match a pattern? str_detect(s, \"cat\")."},
{tag: "regex", term: "regex", def: "Regular expression: a mini-language for describing text patterns. ^pre means “starts with pre”."},
{tag: "tibbles", term: "tibble", def: "The tidyverse’s modern data frame. Prints compactly and never silently drops dimensions."}
],
typing: [
{prompt: "Keep rows of df where age is over 30, using dplyr", answer: "filter(df, age > 30)", hint: "filter keeps rows"},
{prompt: "Keep only the name and age columns of df", answer: "select(df, name, age)", hint: "select picks columns"},
{prompt: "Add a column double_age equal to age times 2", answer: "mutate(df, double_age = age * 2)", hint: "mutate makes columns"},
{prompt: "Sort df by age, youngest first", answer: "arrange(df, age)", hint: "arrange sorts rows"},
{prompt: "Pipe: filter age over 30, then keep only name", answer: "df %>% filter(age > 30) %>% select(name)", hint: "chain with %>%"},
{prompt: "Mean age per group in the grp column", answer: "df %>% group_by(grp) %>% summarise(mean_age = mean(age))", hint: "group, then summarise"},
{prompt: "Read the file 'data.csv' with readr", answer: "read_csv('data.csv')", hint: "readr’s read_csv, filename in quotes"},
{prompt: "TRUE/FALSE: does each string in s contain 'cat'?", answer: "str_detect(s, \"cat\")", hint: "stringr’s str_detect"},
{prompt: "Join df1 and df2 on id, keeping all rows of df1", answer: "left_join(df1, df2, by = \"id\")", hint: "left keeps the left table"},
{prompt: "Reshape df to long format, gathering every column except id", answer: "pivot_longer(df, cols = -id)", hint: "minus id means id stays put"}
],
quiz: [
{q: "df %>% filter(age > 30) %>% select(name) does what?", choices: ["Sorts the rows by age", "Keeps over-30 rows, then keeps only the name column", "Keeps the name column, then filters rows", "Deletes the name column"], correct: 1, explain: "Pipes run left to right: filter the rows first, then pick the columns."},
{q: "filter() works on ___, while select() works on ___.", choices: ["columns, columns", "rows, columns", "columns, rows", "rows, rows"], correct: 1, explain: "filter subsets rows; select subsets columns."},
{q: "What does mutate(df, z = x + y) do?", choices: ["Renames df to z", "Adds a column z equal to x + y", "Adds a new row", "Deletes columns x and y"], correct: 1, explain: "mutate adds new columns (or overwrites existing ones)."},
{q: "After group_by(species), summarise(mean_wt = mean(weight)) returns…", choices: ["An error", "A single row for the whole data", "One row per species with its mean weight", "The original data unchanged"], correct: 2, explain: "summarise collapses each group down to one row."},
{q: "left_join(a, b, by = \"id\") keeps…", choices: ["Only rows that match in both", "Every row of b, with matches from a", "Every row of a, with matches from b", "Every row of both tables"], correct: 2, explain: "“Left” means keep everything from the left (first) table."},
{q: "Which regex matches strings that start with “pre”?", choices: ["pre*", "pre$", "(pre)", "^pre"], correct: 3, explain: "^ anchors the pattern to the start; $ anchors to the end."},
{q: "str_detect(c(\"cat\", \"dog\"), \"o\") returns…", choices: ["c(TRUE, FALSE)", "TRUE", "c(FALSE, TRUE)", "c(\"dog\")"], correct: 2, explain: "Only “dog” contains the letter o."},
{q: "How does a tibble differ from a base data frame?", choices: ["Nicer printing and stricter subsetting", "It does math faster", "It needs no packages", "It can only hold numbers"], correct: 0, explain: "Tibbles print compactly and never do partial name matching or silently drop dimensions."}
],
etymology: [
{term: "dplyr", origin: "“d” for data frames + “plyr”, Hadley Wickham’s earlier package — pronounced like “pliers”.", note: "A set of tools (pliers) for data frames."},
{term: "tidyr", origin: "“tidy” + “r”: tools for tidying messy data.", note: "Tidy data: one variable per column, one observation per row."},
{term: "readr", origin: "“read” + “r”: fast, friendly file reading.", note: "read_csv() and friends return tibbles, not base data frames."},
{term: "stringr", origin: "“string” + “r”: consistent string tools.", note: "Every function starts with str_, so they are easy to find."},
{term: "tibble", origin: "A playful twist on “table”.", note: "The tidyverse’s stricter, better-printing take on the data frame."},
{term: "magrittr", origin: "Named for surrealist painter René Magritte — “Ceci n’est pas une pipe” (“This is not a pipe”).", note: "The package behind the %>% pipe operator."},
{term: "pivot_longer / pivot_wider", origin: "Replaced the older gather() and spread(); “pivot” like pivoting a spreadsheet.", note: "The pivot metaphor stuck because it matches Excel language."},
{term: "regex", origin: "Short for “regular expression”, from 1950s formal language theory (Kleene).", note: "A pattern language for text, far older than R."}
]
},
{
id: "visualization",
title: "Visualization",
flashcards: [
{tag: "basics", term: "ggplot()", def: "Starts a plot. You add layers with +. ggplot(df, aes(x = age, y = weight))."},
{tag: "basics", term: "+", def: "Adds layers and components to a ggplot, one piece at a time."},
{tag: "aesthetics", term: "aes()", def: "Short for “aesthetics”. Maps data columns to visual properties: x, y, color, size."},
{tag: "aesthetics", term: "mapping vs setting", def: "Inside aes() maps data to visuals; outside aes() sets one constant, like color = \"red\"."},
{tag: "geoms", term: "geom_point()", def: "Scatterplot layer: one dot per observation."},
{tag: "geoms", term: "geom_line()", def: "Line layer: connects points in order."},
{tag: "geoms", term: "geom_bar()", def: "Bar chart layer: counts categories for you."},
{tag: "geoms", term: "geom_histogram()", def: "Histogram layer: bins a continuous variable."},
{tag: "geoms", term: "geom_boxplot()", def: "Boxplot layer: shows median, quartiles, and outliers per group."},
{tag: "geoms", term: "geom_smooth()", def: "Adds a trend line with a confidence band."},
{tag: "labels", term: "labs()", def: "Sets text labels: title, subtitle, x, y, color, and more."},
{tag: "facets", term: "facet_wrap()", def: "Splits the plot into small panels, one per level of a grouping variable."},
{tag: "themes", term: "theme_minimal()", def: "A clean, pre-made plot theme. Swap themes with one line."},
{tag: "saving", term: "ggsave()", def: "Saves the last plot to a file. ggsave(\"plot.png\")."}
],
typing: [
{prompt: "Start a ggplot of df with x = age and y = weight", answer: "ggplot(df, aes(x = age, y = weight))", hint: "ggplot(data, aes(...))"},
{prompt: "Add scatterplot points to that plot", answer: "+ geom_point()", hint: "plus geom_point()"},
{prompt: "Scatterplot of weight vs age, points colored by group", answer: "ggplot(df, aes(x = age, y = weight, color = group)) + geom_point()", hint: "map color inside aes()"},
{prompt: "Add a smooth trend line to the plot", answer: "+ geom_smooth()", hint: "geom_smooth"},
{prompt: "Title the plot \"My Plot\"", answer: "+ labs(title = \"My Plot\")", hint: "labs sets the labels"},
{prompt: "Split the plot into panels by species", answer: "+ facet_wrap(~ species)", hint: "facet_wrap with a tilde"},
{prompt: "Bar chart of the counts of each group", answer: "ggplot(df, aes(x = group)) + geom_bar()", hint: "geom_bar counts for you"},
{prompt: "Histogram of age", answer: "ggplot(df, aes(x = age)) + geom_histogram()", hint: "geom_histogram"},
{prompt: "Boxplot of weight for each group", answer: "ggplot(df, aes(x = group, y = weight)) + geom_boxplot()", hint: "x gets the groups, y the numbers"},
{prompt: "Save the last plot as plot.png", answer: "ggsave('plot.png')", hint: "ggsave with the filename"}
],
quiz: [
{q: "In ggplot(df, aes(x = age, y = weight)) + geom_point(), what does aes() do?", choices: ["Chooses the file format", "Sets the plot title", "Maps data columns to visual properties", "Draws the points themselves"], correct: 2, explain: "aes() = aesthetics: which column goes to x, y, color, and so on."},
{q: "Which of these makes all points red?", choices: ["geom_point(aes(colour = red))", "geom_point(aes(color = \"red\"))", "geom_red()", "geom_point(color = \"red\")"], correct: 3, explain: "Outside aes() sets a constant; inside aes() it would map data and draw a legend."},
{q: "What does the + do in ggplot2 code?", choices: ["Adds layers and components to the plot", "Joins strings", "Nothing — it is decorative", "Adds two numbers together"], correct: 0, explain: "ggplot2 builds a plot by adding layers with +."},
{q: "facet_wrap(~ species) produces…", choices: ["Species on the x-axis of one plot", "A 3D plot", "An error", "One small panel per species"], correct: 3, explain: "Facets split the data into one panel per group."},
{q: "Which geom draws a histogram?", choices: ["geom_bar()", "geom_histogram()", "geom_density()", "geom_hist()"], correct: 1, explain: "geom_histogram bins a continuous variable; geom_bar counts categories."},
{q: "For a boxplot of weight split by group, the mapping is…", choices: ["aes(y = group)", "aes(box = group)", "aes(x = group, y = weight)", "aes(x = weight, y = group)"], correct: 2, explain: "x gets the categories, y gets the numbers."},
{q: "labs(title = \"T\", x = \"Age\") does what?", choices: ["Changes the underlying data", "Picks the point colors", "Sets the title and the x-axis label", "Saves the plot to disk"], correct: 2, explain: "labs() sets text: title, subtitle, x, y, color…"},
{q: "geom_smooth() with defaults adds…", choices: ["A second dataset", "Only a straight regression line", "A smoothed trend line with a confidence band", "Error bars on every point"], correct: 2, explain: "The default is a loess smooth with a shaded confidence interval."}
],
etymology: [
{term: "ggplot2", origin: "“Grammar of Graphics” plot, version 2 — the successor to the original ggplot.", note: "The 2 marks it as a full rewrite, not a patch."},
{term: "Grammar of Graphics", origin: "Leland Wilkinson’s 1999 book: plots are built from layered components.", note: "ggplot2 implements it literally — data + aesthetics + geoms, added with +."},
{term: "aes", origin: "Short for “aesthetics”: the visual properties data maps onto.", note: "x, y, color, size, shape — all aesthetics."},
{term: "geom", origin: "Short for “geometric object”: the shape that represents the data.", note: "Points, lines, bars, boxes — each is a geom."},
{term: "facet", origin: "Like a facet of a cut gem: one small face of a bigger display.", note: "facet_wrap() and facet_grid() split plots into panels."},
{term: "Hadley Wickham", origin: "Author of ggplot2 and the tidyverse packages.", note: "Also behind dplyr, tidyr, readr, stringr — half this course’s toolkit."},
{term: "Leland Wilkinson", origin: "Statistician who wrote The Grammar of Graphics (1999).", note: "His layered theory of plots is what ggplot2 is built on."}
]
},
{
id: "modeling",
title: "Modeling and inference",
flashcards: [
{tag: "resampling", term: "bootstrapping", def: "Resampling your data with replacement to estimate uncertainty, like standard errors."},
{tag: "resampling", term: "sampling with replacement", def: "Each draw can pick the same row again. This is what makes a bootstrap sample."},
{tag: "regression", term: "lm()", def: "Fits a linear model. lm(weight ~ age, data = df)."},
{tag: "regression", term: "y ~ x", def: "Formula syntax: “y modeled as a function of x”."},
{tag: "regression", term: "coefficients", def: "The intercept and slopes that lm() estimates. coef(m) pulls them out."},
{tag: "regression", term: "residuals", def: "Actual minus predicted: what the model got wrong on each point. resid(m)."},
{tag: "regression", term: "R-squared", def: "Fraction of the variation in y explained by the model, from 0 to 1. summary(m)$r.squared."},
{tag: "regression", term: "predict()", def: "Makes predictions from a fitted model on new data. predict(m, newdata = newdf)."},
{tag: "regression", term: "summary()", def: "Prints model details: coefficients, R-squared, p-values."},
{tag: "knn", term: "kNN", def: "k-nearest neighbors: classify a point by the majority class of its k closest neighbors."},
{tag: "evaluation", term: "training vs test", def: "Fit the model on training data; check it on held-out test data it has never seen."},
{tag: "evaluation", term: "overfitting", def: "The model memorizes training noise and fails on new data."},
{tag: "inference", term: "confidence interval", def: "A range of plausible values for a statistic, built e.g. from bootstrap percentiles."},
{tag: "inference", term: "p-value", def: "Probability of seeing results this extreme if there were no real effect. Small = surprising under “nothing going on”."}
],
typing: [
{prompt: "Fit a linear model predicting weight from age in df", answer: "lm(weight ~ age, data = df)", hint: "lm(y ~ x, data = ...)"},
{prompt: "Store that model as m", answer: "m <- lm(weight ~ age, data = df)", hint: "assign it with <-"},
{prompt: "Get the intercept and slope out of m", answer: "coef(m)", hint: "short for coefficients"},
{prompt: "Print the full summary of model m", answer: "summary(m)", hint: "one word: summary"},
{prompt: "Predict with m on the new data frame newdf", answer: "predict(m, newdata = newdf)", hint: "predict(model, newdata = ...)"},
{prompt: "Get the residuals of model m", answer: "resid(m)", hint: "short for residuals"},
{prompt: "Bootstrap: resample the rows of df with replacement", answer: "df[sample(nrow(df), replace = TRUE), ]", hint: "sample the row numbers with replace = TRUE"},
{prompt: "Mean weight of the bootstrap resample b", answer: "mean(b$weight)", hint: "mean of the column"},
{prompt: "Repeat a bootstrap mean 1000 times, collecting results", answer: "replicate(1000, mean(sample(df$weight, replace = TRUE)))", hint: "replicate(n, expression)"},
{prompt: "Pull the R-squared out of model m", answer: "summary(m)$r.squared", hint: "it lives inside the summary"}
],
quiz: [
{q: "In lm(weight ~ age, data = df), the ~ means…", choices: ["“approximately equal to”", "“modeled as a function of”", "“proportional to”", "“divided by”"], correct: 1, explain: "Formulas read as “y as a function of x”."},
{q: "A residual is…", choices: ["The slope of the fitted line", "The R-squared of the model", "Actual value minus predicted value", "Predicted value minus actual value"], correct: 2, explain: "Residual = what the model got wrong on that point."},
{q: "R-squared = 0.85 means…", choices: ["85% of predictions are exactly right", "The model explains 85% of the variation in y", "The model is 85% accurate", "The slope of the line is 0.85"], correct: 1, explain: "R-squared is the fraction of variance explained — not “percent correct”."},
{q: "Bootstrapping estimates uncertainty by…", choices: ["Averaging other studies", "Resampling your own data with replacement", "Assuming the data are normal", "Collecting a brand-new dataset"], correct: 1, explain: "The bootstrap treats your sample as a stand-in for the population."},
{q: "kNN with k = 1 classifies a new point as…", choices: ["The most common class overall", "The class of its single nearest neighbor", "A randomly picked class", "It refuses to classify"], correct: 1, explain: "k = 1 means: copy the label of the closest point."},
{q: "Why split data into training and test sets?", choices: ["To check the model on data it has never seen", "To make model fitting run faster", "Because R requires it", "To double the amount of data"], correct: 0, explain: "Test data exposes overfitting — memorizing training noise."},
{q: "predict(m, newdata = newdf) fails when newdf…", choices: ["Has more rows than the training data", "Is a tibble instead of a data frame", "Has extra columns beyond the predictors", "Is missing a predictor column the model needs"], correct: 3, explain: "Every predictor column must be present in newdata."},
{q: "What does coef(m) return for m <- lm(y ~ x)?", choices: ["The intercept and the slope", "The p-values", "The residuals", "The R-squared value"], correct: 0, explain: "coef() gives the estimated intercept and slope(s)."}
],
etymology: [
{term: "bootstrap", origin: "“Pull yourself up by your bootstraps”: getting results from your own resources alone.", note: "The statistical bootstrap gets uncertainty estimates from the sample itself — no new data needed."},
{term: "regression", origin: "Francis Galton’s “regression towards mediocrity” (1886): tall parents tend to have shorter children.", note: "Extreme measurements drift back toward the average — the line “regresses” to the mean."},
{term: "lm", origin: "Short for “linear model”.", note: "The workhorse function for regression in R."},
{term: "kNN", origin: "“k-nearest neighbors”: the name is the algorithm — vote among the k closest points.", note: "No model is “fit”; the training data IS the model."},
{term: "residual", origin: "From Latin “residuum”, remainder.", note: "What remains after the model has explained what it can."},
{term: "coefficient", origin: "“co-” (together) + “efficient” (producing an effect).", note: "Numbers that work together to produce the prediction."},
{term: "R-squared", origin: "“R” for regression/correlation: the squared correlation between actual and predicted values.", note: "Values near 1 mean the model tracks the data closely."}
]
}
]
};

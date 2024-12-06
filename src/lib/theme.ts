import { createTheme } from "@material-ui/core/styles";

export const colours = {
  light: ["#E27D60", "#85DCB0", "#E8A87C", "#C38D9E", "#41B3A3"],
  dark: ["#5a2111", "#1a5b3b", "#643212", "#492732", "#163c37"],
};

const largeHeadings = {
  fontFamily: "'Baloo 2'",
  fontWeight: 600,
};
const smallHeadings = {
  fontFamily: "'Baloo 2'",
  fontWeight: 400,
};

export const fadeProperty = `linear-gradient(90deg, ${colours.light[0]} 0%, ${colours.light[0]} 30%, ${colours.light[2]} 100%)`;

export const backgroundFade = {
  background: fadeProperty,
};

export const theme = createTheme({
  typography: {
    fontFamily: "'Quicksand', sans-serif",
    fontWeightRegular: 600,
    h1: {
      ...largeHeadings,
      fontSize: "3rem",
    },
    h2: {
      ...largeHeadings,
      fontSize: "2.75rem",
    },
    h3: {
      ...largeHeadings,
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h4: {
      ...smallHeadings,
      fontSize: "2.25rem",
    },
    h5: {
      ...smallHeadings,
      fontSize: "2rem",
    },
    h6: {
      ...smallHeadings,
      fontSize: "1.5rem",
    },
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: backgroundFade,
    },
    MuiButton: {
      text: {
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: 800,
      },
    },
    MuiChip: {
      label: {
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: 600,
      },
    },
  },
  palette: {
    primary: {
      main: colours.light[0],
      contrastText: "#111",
    },
    secondary: {
      main: colours.dark[0],
      contrastText: "#eee",
    },
  },
});

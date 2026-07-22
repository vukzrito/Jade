import { createTheme, MantineColorsTuple } from '@mantine/core';

const blurple: MantineColorsTuple = [
  '#E0E3FF',
  '#C7CDFF',
  '#A1A9FF',
  '#7A85FF',
  '#5865F2',
  '#4752C4',
  '#363E96',
  '#252B68',
  '#14173A',
  '#000000',
];

const jade: MantineColorsTuple = [
  '#E0F5F0',
  '#B3E6D8',
  '#80D6BE',
  '#4DC6A4',
  '#26B98F',
  '#00A97F',
  '#009970',
  '#008861',
  '#007752',
  '#005F3E',
];

export const theme = createTheme({
  primaryColor: 'jade',
  colors: {
    blurple,
    jade,
  },
  primaryShade: 5,
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        size: 'sm',
      },
    },
    Input: {
      defaultProps: {
        size: 'sm',
      },
    },
    Table: {
      defaultProps: {
        striped: true,
        highlightOnHover: true,
        withTableBorder: true,
      },
    },
    Card: {
      defaultProps: {
        padding: 'lg',
        radius: 'md',
        withBorder: true,
      },
    },
  },
});

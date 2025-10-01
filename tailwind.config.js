const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      typography: {
        github: {
          css: {
            maxWidth: '100%',
            color: colors.gray[800],
            a: { color: colors.blue[600], textDecoration: 'underline' },
            h1: { fontSize: '2em', borderBottom: `1px solid ${colors.gray[300]}`, paddingBottom: '0.3em' },
            h2: { fontSize: '1.5em', borderBottom: `1px solid ${colors.gray[200]}`, paddingBottom: '0.3em' },
            h3: { fontSize: '1.25em' },
            code: {
              backgroundColor: colors.gray[100],
              padding: '0.2em 0.4em',
              borderRadius: '4px',
              fontSize: '85%',
            },
            pre: {
              backgroundColor: colors.gray[900],
              color: colors.gray[100],
              padding: '1em',
              borderRadius: '6px',
              overflowX: 'auto',
            },
            blockquote: {
              borderLeft: `0.25em solid ${colors.gray[300]}`,
              paddingLeft: '1em',
              color: colors.gray[600],
              fontStyle: 'italic',
              backgroundColor: colors.gray[50],
            },
            table: {
              borderCollapse: 'collapse',
              width: '100%',
            },
            'th, td': {
              border: `1px solid ${colors.gray[300]}`,
              padding: '6px 13px',
            },
            th: { backgroundColor: colors.gray[100], fontWeight: 'bold' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
};


// module.exports = {
//   webpack5: true,
//   webpack: (config) => {
//     config.resolve.fallback = {
//       fs: false,
//       querystring: false,
//       http: false,
//       https: false,
//       os: false,
//       path: false,
//       child_process: false
//     };

//     return config;
//   },
// };
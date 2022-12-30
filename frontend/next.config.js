/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   rewrites: [
//     {
//       source: "/",
//       destination: "http://localhost:4000/",
//     },
//   ]
// }

// export default () => {
//   const rewrites = () => {
//     return [
//       {
//         source: "/",
//         destination: "http://localhost:4000/",
//       },
//     ];
//   };
//   return {
//     rewrites,
//   };
// };
module.exports = {
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: 'http://localhost:4000/graphql' // Proxy to Backend
      }
    ]
  }
}

// module.exports = () => {
//   const rewrites = () => {
//     return [
//       {
//         source: "/graphql",
//         destination: "http://localhost:4000",
//       },
//     ];
//   };
//   return {
//     rewrites,
//     reactStrictMode: true,
//     swcMinify: true,
//   };
// };
// module.exports = nextConfig

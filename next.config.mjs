/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add OpenLayers to the transpiled modules
    // transpilePackages: ['ol'],

    // reactStrictMode: true,

    // Add a custom webpack configuration
    // webpack: (config, { isServer }) => {
    //     console.log(isServer)
    //     // Add a resolve alias specifically for the problematic module
    //     config.resolve.alias['ol/layer/tile'] = path.resolve(__dirname, 'node_modules/ol/layer/Tile.js');
    //     return config;
    // },

};

export default nextConfig;

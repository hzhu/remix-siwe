/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverDependenciesToBundle: [
    "wagmi",
    "@rainbow-me/rainbowkit",
    "@rainbow-me/rainbowkit/wallets",
    "wagmi/connectors/injected",
    "wagmi/providers/public",
    "wagmi/providers/alchemy",
    "wagmi/connectors/walletConnect",
    "wagmi/connectors/coinbaseWallet",
    "wagmi/connectors/metaMask",
    "@wagmi/core",
    "@wagmi/core/internal",
    "@wagmi/connectors/injected",
    "@wagmi/core/providers/alchemy",
    "@wagmi/core/providers/public",
    "@wagmi/core/connectors/walletConnect",
    "@wagmi/core/connectors/coinbaseWallet",
    "@wagmi/core/connectors/metaMask",
  ],
};

interface Config {
  oauth_uri: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
}
const config: Config = {
  oauth_uri: "https://github.com/login/oauth/authorize",
  redirect_uri: "https://biaochenxuying.cn/login", // 请修改成你的信息
  client_id: "XXXXXXXXX", // 请修改成你的信息
  client_secret: "XXXXXXXXX" // 请修改成你的信息
};

// 本地开发环境下 （如下的信息在本地开发可以当测试用）
if (import.meta.env.MODE === "development") {
  config.redirect_uri = "http://localhost:3001/login";
  config.client_id = "502176cec65773057a9e";
  config.client_secret = "65d444de381a026301a2c7cffb6952b9a86ac235";
}
export default config;

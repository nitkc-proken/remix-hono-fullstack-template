// 公開する環境変数
export const PublicEnvs = ["HOST", "USE_MOCK"] as const;

type PublicEnvType = (typeof PublicEnvs)[number];
export type Env = {
	[K in PublicEnvType]: string;
};

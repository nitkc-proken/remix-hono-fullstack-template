# リポジトリ(Repository)
今回、バックエンドに縛られない開発をするためにリポジトリの概念を導入してみている。

APIと実際に通信するメイン実装と、APIの挙動を模倣するモック実装を分けることで、バックエンドの実装ができる前にフロントエンドの開発を進めることができる。

以下のコードはRepositoryを実装する例

[taskRepository.ts](/apps/remix/app/lib/repositories/taskRepository.ts)のコメント付き版
```ts

import type { Task, TaskContents } from "../types/task";
import { rpc } from "../utils/hc";
import { mock, mockWithArray } from "../utils/mock";
// Repositoryの型を定義する
type TaskRepository = {
	listTask(): Promise<Task[]>;
	addTask(title: string): Promise<Task>;
	updateTask(taskId: string, updatedTask: Partial<TaskContents>): Promise<Task>;
	removeTask(taskId: string): Promise<boolean>;
};

// メイン実装
const TaskRepositoryImpl = {
	async listTask() {
		...
	},
	async addTask(title) {
		...
	},
	async updateTask(taskId, updatedTask) {
		...
	},
	async removeTask(taskId) {
		...
	},
} satisfies TaskRepository; // satisfiesは型を満たすかどうかをチェックするもの

// モック実装
const TaskRepositoryMock = mockWithArray<Task, TaskRepository>(
	"task",
  // dbは配列。これにデータを入れたり削除したりすれば疑似DBのようになる。
	(db) =>
		({
			async listTask() {
				...
			},
			async addTask(title) {
				...
			},
			async updateTask(taskId, updatedTask) {
				...
			},
			async removeTask(taskId) {
				...
			},
		}) satisfies TaskRepository,
  // 最初から入れておくデータ
	[
		{
			id: "1",
			title: "task1",
			completed: false,
			created: new Date(),
		},
		{
			id: "2",
			title: "task2",
			completed: false,
			created: new Date(),
		},
	],
);

// .env 内の環境変数 `USE_MOCK` によってモックを使うかどうか切り替える
export default mock(TaskRepositoryImpl, TaskRepositoryMock);
// モックがいらない場合は以下のようにそのままexportする
// export default TaskRepositoryImpl;
```
